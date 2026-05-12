import { lazy, Suspense, type ReactElement } from "react";
import type { RouteObject } from "react-router-dom";
import { SessionTabLayout } from "@/shared/layouts";

const AdminSessionsPage = lazy(
  () => import("./domains/management/pages/AdminSessionsPage"),
);
const AdminGroupPage = lazy(
  () => import("./domains/management/pages/AdminGroupPage"),
);
const AdminQuestionPage = lazy(
  () => import("./domains/management/pages/AdminQuestionPage"),
);
const AdminNotionPage = lazy(
  () => import("./domains/management/pages/AdminNotionPage"),
);
const NoticeUploadPage = lazy(
  () => import("./domains/management/pages/NoticeUploadPage"),
);
const NoticeViewPage = lazy(
  () => import("./domains/management/pages/NoticeViewPage"),
);
const NoticeModifyPage = lazy(
  () => import("./domains/management/pages/NoticeModifyPage"),
);
const DataManagementPage = lazy(
  () => import("./domains/session/pages/DataManagementPage"),
);
const TaskManagementPage = lazy(
  () => import("./domains/session/pages/TaskManagementPage"),
);
const FilesViewPage = lazy(
  () => import("./domains/session/pages/FilesViewPage"),
);
const FilesUploadPage = lazy(
  () => import("./domains/session/pages/FilesUploadPage"),
);
const FilesModifyPage = lazy(
  () => import("./domains/session/pages/FilesModifyPage"),
);
const AdminDashboardPage = lazy(
  () => import("./domains/session/pages/AdminDashboardPage"),
);
const AdminSessionAssignmentsView = lazy(
  () => import("./domains/session/pages/AdminSessionAssignmentsView"),
);
const AdminSessionAssignmentUpload = lazy(
  () => import("./domains/session/pages/AdminSessionAssignmentUpload"),
);
const AdminQuestionView = lazy(
  () => import("./domains/question/pages/AdminQuestionView"),
);
const AdminQuestionManageView = lazy(
  () => import("./domains/question/pages/AdminQuestionManageView"),
);

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={null}>{element}</Suspense>
);

const adminRoutes: RouteObject[] = [
  {
    element: <SessionTabLayout tabType="adminManagement" />,
    children: [
      { path: "sessions", element: withSuspense(<AdminSessionsPage />) },
      { path: "groups", element: withSuspense(<AdminGroupPage />) },
      { path: "questions", element: withSuspense(<AdminQuestionPage />) },
      {
        handle: { title: "질문" },
        path: "questions/detail",
        element: withSuspense(<AdminQuestionView />),
      },
      {
        path: "questions/manage",
        element: withSuspense(<AdminQuestionManageView />),
        handle: { title: "질문" },
      },
      { path: "notices", element: withSuspense(<AdminNotionPage />) },
      { path: "notices/upload", element: withSuspense(<NoticeUploadPage />) },
      { path: "notices/:nid", element: withSuspense(<NoticeViewPage />) },
      {
        path: "notices/:nid/modify",
        element: withSuspense(<NoticeModifyPage />),
      },
    ],
  },
  {
    path: "sessions/:sid",
    element: <SessionTabLayout tabType="adminDashboard" />,
    handle: { title: "세션 관리" },
    children: [
      { path: "dashboard", element: withSuspense(<AdminDashboardPage />) },
      { path: "assignments", element: withSuspense(<TaskManagementPage />) },
      {
        path: "assignments/upload",
        element: withSuspense(<AdminSessionAssignmentUpload />),
      },
      {
        path: "assignments/:aid",
        element: withSuspense(<AdminSessionAssignmentsView />),
      },
      { path: "files", element: withSuspense(<DataManagementPage />) },
      { path: "files/upload", element: withSuspense(<FilesUploadPage />) },
      { path: "files/:fid", element: withSuspense(<FilesViewPage />) },
      { path: "files/:fid/modify", element: withSuspense(<FilesModifyPage />) },
    ],
  },
];

export default adminRoutes;
