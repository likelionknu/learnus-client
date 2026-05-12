import { useState } from "react";
import { Button } from "..";
import { ErrorModal, Modal } from "../modal";
import { createComment } from "@/user/shared/apis";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";

interface CommentInputProps {
  qid: number;
  setRefresh?: (updater: (prev: number) => number) => void;
}

function CommentInput({ qid, setRefresh }: CommentInputProps) {
  const [content, setContent] = useState(""); // 댓글 입력 상태
  const [step, setStep] = useState<"CONFIRM" | "DONE" | null>(null); // 모달 상태
  const [errors, setErrors] = useState<CommonErrorState | null>(null); // 에러 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태

  // 모달 활성화
  const handleOpenConfirm = () => {
    if (!content.trim()) return;
    setStep("CONFIRM");
  };

  // 모달 비활성화
  const handleClose = () => {
    if (isSubmitting) return;
    setStep(null);
  };

  const handleDone = () => {
    setContent(""); // 인풋 초기화
    setStep(null);
    setRefresh?.((prev) => prev + 1); // 등록 성공 시 댓글 재조회
  };

  // 댓글 등록
  const handleCreateComment = async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await createComment({
        qid,
        content: content.trim(),
      });

      setErrors(null); // 에러 초기화
      setStep("DONE"); // 확인 모달
    } catch (error) {
      setStep(null); // 모달 비활성화
      setErrors(getCommonErrorState(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}

      {step && (
        <Modal>
          <Modal.Header onClick={step === "CONFIRM" ? handleClose : handleDone}>
            새 댓글 등록
          </Modal.Header>
          <Modal.Description>
            {step === "CONFIRM"
              ? "이 질문 게시글에 댓글을 등록할게요."
              : "게시글에 댓글을 등록했어요."}
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="modal"
              variant="primary"
              isLoading={isSubmitting}
              onClick={step === "CONFIRM" ? handleCreateComment : handleDone}
            >
              확인
            </Button>
            {step === "CONFIRM" && !isSubmitting && (
              <Modal.Cancelled
                onClick={step === "CONFIRM" ? handleClose : handleDone}
              />
            )}
          </Modal.ButtonLayout>
        </Modal>
      )}

      <div className="flex gap-4 xl:mt-5">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 남겨보세요"
          className="bg-ec-box md:bg-ec-white text-ec-black placeholder:text-ec-sub rounded-ec-10 font-pretendard tracking-ec-normal flex-1 px-4 py-2 text-[14px]/[23px] font-medium"
        />
        <Button size="large" variant="primary" onClick={handleOpenConfirm}>
          등록
        </Button>
      </div>
    </>
  );
}

export default CommentInput;
