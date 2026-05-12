import type { AdminQuestionComment, AdminQuestionDetail } from "../types";

const QUESTION_BODY =
  "나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라나도몰라";

const mockComments: readonly AdminQuestionComment[] = [
  {
    id: 1,
    author: "김찬주",
    createdLabel: "3일 전",
    content:
      "헉 이거 저도 궁금했는데 빨리 답변 내놓으세요헉 이거 저도 궁금했는데 빨리 답변 내놓으세요헉 이거 저도 궁금했는데 빨리 답변 내놓으세요헉 이거 저도 궁금했는데 빨리 답변 내",
  },
  {
    id: 2,
    author: "김찬주",
    createdLabel: "3일 전",
    content: "헉 이거 저도 궁금한데 빨리 답변 내용으세요",
    isMine: true,
  },
];

const baseAdminQuestionDetail = {
  questionId: 1,
  title: "이거 도대체 무슨말이에요?",
  createdAt: "2026-02-10T11:30:00",
  createdBy: "전윤환",
  answeredBy: "황형진",
  question: QUESTION_BODY,
  comments: mockComments,
} as const;

export const mockAdminQuestionDetail: AdminQuestionDetail = {
  ...baseAdminQuestionDetail,
  answeredAt: null,
  answeredBy: null,
  status: "PENDING",
  answer: null,
};

export const mockAdminQuestionManageDetail: AdminQuestionDetail = {
  ...baseAdminQuestionDetail,
  answeredAt: "2026-02-10T11:30:00",
  status: "COMPLETED",
  answer: "아직 답변을 기다리고 있어요",
};
