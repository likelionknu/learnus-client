import TwoManIcon from "@user/domains/session/assets/TwoManIcon.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { SkeletonCell } from "@/shared/components/skeleton";
import { useSessionStore } from "@/shared/stores/sessionStore";
import { useNavigate } from "react-router-dom";

interface SessionItemData {
  sessionId: number;
  userCount: number;
  name: string;
  fileCount: number;
  assignmentCount: number;
}

interface SelectSessionItemProps {
  id: number;
  userCount: number;
  name: string;
  fileCount: number;
  assignmentCount: number;
  onSelect: (name: string) => void;
}

const SelectSessionItem = ({
  id,
  userCount,
  name,
  fileCount,
  assignmentCount,
  onSelect,
}: SelectSessionItemProps) => {
  const naviage = useNavigate();

  return (
    <div
      className="my-2.5 flex h-30.25 w-87.5 cursor-pointer flex-col lg:w-85 xl:my-0"
      onClick={() => {
        onSelect(name);
        naviage(`/user/sessions/${id}/files`);
      }}
    >
      <div className="bg-ec-table-header rounded-tl-ec-10 rounded-tr-ec-10 flex h-9 w-32 items-center justify-center">
        <div className="flex w-full items-center justify-center gap-1.25">
          <img src={TwoManIcon} alt="Two Man Icon" className="h-3.5 w-4.25" />
          <div className="text-ec-table-topic justify-center text-sm font-medium">
            {userCount}명
          </div>
        </div>
      </div>

      <div className="bg-ec-box rounded-tr-ec-10 rounded-br-ec-10 rounded-bl-ec-10 h-20 w-full">
        <div className="flex h-full w-full flex-col gap-2 p-5">
          <div className="text-ec-black justify-start self-stretch text-base leading-6 font-medium">
            {name}
          </div>
          <div className="text-ec-sub flex justify-start gap-1.5 self-stretch text-xs font-medium">
            <div className="cursor-pointer">등록된 자료 {fileCount}</div>
            <div className="">·</div>
            <div className="cursor-pointer">등록된 과제 {assignmentCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserSessionSelect = () => {
  const setSessionName = useSessionStore((state) => state.setSessionName);
  const authData = JSON.parse(
    localStorage.getItem("ecampus.auth.session") || "null",
  );
  const token = authData?.state?.session?.accessToken;

  const [sessionsData, setSessionsData] = useState<SessionItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/v1/sessions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = response.data;

        if (Array.isArray(result.data)) {
          setSessionsData(result.data);
          setLoading(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "서버 응답 에러:",
            error.response?.status,
            error.response?.data,
          );
        } else {
          console.error("네트워크 통신 오류:", error);
        }
      }
    };

    fetchSessions();
  }, [token]);

  return (
    <div className="mt-10 flex h-full w-full items-center justify-center pb-50 lg:scale-85 xl:mt-0 xl:scale-100">
      <div className="mt-24 flex h-full w-88 flex-col items-center md:w-187.5 lg:mt-0 lg:w-280">
        <div className="flex w-full flex-col gap-3.75 pt-0 lg:pt-7.5">
          <div className="text-EC-BLACK justify-start text-2xl font-semibold md:text-3xl">
            사용할 수 있는 세션({sessionsData.length})
          </div>
          <div className="text-ec-sub justify-start self-stretch text-sm font-medium md:text-base">
            내가 추가된 세션만 확인할 수 있어요
          </div>
        </div>
        <div className="grid w-full grid-cols-3 pt-8.25 md:w-187.5 lg:w-full xl:gap-11.75">
          {loading && (
            <>
              <SkeletonCell className="h-32 w-80" rounded="rounded-ec-10" />
              <SkeletonCell className="h-32 w-80" rounded="rounded-ec-10" />
              <SkeletonCell className="h-32 w-80" rounded="rounded-ec-10" />
              <SkeletonCell className="h-32 w-80" rounded="rounded-ec-10" />
              <SkeletonCell className="h-32 w-80" rounded="rounded-ec-10" />
              <SkeletonCell className="h-32 w-80" rounded="rounded-ec-10" />
              <SkeletonCell className="h-32 w-80" rounded="rounded-ec-10" />
              <SkeletonCell className="h-32 w-80" rounded="rounded-ec-10" />
              <SkeletonCell className="h-32 w-80" rounded="rounded-ec-10" />
            </>
          )}
          {sessionsData.map((item) => (
            <SelectSessionItem
              key={item.sessionId}
              id={item.sessionId}
              userCount={item.userCount}
              name={item.name}
              fileCount={item.fileCount}
              assignmentCount={item.assignmentCount}
              onSelect={setSessionName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSessionSelect;
