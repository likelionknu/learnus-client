import { TableHeaderLabel } from "@/shared/components/table";
import { ASSIGNMENTS_TABLE_COLUMNS } from "../constants";

function AssignmentsTableHeader() {
  return (
    <div
      className="grid w-full min-w-0 items-center gap-5 px-4"
      style={{ gridTemplateColumns: ASSIGNMENTS_TABLE_COLUMNS }}
    >
      <TableHeaderLabel className="text-center">ID</TableHeaderLabel>
      <TableHeaderLabel className="min-w-0 truncate whitespace-nowrap">
        과제 명
      </TableHeaderLabel>
      <TableHeaderLabel className="text-center">마감</TableHeaderLabel>
      <TableHeaderLabel className="text-center">상태</TableHeaderLabel>
      <TableHeaderLabel className="text-center">평가</TableHeaderLabel>
    </div>
  );
}

export default AssignmentsTableHeader;
