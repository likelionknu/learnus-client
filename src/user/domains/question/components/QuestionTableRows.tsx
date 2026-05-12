import { SkeletonCell } from "@/shared/components/skeleton";
import { formatKoreanDateTime12 } from "@/shared/utils";
import type { SessionQuestionRow } from "../../session/types";
import { useNavigate } from "react-router-dom";
import { formatQuestionStatus, isCompletedQuestionStatus } from "@/user/utils";
import { QUESTION_TABLE_COLUMNS } from "../constants";

interface QuestionTableRowsProps {
  isLoading: boolean;
  questions: SessionQuestionRow[];
}

const sessionNameById: Record<number, string> = {
  14: "[14기] 아기사자 - 백엔드 파트",
};

function QuestionTableRows({ isLoading, questions }: QuestionTableRowsProps) {
  const navigate = useNavigate();

  return (
    <div className="text-ec-black flex w-full flex-col">
      {isLoading &&
        [0, 1, 2].map((idx) => (
          <div
            key={`question-skeleton-${idx}`}
            className="flex animate-pulse items-center px-6 py-4"
          >
            <div
              className="grid w-full min-w-0 items-center gap-5"
              style={{ gridTemplateColumns: QUESTION_TABLE_COLUMNS }}
            >
              <SkeletonCell className="mx-auto h-4 w-6" />
              <SkeletonCell className="h-4 w-full" />
              <SkeletonCell className="h-4 w-full" />
              <SkeletonCell className="h-4 w-full" />
              <SkeletonCell className="h-4 w-full" />
              <SkeletonCell className="h-4 w-full" />
              <SkeletonCell className="mx-auto h-4 w-10" />
            </div>
          </div>
        ))}

      {questions.map((question, index) => (
        <div
          key={`${question.id}-${question.createdUserName ?? "anonymous"}-${index}`}
          className={`flex w-full cursor-pointer items-center px-6 py-4 ${
            index % 2 === 1 ? "bg-ec-box" : ""
          }`}
          onClick={() =>
            navigate(`/user/questions/${question.id}/${question.sessionId}`)
          }
        >
          <div
            className="grid w-full min-w-0 items-center gap-5"
            style={{ gridTemplateColumns: QUESTION_TABLE_COLUMNS }}
          >
            <span className="text-body-2 text-ec-black text-center">
              {question.id}
            </span>
            <span className="text-body-2 text-ec-black min-w-0 truncate">
              {sessionNameById[question.sessionId] ??
                `세션 ${question.sessionId}`}
            </span>
            <span className="text-body-2 text-ec-black min-w-0 truncate">
              {question.title}
            </span>
            <span className="text-body-2 text-ec-black -ml-2 min-w-0 text-center whitespace-nowrap">
              {formatKoreanDateTime12(question.createdAt)}
            </span>
            <span className="text-body-2 text-ec-black min-w-0 truncate text-center whitespace-nowrap">
              {question.createdUserName ?? "-"}
            </span>
            <span
              className={`text-body-2 min-w-0 truncate text-center whitespace-nowrap ${
                question.answeredUserName ? "text-ec-black" : "text-ec-sub"
              }`}
            >
              {question.answeredUserName ?? "미답변"}
            </span>
            <span
              className={`text-body-2 text-center whitespace-nowrap ${
                isCompletedQuestionStatus(question.status)
                  ? "text-ec-blue"
                  : "text-ec-sub"
              }`}
            >
              {formatQuestionStatus(question.status)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuestionTableRows;
