import { SkeletonCell } from "@/shared/components/skeleton";
import { formatDateTime } from "@/shared/utils";
import { ASSIGNMENTS_TABLE_COLUMNS } from "../constants";

interface AssignmentRow {
  id: number;
  name: string;
  endAt: string;
  assignmentStatus: "NOT_SUBMITTED" | "SUBMITTED";
  evaluate: "PASS" | "FAIL" | null;
}

interface AssignmentsTableRowProps {
  assignments: readonly AssignmentRow[];
  isLoading: boolean;
  onRowClick?: (assignment: AssignmentRow) => void;
}

const ASSIGNMENT_STATUS_MAP: Record<AssignmentRow["assignmentStatus"], string> =
  {
    NOT_SUBMITTED: "미제출",
    SUBMITTED: "제출",
  };

const ASSIGNMENT_EVALUATE_MAP: Record<
  Exclude<AssignmentRow["evaluate"], null>,
  string
> = {
  PASS: "성공",
  FAIL: "-",
};

function AssignmentsTableRow({
  assignments,
  isLoading,
  onRowClick,
}: AssignmentsTableRowProps) {
  return (
    <div className="flex w-full flex-col">
      {isLoading &&
        [0, 1, 2].map((idx) => (
          <div
            key={`assignment-skeleton-${idx}`}
            className="flex animate-pulse items-center px-4 py-4"
          >
            <div
              className="grid w-full min-w-0 items-center gap-5"
              style={{ gridTemplateColumns: ASSIGNMENTS_TABLE_COLUMNS }}
            >
              <SkeletonCell className="mx-auto h-4 w-6" />
              <SkeletonCell className="h-4 w-full" />
              <SkeletonCell className="h-4 w-full" />
              <SkeletonCell className="mx-auto h-4 w-12" />
              <SkeletonCell className="mx-auto h-4 w-10" />
            </div>
          </div>
        ))}

      {assignments.map((assignment, index) => (
        <div
          key={assignment.id}
          onClick={() => onRowClick?.(assignment)}
          className={`flex cursor-pointer items-center px-4 py-4 ${
            index % 2 === 1 ? "bg-ec-table-header" : ""
          }`}
        >
          <div
            className="grid w-full min-w-0 items-center gap-5"
            style={{ gridTemplateColumns: ASSIGNMENTS_TABLE_COLUMNS }}
          >
            <span className="text-body-2 text-center">{assignment.id}</span>
            <span className="text-body-2 min-w-0 truncate whitespace-nowrap">
              {assignment.name}
            </span>
            <span className="text-body-2 text-center whitespace-nowrap">
              {formatDateTime(assignment.endAt)}
            </span>
            <span
              className={`text-body-2 text-center ${
                assignment.assignmentStatus === "SUBMITTED"
                  ? "text-ec-blue"
                  : "text-ec-red"
              }`}
            >
              {ASSIGNMENT_STATUS_MAP[assignment.assignmentStatus]}
            </span>
            <span
              className={`text-body-2 text-center ${
                assignment.evaluate === "PASS" ? "text-ec-blue" : ""
              }`}
            >
              {assignment.evaluate
                ? ASSIGNMENT_EVALUATE_MAP[assignment.evaluate]
                : "-"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssignmentsTableRow;
