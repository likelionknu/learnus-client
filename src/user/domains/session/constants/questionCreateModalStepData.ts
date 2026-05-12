import type { ButtonVariant } from "@/shared/types";

export type QuestionCreateModalState = "confirm" | "success" | "error";

export interface QuestionCreateModalStep {
  step: 1 | 2 | 3;
  title: string;
  description: string;
  confirmText: string;
  confirmVariant: ButtonVariant;
  showCancel: boolean;
}

export const questionCreateModalStepData: Record<
  QuestionCreateModalState,
  QuestionCreateModalStep
> = {
  confirm: {
    step: 1,
    title: "새 질문 등록",
    description: "새로운 질문 게시글을 업로드할까요?",
    confirmText: "확인",
    confirmVariant: "primary",
    showCancel: true,
  },
  success: {
    step: 2,
    title: "새 질문 등록",
    description: "새로운 질문 게시글을 업로드했어요",
    confirmText: "확인",
    confirmVariant: "primary",
    showCancel: false,
  },
  error: {
    step: 3,
    title: "새 질문 등록",
    description: "요청을 다시 확인해주세요",
    confirmText: "확인",
    confirmVariant: "primary",
    showCancel: false,
  },
};
