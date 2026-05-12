export interface TabItemConfig {
  label: string;
  path: string;
  end?: boolean;
}

export const ADMIN_DASHBOARD_TAG_ITEMS: TabItemConfig[] = [
  { label: "대시보드", path: "dashboard" },
  { label: "자료 관리", path: "files" },
  { label: "과제 관리", path: "assignments" },
];

export const ADMIN_MANAGEMENT_TAG_ITEMS: TabItemConfig[] = [
  { label: "세션 관리", path: "/admin/sessions", end: true },
  { label: "사용자 및 그룹", path: "/admin/groups", end: true },
  { label: "질문 및 답변", path: "/admin/questions" },
  { label: "공지사항", path: "/admin/notices", end: true },
];

export const USER_SESSION_TAG_ITEMS: TabItemConfig[] = [
  { label: "자료", path: "files" },
  { label: "과제", path: "assignments" },
  { label: "사용자 및 그룹", path: "groups" },
  { label: "질문 및 답변", path: "questions" },
];
