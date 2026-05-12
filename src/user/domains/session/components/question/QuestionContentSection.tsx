import { TextBox } from "@/shared/components";
import { BoxLayout } from "@/user/shared/components";

interface QustionContentSectionProps {
  label: string;
  content: string;
}

function QuestionContentSection({
  label,
  content,
}: QustionContentSectionProps) {
  return (
    <BoxLayout>
      <span className="text-body-2 text-ec-sub">{label}</span>
      <TextBox>{content}</TextBox>
    </BoxLayout>
  );
}

export default QuestionContentSection;
