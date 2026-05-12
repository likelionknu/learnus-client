import { TableHeaderLabel } from "@/shared/components/table";
import { QUESTION_TABLE_COLUMNS } from "../constants";

function QuestionTableHeader() {
  return (
    <div
      className="grid w-full min-w-0 items-center gap-5 px-6"
      style={{ gridTemplateColumns: QUESTION_TABLE_COLUMNS }}
    >
      <TableHeaderLabel className="text-center">ID</TableHeaderLabel>
      <TableHeaderLabel className="min-w-0 truncate whitespace-nowrap">
        세션 명
      </TableHeaderLabel>
      <TableHeaderLabel className="min-w-0 truncate whitespace-nowrap">
        제목
      </TableHeaderLabel>
      <TableHeaderLabel className="-ml-2 min-w-0 text-center whitespace-nowrap">
        등록일
      </TableHeaderLabel>
      <TableHeaderLabel className="min-w-0 truncate text-center whitespace-nowrap">
        생성
      </TableHeaderLabel>
      <TableHeaderLabel className="min-w-0 truncate text-center whitespace-nowrap">
        답변
      </TableHeaderLabel>
      <TableHeaderLabel className="text-center">상태</TableHeaderLabel>
    </div>
  );
}

export default QuestionTableHeader;
