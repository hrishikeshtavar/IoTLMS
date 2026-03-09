import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
};

const BASE = 'http://localhost:3001';

export default function () {
  const res = http.post(`${BASE}/api/auth/login`, JSON.stringify({
    email: 'test@test.com',
    password: 'wrongpassword',
  }), { headers: { 'Content-Type': 'application/json', 'host': 'demo.localhost:3001' } });

  check(res, { 'login responds': r => r.status >= 200 && r.status < 500 });
  sleep(0.5);
}
