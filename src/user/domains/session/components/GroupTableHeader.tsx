import { TableHeaderLabel } from "@/shared/components/table";

function GroupTableHeader() {
  return (
    <div
      className="grid w-full items-center px-8"
      style={{ gridTemplateColumns: "80px 120px 120px minmax(0,1fr)" }}
    >
      <TableHeaderLabel className="text-left">기수</TableHeaderLabel>
      <TableHeaderLabel className="text-left">이름</TableHeaderLabel>
      <TableHeaderLabel className="text-left">파트</TableHeaderLabel>
      <TableHeaderLabel className="text-left">이메일주소</TableHeaderLabel>
    </div>
  );
}

export default GroupTableHeader;
