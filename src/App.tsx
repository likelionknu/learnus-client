import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AdminRoutes } from "@admin";
import { BaseLayout } from "@shared/layouts";
import { UserRoutes } from "@user";
import { lazy, Suspense, type ReactElement } from "react";

const GoogleCallback = lazy(() => import("@auth/api/GoogleCallback"));
const LoginPage = lazy(() => import("@auth/pages/LoginPage"));
const LoginErrorPage = lazy(() => import("@auth/pages/LoginErrorPage"));
const ErrorPage = lazy(() => import("@shared/pages/ErrorPage"));
const MaintenancePage = lazy(() => import("@shared/pages/MaintenancePage"));
const PreparingPage = lazy(() => import("@shared/pages/PreparingPage"));
const PrivacyPolicyPage = lazy(() => import("@shared/pages/PrivacyPolicyPage"));
const ScreenSizeErrorPage = lazy(
  () => import("@shared/pages/ScreenSizeErrorPage"),
);

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={null}>{element}</Suspense>
);

const router = createBrowserRouter([
  { path: "/", element: withSuspense(<GoogleCallback />) },
  {
    path: "/auth/login",
    element: withSuspense(<LoginPage />),
    handle: { title: "Login" },
  },
  {
    path: "/auth/login-error",
    element: withSuspense(<LoginErrorPage />),
    handle: { title: "Login Error" },
  },
  {
    path: "/preparing",
    element: withSuspense(<PreparingPage />),
    handle: { title: "Preparing" },
  },
  {
    path: "/maintenance",
    element: withSuspense(<MaintenancePage />),
    handle: { title: "Maintenance" },
  },
  {
    path: "/privacy-policy",
    element: withSuspense(<PrivacyPolicyPage />),
    handle: { title: "Privacy Policy" },
  },
  {
    path: "/screen-size-error",
    element: <ScreenSizeErrorPage />,
    handle: { title: "화면 크기 에러 페이지" },
  },
  {
    path: "/user",
    element: <BaseLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      ...UserRoutes,
    ],
  },
  {
    path: "/admin",
    element: <BaseLayout />,
    children: [
      { index: true, element: <Navigate to="sessions" replace /> },
      ...AdminRoutes,
    ],
  },
  {
    path: "*",
    element: withSuspense(<ErrorPage />),
    handle: { title: "Not Found" },
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
