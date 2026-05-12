import SessionInfo from "./SessionsInfo";
import SessionOverview from "./SessionsOverview";

export interface SessionDashboardData {
  sessionId: number;
  name: string;
  createdAt: string;
  createdBy: string;
  userCount: number;
  fileCount: number;
  assignmentCount: number;
  questionCount: number;
  status: string;
}

interface SessionInfoOverviewProps {
  data: SessionDashboardData;
  onClick: () => void;
}

const formatKoreanDate = (isoDateTime: string) => {
  const date = new Date(isoDateTime);

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

function SessionInfoOverview({ data, onClick }: SessionInfoOverviewProps) {
  const statusColorClassName =
    data.status === "비활성화" ? "text-ec-red" : "text-ec-blue";

  const infoItems = [
    { label: "세션 명", value: data.name },
    { label: "생성일", value: formatKoreanDate(data.createdAt) },
    { label: "생성자", value: data.createdBy },
    { label: "상태", value: data.status, valueClassName: statusColorClassName },
  ];

  const overviewStats = [
    { label: "사용자(명)", value: data.userCount },
    { label: "자료 업로드(개)", value: data.fileCount },
    { label: "과제 부여(회)", value: data.assignmentCount },
    { label: "질문 수(개)", value: data.questionCount },
  ];

  return (
    <section className="flex gap-7.5">
      <SessionInfo items={infoItems} onClick={onClick} />
      <SessionOverview items={overviewStats} />
    </section>
  );
}

export default SessionInfoOverview;
