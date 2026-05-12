import { useMediaQuery } from "react-responsive";
import { TextBox } from "@/shared/components";
import { formatKoreanDateTime24 } from "@/shared/utils";
import { AssignmentsMetaRow as AssignmentMetaRow } from "@/user/domains/session/components";
import type { AdminAssignmentDetail } from "../../types";

interface AssignmentMetaCardProps {
  assignment: Pick<
    AdminAssignmentDetail,
    | "assignmentId"
    | "startAt"
    | "endAt"
    | "createdBy"
    | "participantCount"
    | "submittedCount"
    | "notSubmittedCount"
  >;
}

function AssignmentMetaCard({ assignment }: AssignmentMetaCardProps) {
  const isTablet = useMediaQuery({ maxWidth: 1024 });

  const assignmentMetaRows = [
    { label: "과제 ID", value: assignment.assignmentId },
    { label: "시작일", value: formatKoreanDateTime24(assignment.startAt) },
    { label: "종료일", value: formatKoreanDateTime24(assignment.endAt) },
    { label: "등록자", value: assignment.createdBy },
    { label: "참여", value: `${assignment.participantCount}명` },
    { label: "제출", value: `${assignment.submittedCount}건` },
    { label: "미제출", value: `${assignment.notSubmittedCount}건` },
  ];

  return (
    <TextBox px={false} py={false}>
      <div className="flex h-48 flex-col justify-center px-10 py-4.75">
        {assignmentMetaRows.map((row, index) => (
          <AssignmentMetaRow
            key={row.label}
            label={row.label}
            value={row.value}
            className={`px-0 py-1 ${isTablet && index % 2 === 1 ? "bg-ec-box" : ""}`}
          />
        ))}
      </div>
    </TextBox>
  );
}

export default AssignmentMetaCard;
