import { useNavigate, useParams } from "react-router-dom";
import { TableEmptyState } from "@/shared/components/table";
import { PageNationButton, PageNationFrame, PageNationMenu, TitleSection } from "@/shared/components";
import { SessionQuestionTableHeader, SessionQuestionTableRows, SessionMobileQuestionTableRows } from "../../components/question";
import type { SessionQuestionRow } from "../../types";
import { useMediaQuery } from "react-responsive";
import { useCallback, useEffect, useState } from "react";
import { getSessionQuestions } from "../../apis";
import { ErrorModal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";

interface QuestionsPageState {
  questions: SessionQuestionRow[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

const INITIAL_QUESTIONS_PAGE_STATE: QuestionsPageState = {
  questions: [],
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
};

const SESSION_QUESTION_PAGE_SIZE = 8;

function UserSessionQuestionsPage() {
  const { sid } = useParams();
  const navigate = useNavigate();
  const [questionsPage, setQuestionsPage] = useState<QuestionsPageState>(
    INITIAL_QUESTIONS_PAGE_STATE,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);
  const itemSumNum = SESSION_QUESTION_PAGE_SIZE;
  const itemNum = questionsPage.totalElements;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isTablet = useMediaQuery({ maxWidth: 1023 });

  const handleCreateQuestion = useCallback(() => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    navigate("new");
  }, [isSubmitting, navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);

      try {
        const res = await getSessionQuestions({
          sid: Number(sid),
          page: currentPage - 1, // 서버 0-based
        });
        const responseData = res.data?.data ?? res.data;

        setQuestionsPage({
          questions: Array.isArray(responseData?.content)
            ? responseData.content
            : [],
          page: responseData?.number ?? 0,
          size: SESSION_QUESTION_PAGE_SIZE,
          totalElements: responseData?.totalElements ?? 0,
          totalPages: responseData?.totalPages ?? 0,
          hasNext: !(responseData?.last ?? true),
        });
      } catch (error) {
        setErrors(getCommonErrorState(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage, sid]);

  return (
    <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 px-4 pt-7 md:max-w-187.5 xl:max-w-251 xl:px-0">
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}

      <TitleSection
        title={`질문 및 답변(${questionsPage.totalElements})`}
        subText="궁금한 내용이 있다면 질문하고, 답변받을 수 있어요"
        actions={[
          {
            label: "새 질문 등록",
            buttonType: "primary",
            onClick: handleCreateQuestion,
            isSubmitting,
          },
        ]}
      />

      <PageNationFrame itemNum={itemNum} itemSumNum={itemSumNum}>
        {() => {
          const pagedQuestions = questionsPage.questions;

          return (
            <>
              {!isTablet && (
                <PageNationMenu>
                  <SessionQuestionTableHeader />
                </PageNationMenu>
              )}
              {pagedQuestions.length === 0 && !isLoading ? (
                <TableEmptyState label="등록된 세션 자료가 없어요." />
              ) : isTablet ? (
                <SessionMobileQuestionTableRows questions={pagedQuestions} />
              ) : (
                <SessionQuestionTableRows
                  isLoading={isLoading}
                  questions={pagedQuestions}
                />
              )}
              <PageNationButton onPageChange={setCurrentPage} />
            </>
          );
        }}
      </PageNationFrame>
    </div>
  );
}

export default UserSessionQuestionsPage;
