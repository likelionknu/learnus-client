export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
}

export type AdminSessionStatus = string;

export interface AdminSessionRow {
  sessionId: number;
  name: string;
  createdBy: string;
  userCount: number;
  fileCount: number;
  assignmentCount: number;
  status: AdminSessionStatus;
}

export interface AdminGroupRow {
  id: number;
  course: number;
  part: string;
  name: string;
  email: string;
  joinedAt: string;
  penaltyPoint: number;
  useable: boolean;
}

export type GroupIconType = "memo" | "change" | "demerit" | "stop" | "restore";
