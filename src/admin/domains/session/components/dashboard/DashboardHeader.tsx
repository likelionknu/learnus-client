import { TableHeaderLabel } from "@/shared/components/table";

function DashboardHeader() {
  return (
    <div className="flex w-full items-center px-8">
      <TableHeaderLabel className="w-20 shrink-0">기수</TableHeaderLabel>
      <TableHeaderLabel className="w-24 shrink-0">이름</TableHeaderLabel>
      <TableHeaderLabel className="w-24 shrink-0">파트</TableHeaderLabel>
      <TableHeaderLabel className="w-54 shrink-0">이메일 주소</TableHeaderLabel>
      <TableHeaderLabel className="w-73 shrink-0 pl-8">
        이 세션에 추가 됨
      </TableHeaderLabel>
      <TableHeaderLabel className="w-26 shrink-0 text-center">
        초대자(등록자)
      </TableHeaderLabel>
      <TableHeaderLabel className="w-24 shrink-0 text-center">
        추방
      </TableHeaderLabel>
    </div>
  );
}

export default DashboardHeader;

