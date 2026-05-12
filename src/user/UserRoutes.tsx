import { lazy, Suspense, type ReactElement } from "react";
import type { RouteObject } from "react-router-dom";
import { SessionTabLayout } from "@shared/layouts";

const UserDashboardPage = lazy(
  () => import("@/user/domains/dashboard/pages/UserDashboardPage"),
);
const UserSessionQuestionsPage = lazy(
  () => import("./domains/session/pages/question/UserSessionQuestionsPage"),
);
const UserSessionQuestionCreatePage = lazy(
  () =>
    import("./domains/session/pages/question/UserSessionQuestionCreatePage"),
);
const UserSessionGroupPage = lazy(
  () => import("./domains/session/pages/UserSessionGroupPage"),
);
const UserSessionSelect = lazy(
  () => import("./domains/session/pages/UserSessionSelect"),
);
const UserSessionAssignments = lazy(
  () => import("./domains/session/pages/UserSessionAssignments"),
);
const UserSessionAssignmentsView = lazy(
  () => import("./domains/session/pages/UserSessionAssignmentsView"),
);
const UserSessionFilesPage = lazy(
  () => import("./domains/session/pages/UserSessionFilesPage"),
);
const UserSessionFilesViewPage = lazy(
  () => import("./domains/session/pages/UserSessionFilesViewPage"),
);
const UserListPage = lazy(() => import("./domains/session/pages/UserList"));
const UserQuestionsPage = lazy(
  () => import("./domains/question/pages/UserQuestionsPage"),
);
const UserQuestionDetailPage = lazy(
  () => import("./shared/pages/UserQuestionDetailPage"),
);
const UserNotificationPage = lazy(
  () => import("./domains/notification/pages/UserNotificationPage"),
);

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={null}>{element}</Suspense>
);

const userRoutes: RouteObject[] = [
  {
    children: [
      {
        path: "dashboard",
        element: withSuspense(<UserDashboardPage />),
        handle: { title: "대시보드" },
      },
      {
        path: "sessions",
        element: withSuspense(<UserSessionSelect />),
        handle: { title: "세션" },
      },
      {
        path: "notification",
        element: withSuspense(<UserNotificationPage />),
        handle: { title: "알림" },
      },
      {
        path: "questions",
        element: withSuspense(<UserQuestionsPage />),
        handle: { title: "질문" },
      },
      {
        path: "list",
        element: withSuspense(<UserListPage />),
        handle: { title: "그룹" },
      },
      {
        path: "questions/:questionId/:sessionId",
        element: withSuspense(<UserQuestionDetailPage />),
        handle: { title: "질문 상세" },
      },
    ],
  },

  {
    path: "sessions/:sid",
    element: <SessionTabLayout tabType="userSession" />,
    handle: { title: "세션" },
    children: [
      { path: "files", element: withSuspense(<UserSessionFilesPage />) },
      {
        path: "files/:fileId",
        element: withSuspense(<UserSessionFilesViewPage />),
      },
      {
        path: "assignments",
        element: withSuspense(<UserSessionAssignments />),
      },
      {
        path: "assignments/:assignmentId",
        element: withSuspense(<UserSessionAssignmentsView />),
      },
      { path: "groups", element: withSuspense(<UserSessionGroupPage />) },
      {
        path: "questions",
        element: withSuspense(<UserSessionQuestionsPage />),
      },
      {
        path: "questions/new",
        element: withSuspense(<UserSessionQuestionCreatePage />),
      },
    ],
  },
];

export default userRoutes;
