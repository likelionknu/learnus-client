export interface AdminQuestionComment {
  id: number;
  author: string;
  createdLabel: string;
  content: string;
  isMine?: boolean;
}

export interface AdminQuestionCommentResponse {
  id: number;
  createdUserName: string;
  createdAt: string;
  content: string;
  mine?: boolean;
  isMine?: boolean;
}

export type AdminQuestionStatus = "COMPLETED" | "PENDING";

export interface AdminQuestionDetailResponse {
  id?: number;
  questionId?: number;
  title?: string;
  name?: string;
  createdAt: string;
  createdBy?: string | null;
  createdUserName?: string | null;
  answeredAt: string | null;
  answeredBy?: string | null;
  answeredUserName?: string | null;
  status: AdminQuestionStatus;
  content: string;
  answer: string | null;
}

export interface AdminQuestionDetail {
  questionId: number;
  title: string;
  createdAt: string;
  createdBy: string;
  answeredAt: string | null;
  answeredBy: string | null;
  status: AdminQuestionStatus;
  question: string;
  answer: string | null;
  comments: readonly AdminQuestionComment[];
}
