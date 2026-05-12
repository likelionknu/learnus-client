import { Input } from "@/shared/components";
import { BoxLayout } from "@/user/shared/components";

interface AssignmentContentSectionProps {
  label: string;
  content: string;
  onChange?: (v: string) => void;
}

function AssignmentContentSection({
  label,
  content,
  onChange,
}: AssignmentContentSectionProps) {
  return (
    <BoxLayout>
      <span className="text-body-2 text-ec-sub">{label}</span>
      <Input
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </BoxLayout>
  );
}

export default AssignmentContentSection;
