import { TableHeaderLabel } from "@/shared/components/table";

function SessionQuestionTableHeader() {
  return (
    <>
      <TableHeaderLabel className="ml-8.5 xl:ml-8.5">ID</TableHeaderLabel>
      <TableHeaderLabel className="ml-6 xl:ml-6.5">질문 명</TableHeaderLabel>
      <TableHeaderLabel className="ml-81 xl:ml-148">등록일</TableHeaderLabel>
      <TableHeaderLabel className="ml-30.5 xl:ml-30">질문자</TableHeaderLabel>
      <TableHeaderLabel className="ml-14 xl:ml-18">상태</TableHeaderLabel>
    </>
  );
}

export default SessionQuestionTableHeader;
