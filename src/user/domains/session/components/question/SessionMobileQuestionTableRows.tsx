import { formatKoreanDateTime12 } from "@/shared/utils";
import { MobileItem } from "@/user/shared/components";
import type { SessionQuestionRow } from "../../types";

interface SessionMobileQuestionTableRowsProps {
  questions: SessionQuestionRow[];
}

function SessionMobileQuestionTableRows({
  questions,
}: SessionMobileQuestionTableRowsProps) {
  return (
    <div className="grid w-full gap-3 md:grid-cols-2 md:gap-12">
      {questions.map((question, index) => (
        <div
          key={`${question.id}-${question.createdUserName ?? "anonymous"}-${index}`}
          className="bg-ec-box rounded-ec-10 max-w-87.5 cursor-pointer p-5"
        >
          <div className="w-full">
            <div className="border-ec-outline-dark flex flex-col gap-2 border-b pb-5">
              <span className="font-pretendard tracking-ec-normal text-[14px]/[17px] font-medium">
                {question.title}
              </span>
              <span className="text-caption text-ec-sub">
                {formatKoreanDateTime12(question.createdAt)}
              </span>
            </div>
            <div className="mt-2 flex gap-4">
              <MobileItem
                label="질문자"
                value={question.createdUserName ?? "-"}
              />
              <MobileItem
                label="상태"
                value={question.status === "COMPLETED" ? "완료" : "대기"}
                valueClassName={
                  question.status === "COMPLETED"
                    ? "text-ec-blue"
                    : "text-ec-sub"
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SessionMobileQuestionTableRows;
