import type { ButtonVariant } from "@/shared/types";

export type QuestionDetailModalType = "questionDelete" | "commentCreate";

export interface QuestionDetailModalStep {
  step?: 1 | 2;
  title: string;
  description: string;
  confirmText: string;
  confirmVariant: ButtonVariant;
  showCancel: boolean;
}

export const questionDetailModalStepData: Record<
  QuestionDetailModalType,
  readonly QuestionDetailModalStep[]
> = {
  questionDelete: [
    {
      step: 1,
      title: "질문 삭제",
      description:
        "질문을 정말 삭제하시겠어요? 이 질문을 그대로 남겨두어\n다른 사용자에게 도움이 될 수 있도록 도와주세요",
      confirmText: "삭제",
      confirmVariant: "danger",
      showCancel: true,
    },
    {
      step: 2,
      title: "질문 삭제",
      description: "질문을 삭제했어요",
      confirmText: "확인",
      confirmVariant: "primary",
      showCancel: false,
    },
  ],
  commentCreate: [
    {
      title: "새 댓글 등록",
      description: "이 질문 게시글에 댓글을 등록할게요",
      confirmText: "확인",
      confirmVariant: "primary",
      showCancel: true,
    },
  ],
};
