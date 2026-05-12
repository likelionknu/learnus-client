import { SkeletonCell } from "@/shared/components/skeleton";
import { formatKoreanDateTime12 } from "@/shared/utils";
import type { SessionQuestionRow } from "../../types";
import { useNavigate } from "react-router-dom";

interface SessionQuestionTableRowsProps {
  isLoading: boolean;
  questions: SessionQuestionRow[];
}

function SessionQuestionTableRows({
  isLoading,
  questions,
}: SessionQuestionTableRowsProps) {
  const navigate = useNavigate();

  return (
    <div className="text-ec-black flex w-full flex-col">
      {isLoading && (
        <>
          <div className="flex animate-pulse gap-4 rounded-2xl px-4 py-4">
            <SkeletonCell className="ml-2 h-4 w-7" />
            <SkeletonCell className="h-4 w-121" />
            <SkeletonCell className="h-4 w-46" />
            <SkeletonCell className="ml-4 h-4 w-16" />
            <SkeletonCell className="ml-3 h-4 w-12" />
          </div>
          <div className="flex animate-pulse gap-4 rounded-2xl px-4 py-4">
            <SkeletonCell className="ml-2 h-4 w-7" />
            <SkeletonCell className="h-4 w-121" />
            <SkeletonCell className="h-4 w-46" />
            <SkeletonCell className="ml-4 h-4 w-16" />
            <SkeletonCell className="ml-3 h-4 w-12" />
          </div>
          <div className="flex animate-pulse gap-4 rounded-2xl px-4 py-4">
            <SkeletonCell className="ml-2 h-4 w-7" />
            <SkeletonCell className="h-4 w-121" />
            <SkeletonCell className="h-4 w-46" />
            <SkeletonCell className="ml-4 h-4 w-16" />
            <SkeletonCell className="ml-3 h-4 w-12" />
          </div>
        </>
      )}
      {questions.map((question, index) => (
        <div
          key={`${question.id}-${question.createdUserName ?? "anonymous"}-${index}`}
          className={`flex max-w-251 cursor-pointer items-center justify-between px-7.5 py-4 ${
            index % 2 === 1 ? "bg-ec-box" : ""
          }`}
          onClick={() =>
            navigate(`/user/questions/${question.id}/${question.sessionId}`)
          }
        >
          <div className="flex gap-7">
            <span className="text-body-2 text-ec-black ml-1">
              {question.id}
            </span>
            <span className="text-body-2 text-ec-black max-w-115 overflow-hidden text-ellipsis whitespace-nowrap">
              {question.title}
            </span>
          </div>
          <div className="flex gap-13">
            <span className="text-body-2 text-ec-black">
              {formatKoreanDateTime12(question.createdAt)}
            </span>
            <span className="text-body-2 text-ec-black w-12 truncate">
              {question.createdUserName ?? "없음"}
            </span>
            <span
              className={`text-body-2 ${
                question.status === "COMPLETED" ? "text-ec-blue" : "text-ec-sub"
              }`}
            >
              {question.status === "COMPLETED" ? "완료" : "대기"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SessionQuestionTableRows;
