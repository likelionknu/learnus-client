import { TextBox } from "@/shared/components";

interface AssignmentDescriptionSectionProps {
  description: string;
}

function AssignmentDescriptionSection({
  description,
}: AssignmentDescriptionSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <span className="text-body-2 text-ec-black">설명</span>
      <TextBox px={false} py={false}>
        <div className="h-80 overflow-hidden px-10 pt-3.75 pr-10 text-sm leading-6">
          {description}
        </div>
      </TextBox>
    </section>
  );
}

export default AssignmentDescriptionSection;
