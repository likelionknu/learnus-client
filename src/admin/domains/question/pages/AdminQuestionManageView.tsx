import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TitleSection } from "@/shared/components";
import { ErrorModal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { getAdminQuestionDetail, updateAdminQuestionAnswer } from "../apis";
import { AdminQuestionDeleteModal, AdminQuestionDetailContent } from "../components";
import type { AdminQuestionDetail } from "../types";

const ANSWER_MAX_LENGTH = 700;

function parsePositiveInteger(value: string | null) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function AdminQuestionManageView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = parsePositiveInteger(searchParams.get("qid"));
  const [question, setQuestion] = useState<AdminQuestionDetail | null>(null);
  const [answerDraft, setAnswerDraft] = useState("");
  const [errors, setErrors] = useState<CommonErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const answerCharacterCount = Array.from(answerDraft).length;
  const canEditAnswer = Boolean(question && question.status !== "COMPLETED");
  const canSubmitAnswer =
    canEditAnswer &&
    answerDraft.trim().length > 0 &&
    answerCharacterCount <= ANSWER_MAX_LENGTH &&
    !isSubmitting;

  const handleRegisterAnswer = async () => {
    if (!questionId || !question || question.status === "COMPLETED") {
      return;
    }

    const trimmedAnswer = answerDraft.trim();

    if (!trimmedAnswer) {
      setErrors({
        status: "400",
        message: "답변 내용을 입력해주세요.",
      });
      return;
    }

    if (Array.from(trimmedAnswer).length > ANSWER_MAX_LENGTH) {
      setErrors({
        status: "400",
        message: "답변은 700자까지 입력할 수 있어요.",
      });
      return;
    }

    setIsSubmitting(true);
    setErrors(null);

    try {
      const updatedQuestion = await updateAdminQuestionAnswer({
        qid: questionId,
        answer: trimmedAnswer,
      });

      if (!updatedQuestion) {
        setErrors({
          status: "500",
          message: "답변 등록 결과를 불러오지 못했어요.",
        });
        return;
      }

      setQuestion(updatedQuestion);
      setAnswerDraft(updatedQuestion.answer ?? "");
    } catch (error) {
      setErrors(getCommonErrorState(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = [
    {
      label: "답변 등록",
      buttonType: "primary" as const,
      onClick: () => {
        void handleRegisterAnswer();
      },
      isSubmitting,
      disabled: !canSubmitAnswer,
    },
    {
      label: "삭제",
      buttonType: "danger" as const,
      onClick: () => setIsDeleteConfirmOpen(true),
      disabled: !question || isSubmitting,
    },
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchQuestionDetail = async () => {
      if (!questionId) {
        setQuestion(null);
        setAnswerDraft("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrors(null);

      try {
        const responseData = await getAdminQuestionDetail({ qid: questionId });

        if (!isMounted) {
          return;
        }

        setQuestion(responseData);
        setAnswerDraft(responseData?.answer ?? "");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setQuestion(null);
        setAnswerDraft("");
        setErrors(getCommonErrorState(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchQuestionDetail();

    return () => {
      isMounted = false;
    };
  }, [questionId]);

  if (!questionId) {
    return (
      <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 px-4 pt-7 pb-120 md:max-w-187.5 xl:mx-0 xl:max-w-280 xl:px-8">
        <div className="flex w-full max-w-251.5 flex-col gap-5">
          <TitleSection title="질문 상세" actions={actions} />
          <div className="rounded-ec-10 bg-ec-white text-ec-sub px-10 py-10 text-sm">
            조회할 질문 정보가 없어 `qid`를 확인해주세요.
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 px-4 pt-7 pb-120 md:max-w-187.5 xl:mx-0 xl:max-w-280 xl:px-8">
        <div className="flex w-full max-w-251.5 flex-col gap-5">
          <TitleSection title="질문 상세" actions={actions} />
          <div className="rounded-ec-10 bg-ec-white text-ec-sub px-10 py-10 text-sm">
            질문 정보를 불러오는 중이에요.
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 px-4 pt-7 pb-120 md:max-w-187.5 xl:mx-0 xl:max-w-280 xl:px-8">
        {errors && (
          <ErrorModal
            status={errors.status}
            message={errors.message}
            onClick={() => setErrors(null)}
          />
        )}
        <div className="flex w-full max-w-251.5 flex-col gap-5">
          <TitleSection title="질문 상세" actions={actions} />
          <div className="rounded-ec-10 bg-ec-white text-ec-sub px-10 py-10 text-sm">
            질문 정보를 찾을 수 없어요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {question && questionId && isDeleteConfirmOpen && (
        <AdminQuestionDeleteModal
          qid={questionId}
          title={question.title}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onSuccess={() => {
            navigate("/admin/questions", { replace: true });
          }}
        />
      )}
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}
      <AdminQuestionDetailContent
        qid={questionId}
        question={question}
        actions={actions}
        answerDraft={canEditAnswer ? answerDraft : undefined}
        answerMaxLength={canEditAnswer ? ANSWER_MAX_LENGTH : undefined}
        onAnswerChange={
          canEditAnswer
            ? (nextAnswer) => {
                setErrors(null);
                setAnswerDraft(nextAnswer);
              }
            : undefined
        }
      />
    </>
  );
}

export default AdminQuestionManageView;
