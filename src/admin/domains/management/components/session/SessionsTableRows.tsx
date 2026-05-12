import { SkeletonCell } from "@/shared/components/skeleton";
import type { AdminSessionRow } from "../../types";
import { SESSIONS_TABLE_COLUMNS } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "@/shared/stores/sessionStore";

interface SessionsTableRowsProps {
  isLoading: boolean;
  sessions: AdminSessionRow[];
}

function SessionsTableRows({ isLoading, sessions }: SessionsTableRowsProps) {
  const navigate = useNavigate();
  const setSessionName = useSessionStore((state) => state.setSessionName);

  return (
    <div className="rounded-ec-10 flex w-full flex-col overflow-hidden">
      {isLoading &&
        [0, 1, 2].map((idx) => (
          <div
            key={`session-skeleton-${idx}`}
            className="flex animate-pulse items-center px-6 py-4"
          >
            <div
              className="grid w-full min-w-0 items-center gap-3"
              style={{ gridTemplateColumns: SESSIONS_TABLE_COLUMNS }}
            >
              <SkeletonCell className="mx-auto h-4 w-6" />
              <SkeletonCell className="h-4 w-full" />
              <SkeletonCell className="mx-auto h-4 w-12" />
              <SkeletonCell className="mx-auto h-4 w-10" />
              <SkeletonCell className="mx-auto h-4 w-10" />
              <SkeletonCell className="mx-auto h-4 w-10" />
              <SkeletonCell className="mx-auto h-4 w-12" />
            </div>
          </div>
        ))}

      {sessions.map((session, index) => (
        <div
          key={`${session.sessionId}-${index}`}
          className={`text-body-2 flex cursor-pointer items-center px-6 py-4 ${
            index % 2 === 1 ? "bg-ec-box" : "bg-ec-white"
          }`}
          onClick={() => {
            setSessionName(session.name);
            navigate(`/admin/sessions/${session.sessionId}/dashboard`);
          }}
        >
          <div
            className="grid w-full min-w-0 items-center gap-3"
            style={{ gridTemplateColumns: SESSIONS_TABLE_COLUMNS }}
          >
            <span className="text-center">{session.sessionId}</span>
            <span className="min-w-0 truncate">{session.name}</span>
            <span className="min-w-0 truncate text-center whitespace-nowrap">
              {session.createdBy}
            </span>
            <span className="text-center">{session.userCount}명</span>
            <span className="text-center">{session.fileCount}건</span>
            <span className="text-center">{session.assignmentCount}개</span>
            <span
              className={`text-center ${
                session.status === "활성화" ? "text-ec-blue" : "text-ec-sub"
              }`}
            >
              {session.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SessionsTableRows;
