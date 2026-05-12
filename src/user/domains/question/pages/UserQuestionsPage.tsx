import { useMediaQuery } from "react-responsive";
import { SerachBar, PageNationButton, PageNationFrame, PageNationMenu, TitleSection, SelectBox } from "@/shared/components";
import { TableEmptyState } from "@/shared/components/table";
import { MobileQuestionsTableRows } from "@/user/domains/question/components";
import { QuestionTableHeader, QuestionTableRows } from "../components";
import type { SessionQuestionRow } from "../../session/types";
import { QUESTION_STATUS_DEFAULT_OPTION, QUESTION_STATUS_OPTIONS, QUESTION_STATUS_OPTION_TO_REQUEST_STATUS } from "@/shared/constants";
import { useEffect, useState } from "react";
import { ErrorModal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { getQuestions } from "../apis";

interface QuestionsPageState {
  questions: SessionQuestionRow[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

interface FilterState {
  title: string;
  status: string;
}

const QUESTION_PAGE_SIZE = 8;

const INITIAL_QUESTIONS_PAGE_STATE: QuestionsPageState = {
  questions: [],
  page: 0,
  size: QUESTION_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
};

function UserQuestionsPage() {
  // 질문 페이지 상태
  const [questionsPage, setQuestionsPage] = useState<QuestionsPageState>(
    INITIAL_QUESTIONS_PAGE_STATE,
  );
  // 필터 상태
  const [filter, setFilter] = useState<FilterState>({
    title: "",
    status: QUESTION_STATUS_DEFAULT_OPTION,
  });
  const [debouncedTitle, setDebouncedTitle] = useState(filter.title); // api 요청 타이틀 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState<CommonErrorState | null>(null); // 에러 상태
  const itemSumNum = QUESTION_PAGE_SIZE;
  const itemNum = questionsPage.totalElements;
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const isTablet = useMediaQuery({ maxWidth: 1023 });

  // 과도한 api 요청 방지
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedTitle(filter.title);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [filter.title]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);

      try {
        const status =
          QUESTION_STATUS_OPTION_TO_REQUEST_STATUS[filter.status] ?? "ALL";
        const res = await getQuestions({
          title: debouncedTitle,
          status,
          page: currentPage - 1, // 서버 0-based
        });
        const responseData = res.data?.data ?? res.data;

        setErrors(null);
        setQuestionsPage({
          questions: Array.isArray(responseData?.content)
            ? responseData.content
            : [],
          page: responseData?.number ?? 0,
          size: QUESTION_PAGE_SIZE,
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
  }, [debouncedTitle, filter.status, currentPage]);

  return (
    <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 px-4 pt-7 pb-120 md:max-w-187.5 xl:max-w-280">
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}

      <TitleSection
        title={`질문(${questionsPage.totalElements})`}
        subText="이캠퍼스에서 생성된 모든 질문을 확인할 수 있어요"
      />

      <div className="flex flex-col gap-2 md:flex-row">
        <div className="xl:w-108">
          <SerachBar
            value={filter.title}
            onChange={(e) => {
              setCurrentPage(1);
              setFilter((prev) => ({ ...prev, title: e.target.value }));
            }}
            placeholder="질문 제목으로 검색"
          />
        </div>
        <SelectBox
          options={QUESTION_STATUS_OPTIONS}
          defaultValue={QUESTION_STATUS_DEFAULT_OPTION}
          onChange={(value) => {
            setCurrentPage(1);
            setFilter((prev) => ({ ...prev, status: value }));
          }}
        />
      </div>

      <PageNationFrame itemNum={itemNum} itemSumNum={itemSumNum}>
        {() => {
          const pagedQuestions = questionsPage.questions;

          const isEmpty = pagedQuestions.length === 0;

          return (
            <>
              {!isTablet && (
                <PageNationMenu>
                  <QuestionTableHeader />
                </PageNationMenu>
              )}
              {isEmpty && !isLoading ? (
                <TableEmptyState label="등록된 질문을 찾을 수 없거나 존재하지 않아요" />
              ) : isTablet ? (
                <MobileQuestionsTableRows questions={pagedQuestions} />
              ) : (
                <QuestionTableRows
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

export default UserQuestionsPage;
