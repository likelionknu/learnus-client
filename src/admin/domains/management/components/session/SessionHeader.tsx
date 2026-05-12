import { TableHeaderLabel } from "@/shared/components/table";
import { SESSIONS_TABLE_COLUMNS } from "../../constants";

function SessionHeader() {
  return (
    <div
      className="grid w-full min-w-0 items-center gap-3 px-6"
      style={{ gridTemplateColumns: SESSIONS_TABLE_COLUMNS }}
    >
      <TableHeaderLabel className="text-center">ID</TableHeaderLabel>
      <TableHeaderLabel className="min-w-0 truncate whitespace-nowrap">
        세션 명
      </TableHeaderLabel>
      <TableHeaderLabel className="text-center">생성자</TableHeaderLabel>
      <TableHeaderLabel className="text-center">참여</TableHeaderLabel>
      <TableHeaderLabel className="text-center">자료</TableHeaderLabel>
      <TableHeaderLabel className="text-center">과제</TableHeaderLabel>
      <TableHeaderLabel className="text-center">상태</TableHeaderLabel>
    </div>
  );
}

export default SessionHeader;
