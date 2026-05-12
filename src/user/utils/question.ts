export const formatQuestionStatus = (status: string | null | undefined) => {
  switch (status) {
    case "PENDING":
      return "대기";
    case "COMPLETED":
      return "완료";
    case "대기":
    case "완료":
      return status;
    default:
      return "-";
  }
};

export const isCompletedQuestionStatus = (
  status: string | null | undefined,
) => {
  return status === "COMPLETED" || status === "완료";
};
