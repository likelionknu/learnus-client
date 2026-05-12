import { TextBox } from "@/shared/components";
import { BoxLayout } from "@/user/shared/components";

interface AdminQuestionContentSectionProps {
  label: string;
  content: string;
  editable?: boolean;
  maxLength?: number;
  placeholder?: string;
  onChange?: (content: string) => void;
}

function AdminQuestionContentSection({
  label,
  content,
  editable = false,
  maxLength,
  placeholder,
  onChange,
}: AdminQuestionContentSectionProps) {
  const isEditable = editable && typeof onChange === "function";
  const characterCount = Array.from(content).length;

  return (
    <BoxLayout>
      <span className="text-body-2 text-ec-black">{label}</span>
      <TextBox px={false} py={false}>
        {isEditable ? (
          <div className="flex flex-col">
            <textarea
              aria-label={`${label} 입력`}
              maxLength={maxLength}
              value={content}
              placeholder={placeholder}
              onChange={(event) => onChange(event.target.value)}
              className="text-ec-black placeholder:text-ec-sub min-h-48 w-full resize-none bg-transparent px-7 py-3.5 text-sm leading-6 outline-none"
            />
            {typeof maxLength === "number" && (
              <div className="text-ec-sub px-7 pb-3 text-right text-[12px]/[18px] font-medium">
                {characterCount}/{maxLength}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full px-7 py-3.5 text-sm leading-6">{content}</div>
        )}
      </TextBox>
    </BoxLayout>
  );
}

export default AdminQuestionContentSection;
