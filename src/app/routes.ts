import { createBrowserRouter } from 'react-router';
import Layout from './Layout';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseCatalog from './pages/CourseCatalog';
import LessonPlayer from './pages/LessonPlayer';
import AdminDashboard from './pages/AdminDashboard';
import BrandWizard from './pages/BrandWizard';
import LessonEditor from './pages/LessonEditor';
import OfflineMode from './pages/mobile/OfflineMode';
import StudentProgress from './pages/mobile/StudentProgress';
import Certificate from './pages/mobile/Certificate';
import Onboarding from './pages/mobile/Onboarding';
import Labs from './pages/Labs';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/landing',
    Component: Landing,
  },
  {
    path: '/lesson',
    Component: LessonPlayer,
  },
  {
    path: '/admin',
    Component: AdminDashboard,
  },
  {
    path: '/wizard',
    Component: BrandWizard,
  },
  {
    path: '/editor',
    Component: LessonEditor,
  },
  {
    path: '/mobile/offline',
    Component: OfflineMode,
  },
  {
    path: '/mobile/progress',
    Component: StudentProgress,
  },
  {
    path: '/mobile/certificate',
    Component: Certificate,
  },
  {
    path: '/mobile/onboarding',
    Component: Onboarding,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'courses',
        Component: Courses,
      },
      {
        path: 'catalog',
        Component: CourseCatalog,
      },
      {
        path: 'labs',
        Component: Labs,
      },
      {
        path: 'progress',
        Component: Progress,
      },
      {
        path: 'profile',
        Component: Profile,
      },
    ],
  },
]);