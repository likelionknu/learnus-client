import { TextBox } from "@/shared/components";
import { formatKoreanDateTime24 } from "@/shared/utils";
import { QuestionMetaRow } from "@/user/domains/session/components/question";
import type { AdminQuestionDetail } from "../types";

interface AdminQuestionMetaCardProps {
  question: Pick<
    AdminQuestionDetail,
    "createdAt" | "createdBy" | "answeredAt" | "answeredBy" | "status"
  >;
}

function AdminQuestionMetaCard({ question }: AdminQuestionMetaCardProps) {
  const questionMetaRows = [
    {
      label: "질문 등록일",
      value: formatKoreanDateTime24(question.createdAt),
    },
    { label: "등록자", value: question.createdBy || "-" },
    {
      label: "질문 답변일",
      value: question.answeredAt
        ? formatKoreanDateTime24(question.answeredAt)
        : "-",
    },
    { label: "답변자", value: question.answeredBy ?? "-" },
    { label: "상태", value: question.status === "COMPLETED" ? "완료" : "대기" },
  ];

  return (
    <TextBox px={false} py={false}>
      <div className="flex h-41 flex-col px-7 py-5">
        <div className="flex w-full max-w-231.5 flex-col gap-2.5">
          {questionMetaRows.map((row) => (
            <QuestionMetaRow
              key={row.label}
              label={row.label}
              value={row.value}
              className="px-0 py-0"
            />
          ))}
        </div>
      </div>
    </TextBox>
  );
}

export default AdminQuestionMetaCard;
