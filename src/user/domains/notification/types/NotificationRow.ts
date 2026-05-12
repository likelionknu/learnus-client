export interface NotificationRow {
  id: number;
  type: string | null;
  content: string;
  createdAt: string;
  read: boolean;
  assignmentId: number | null;
  fileId: number | null;
  noticeId: number | null;
  questionId: number | null;
  sessionId: number | null;
}
