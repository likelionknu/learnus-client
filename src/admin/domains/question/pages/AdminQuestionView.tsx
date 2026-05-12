import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TitleSection } from "@/shared/components";
import { ErrorModal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { getAdminQuestionDetail } from "../apis";
import { AdminQuestionDetailContent } from "../components";
import type { AdminQuestionDetail } from "../types";

function parsePositiveInteger(value: string | null) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function AdminQuestionView() {
  const [searchParams] = useSearchParams();
  const questionId = parsePositiveInteger(searchParams.get("qid"));
  const [question, setQuestion] = useState<AdminQuestionDetail | null>(null);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchQuestionDetail = async () => {
      if (!questionId) {
        setQuestion(null);
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
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setQuestion(null);
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
          <TitleSection title="질문 상세" />
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
          <TitleSection title="질문 상세" />
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
          <TitleSection title="질문 상세" />
          <div className="rounded-ec-10 bg-ec-white text-ec-sub px-10 py-10 text-sm">
            질문 정보를 찾을 수 없어요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}
      <AdminQuestionDetailContent qid={questionId} question={question} />
    </>
  );
}

export default AdminQuestionView;
