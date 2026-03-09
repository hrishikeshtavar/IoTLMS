import http from 'k6/http';
import { check } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const serverErrors = new Rate('server_errors');
const unexpectedStatus = new Rate('unexpected_status');
const throttled = new Rate('throttled');
const status2xx = new Counter('status_2xx');
const status4xx = new Counter('status_4xx');
const status429 = new Counter('status_429');
const status5xx = new Counter('status_5xx');
const REQUESTS_PER_ITERATION = 3;
const TARGET_RPS = Number(__ENV.TARGET_RPS ?? 200);
const TARGET_ITERATIONS_PER_SEC = Math.ceil(TARGET_RPS / REQUESTS_PER_ITERATION);

export const options = {
  scenarios: {
    default: {
      executor: 'constant-arrival-rate',
      rate: TARGET_ITERATIONS_PER_SEC,
      timeUnit: '1s',
      duration: '2m30s',
      preAllocatedVUs: 100,
      maxVUs: 300,
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    server_errors: ['rate<0.05'],
  },
};

const BASE = 'http://localhost:3001';
const TOKEN = __ENV.TOKEN;

function trackResponse(endpoint, response, acceptedStatuses) {
  const { status } = response;
  const tags = { endpoint };

  if (status >= 200 && status < 300) status2xx.add(1, tags);
  if (status >= 400 && status < 500) status4xx.add(1, tags);
  if (status === 429) status429.add(1, tags);
  if (status >= 500) status5xx.add(1, tags);

  const isThrottled = status === 429;
  const isExpected = acceptedStatuses.includes(status) || isThrottled;

  serverErrors.add(status >= 500);
  throttled.add(isThrottled);
  unexpectedStatus.add(!isExpected && status < 500);
  check(response, { [`${endpoint} ok`]: () => isExpected });
}

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
  };

  const health = http.get(`${BASE}/api/health`);
  trackResponse('health', health, [200]);

  const courses = http.get(`${BASE}/api/courses`, { headers });
  trackResponse('courses', courses, [200, 401]);

  const analytics = http.get(`${BASE}/api/analytics/dashboard`, { headers });
  trackResponse('analytics', analytics, [200, 401]);

}
