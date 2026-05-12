import { TableHeaderLabel } from "@/shared/components/table";

function FilesTableHeader() {
  return (
    <div
      className="grid w-full items-center px-8"
      style={{ gridTemplateColumns: "50px minmax(0,1fr) 200px 120px" }}
    >
      <TableHeaderLabel className="text-center">ID</TableHeaderLabel>
      <TableHeaderLabel className="text-left">자료 명</TableHeaderLabel>
      <TableHeaderLabel className="text-center">등록일</TableHeaderLabel>
      <TableHeaderLabel className="text-center">등록한 사용자</TableHeaderLabel>
    </div>
  );
}
export default FilesTableHeader;
