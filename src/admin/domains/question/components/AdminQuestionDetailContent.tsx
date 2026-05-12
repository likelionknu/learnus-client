import { TitleSection } from "@/shared/components";
import type { ButtonVariant } from "@/shared/types";
import AdminQuestionCommentsSection from "./AdminQuestionCommentsSection";
import AdminQuestionContentSection from "./AdminQuestionContentSection";
import AdminQuestionMetaCard from "./AdminQuestionMetaCard";
import type { AdminQuestionDetail } from "../types";

interface AdminQuestionDetailAction {
  label: string;
  buttonType?: ButtonVariant;
  onClick?: () => void;
}

interface AdminQuestionDetailContentProps {
  qid: number;
  question: AdminQuestionDetail;
  actions?: AdminQuestionDetailAction[];
  answerDraft?: string;
  answerMaxLength?: number;
  onAnswerChange?: (answer: string) => void;
}

function AdminQuestionDetailContent({
  qid,
  question,
  actions,
  answerDraft,
  answerMaxLength,
  onAnswerChange,
}: AdminQuestionDetailContentProps) {
  const isAnswerEditable =
    typeof onAnswerChange === "function" && typeof answerDraft === "string";

  return (
    <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 px-4 pt-7 pb-120 md:max-w-187.5 xl:mx-0 xl:max-w-280 xl:px-8">
      <div className="flex w-full max-w-251.5 flex-col gap-5">
        <TitleSection title={question.title} actions={actions} />
        <AdminQuestionMetaCard question={question} />
        <AdminQuestionContentSection label="질문" content={question.question} />
        <AdminQuestionContentSection
          label="답변"
          content={isAnswerEditable ? answerDraft : (question.answer ?? "")}
          editable={isAnswerEditable}
          maxLength={answerMaxLength}
          placeholder="답변을 입력하세요"
          onChange={onAnswerChange}
        />
        <AdminQuestionCommentsSection qid={qid} />
      </div>
    </div>
  );
}

export default AdminQuestionDetailContent;
