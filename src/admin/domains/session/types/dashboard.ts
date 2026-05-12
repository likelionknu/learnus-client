export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
}

export interface AdminDashboardMemberRow {
  userId: number;
  course: number;
  name: string;
  part: string;
  email: string;
  registeredAt: string;
  invitedBy: string;
}

export interface MemberState {
  name: string;
  profileUrl: string;
  userId: number;
}
