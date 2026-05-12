import { TableHeaderLabel } from "@/shared/components/table";

const GROUP_TABLE_COLUMNS =
  "grid-cols-[0.55fr_0.85fr_0.9fr_2.2fr_2.2fr_0.7fr_3.6fr]";

function GroupHeader() {
  return (
    <div className={`grid w-full items-center gap-3 px-6 ${GROUP_TABLE_COLUMNS}`}>
      <TableHeaderLabel>기수</TableHeaderLabel>
      <TableHeaderLabel>파트</TableHeaderLabel>
      <TableHeaderLabel>이름</TableHeaderLabel>
      <TableHeaderLabel>이메일 주소</TableHeaderLabel>
      <TableHeaderLabel>가입일</TableHeaderLabel>
      <TableHeaderLabel className="text-center">벌점</TableHeaderLabel>
      <TableHeaderLabel className="text-center">작업</TableHeaderLabel>
    </div>
  );
}

export default GroupHeader;
