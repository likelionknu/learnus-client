import { SkeletonCell } from "@/shared/components/skeleton";
import { formatDaysAgo } from "@/shared/utils";
import type { NotificationRow } from "../types";
import { useNavigate } from "react-router-dom";

interface NotificationTableRowsProps {
  isLoading: boolean;
  onRowClick: (notification: NotificationRow) => void;
  notifications: NotificationRow[];
}

function NotificationTableRows({
  isLoading,
  onRowClick,
  notifications,
}: NotificationTableRowsProps) {
  const navigate = useNavigate();

  const handleNavigate = (notification: NotificationRow) => {
    const isSession =
      notification.assignmentId === null &&
      notification.fileId === null &&
      notification.questionId === null &&
      notification.noticeId === null;

    if (isSession) navigate(`/user/sessions/${notification.sessionId}/files`);

    // 공지사항
    if (notification.noticeId) navigate("/user/dashboard");

    // 질문
    if (notification.questionId)
      navigate(
        `/user/questions/${notification.questionId}/${notification.sessionId}`,
      );

    // 자료
    if (notification.fileId)
      navigate(
        `/user/sessions/${notification.sessionId}/files/${notification.fileId}`,
      );

    // 과제
    if (notification.assignmentId)
      navigate(
        `/user/sessions/${notification.sessionId}/assignments/${notification.assignmentId}`,
      );
    if (isSession) return;
    return;
  };

  return (
    <div className="text-ec-black flex w-full flex-col">
      {isLoading && (
        <>
          <div className="flex animate-pulse items-center justify-between px-6 py-5">
            <SkeletonCell className="h-4 w-220" />
            <div className="flex gap-7">
              <SkeletonCell className="h-4 w-14" />
              <SkeletonCell className="h-4 w-12" />
            </div>
          </div>
          <div className="flex animate-pulse items-center justify-between px-6 py-5">
            <SkeletonCell className="h-4 w-220" />
            <div className="flex gap-7">
              <SkeletonCell className="h-4 w-14" />
              <SkeletonCell className="h-4 w-12" />
            </div>
          </div>
          <div className="flex animate-pulse items-center justify-between px-6 py-5">
            <SkeletonCell className="h-4 w-220" />
            <div className="flex gap-7">
              <SkeletonCell className="h-4 w-14" />
              <SkeletonCell className="h-4 w-12" />
            </div>
          </div>
        </>
      )}

      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`flex w-full cursor-pointer items-center justify-between px-8 py-5 ${
            index % 2 === 1 ? "bg-ec-box" : ""
          }`}
          onClick={async () => {
            await onRowClick(notification);
            handleNavigate(notification);
          }}
        >
          <span className="text-body-2 text-ec-black max-w-140 truncate">
            {notification.content}
          </span>

          <div className="flex items-center gap-7">
            <span
              className={`text-body-2 w-10 text-center ${
                notification.read ? "text-ec-blue" : "text-ec-red"
              }`}
            >
              {notification.read ? "읽음" : "안 읽음"}
            </span>
            <span className="text-body-2 text-ec-black w-12 text-right">
              {formatDaysAgo(notification.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationTableRows;
