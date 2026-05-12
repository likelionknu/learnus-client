import Button from "@/shared/components/Button";
import type { ButtonVariant } from "@/shared/types";
import { useMediaQuery } from "react-responsive";

interface TitleAction {
  label: string;
  buttonType?: ButtonVariant;
  onClick?: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

interface TitleSectionProps {
  title: string;
  subText?: string;
  actions?: TitleAction[];
}

const SubText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="font-pretendard tracking-ec-normal xl:text-body-1 text-ec-sub text-[14px] font-medium">
      {children}
    </span>
  );
};

function TitleSection({ title, subText, actions }: TitleSectionProps) {
  const isMobile = useMediaQuery({ maxWidth: 479 });

  const hasActions = Boolean(actions?.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
        <span className="text-title xl:text-large-title text-ec-black">
          {title}
        </span>
        {isMobile && subText && <SubText>{subText}</SubText>}
        {hasActions && (
          <div className="flex flex-wrap items-center gap-2.5">
            {actions?.map((action, index) => (
              <Button
                key={`${action.label}-${index}`}
                variant={action.buttonType ?? "primary"}
                size="large"
                onClick={action.onClick}
                isLoading={action.isSubmitting}
                disabled={action.disabled ?? action.isSubmitting}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      {!isMobile && subText && <SubText>{subText}</SubText>}
    </div>
  );
}

export default TitleSection;
