import { SkeletonCell } from "@/shared/components/skeleton";

interface UserRow {
  course: number;
  name: string;
  part: string;
  email: string;
}

interface GroupTableRowProps {
  users: UserRow[];
  isLoading: boolean;
}
const PART_MAP: Record<string, string> = {
  BACKEND: "백엔드",
  FRONTEND: "프론트엔드",
  DESIGN: "디자인",
  PLANNING: "기획",
};
function GroupTableRow({ users, isLoading }: GroupTableRowProps) {
  return (
    <div className="flex w-235 flex-col">
      {isLoading && (
        <div
          className="grid animate-pulse items-center rounded-2xl px-8 py-4"
          style={{ gridTemplateColumns: "80px 120px 120px minmax(0,1fr)" }}
        >
          <SkeletonCell className="h-4 w-12" />
          <SkeletonCell className="h-4 w-14" />
          <SkeletonCell className="h-4 w-20" />
          <SkeletonCell className="h-4 w-full max-w-171" />
        </div>
      )}
      {users.map((user, index) => (
        <div
          key={user.email}
          className={`px-8 py-4 ${index % 2 === 1 ? "bg-ec-box" : ""}`}
        >
          <div
            className="grid w-full items-center"
            style={{ gridTemplateColumns: "80px 120px 120px minmax(0,1fr)" }}
          >
            <span className="text-body-2 text-left">{user.course}기</span>
            <span className="text-body-2 text-left">{user.name}</span>
            <span className="text-body-2 text-left">
              {PART_MAP[user.part] || user.part}
            </span>
            <span className="text-body-2 min-w-0 text-left">{user.email}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupTableRow;
