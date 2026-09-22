import React, { Suspense, lazy } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Loader2 } from 'lucide-react';
import ScrollToTop from './components/shared/ScrollToTop.jsx';

// Lazy loaded page components for optimal bundle splitting
const Home = lazy(() => import("./components/Home.jsx"));
const Login = lazy(() => import("./components/auth/Login.jsx"));
const Signup = lazy(() => import("./components/auth/Signup.jsx"));
const Jobs = lazy(() => import("./components/jobs.jsx"));
const JobDescription = lazy(() => import("./components/JobDescription.jsx"));
const Profile = lazy(() => import('./components/Profile.jsx'));

// Admin / Recruiter Components
const Companies = lazy(() => import("./components/admin/Companies.jsx"));
const CompanyCreate = lazy(() => import("./components/admin/CompanyCreate.jsx"));
const CompanySetup = lazy(() => import("./components/admin/CompanySetup.jsx"));
const AdminJobs = lazy(() => import("./components/admin/AdminJobs.jsx"));
const PostJob = lazy(() => import("./components/admin/PostJob.jsx"));
const EditJob = lazy(() => import("./components/admin/EditJob.jsx"));
const Applicants = lazy(() => import("./components/admin/Applicants.jsx"));

// Guard Components
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
import PublicRoute from "./components/shared/PublicRoute.jsx";
import NotFound from "./components/shared/NotFound.jsx";

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Loading Page...</span>
  </div>
);

const RootLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Candidate / Public Routes
      {
        path: "/",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        )
      },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Suspense fallback={<PageLoader />}>
          <Login />
        </Suspense>
      </PublicRoute>
    )
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Suspense fallback={<PageLoader />}>
          <Signup />
        </Suspense>
      </PublicRoute>
    )
  },
  {
    path: "/jobs",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Jobs />
      </Suspense>
    )
  },
  {
    path: "/description/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <JobDescription />
      </Suspense>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute studentOnly={true}>
        <Suspense fallback={<PageLoader />}>
          <Profile />
        </Suspense>
      </ProtectedRoute>
    )
  },

  // Recruiter / Admin Routes
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Suspense fallback={<PageLoader />}>
          <Companies />
        </Suspense>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Suspense fallback={<PageLoader />}>
          <CompanyCreate />
        </Suspense>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Suspense fallback={<PageLoader />}>
          <CompanySetup />
        </Suspense>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Suspense fallback={<PageLoader />}>
          <AdminJobs />
        </Suspense>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Suspense fallback={<PageLoader />}>
          <PostJob />
        </Suspense>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/jobs/edit/:id",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Suspense fallback={<PageLoader />}>
          <EditJob />
        </Suspense>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Suspense fallback={<PageLoader />}>
          <Applicants />
        </Suspense>
      </ProtectedRoute>
    )
  },

  // 404 Catch-All Route
  {
    path: "*",
    element: <NotFound />
  }
    ]
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
