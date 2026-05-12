import { TableHeaderLabel } from "@/shared/components/table";

function NotificationTableHeader() {
  return (
    <>
      <TableHeaderLabel className="ml-8 xl:ml-8">내용</TableHeaderLabel>
      <TableHeaderLabel className="ml-136 lg:ml-200 xl:ml-224">
        상태
      </TableHeaderLabel>
      <TableHeaderLabel className="ml-13.5 xl:ml-13">수신일</TableHeaderLabel>
    </>
  );
}

export default NotificationTableHeader;
