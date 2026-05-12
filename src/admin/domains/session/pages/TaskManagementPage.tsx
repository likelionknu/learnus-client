import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/shared/apis";
import {
  TitleSection,
  PageNationButton,
  PageNationFrame,
  PageNationItem,
  PageNationMenu,
} from "@/shared/components";
import { formatDaysAgoTwo } from "@/shared/utils";

interface TaskManagementDataItem {
  assignmentId: number;
  name: string;
  createdBy: string;
  endAt: string;
  targetCount: number;
  submittedCount: number;
  unsubmittedCount: number;
}

interface TaskManagementDataType {
  totalElements: number;
  totalPages: number;
  content: TaskManagementDataItem[];
}

const TASK_MANAGEMENT_PAGE_SIZE = 8;
const INITIAL_TASK_MANAGEMENT_DATA: TaskManagementDataType = {
  totalElements: 0,
  totalPages: 0,
  content: [],
};

interface TaskComponentProps {
  assignmentId: number;
  name: string;
  createdBy: string;
  deadlineLabel: string;
  targetCount: number;
  submittedCount: number;
  unsubmittedCount: number;
  onClick?: () => void;
}

function TaskComponent({
  assignmentId,
  name,
  createdBy,
  deadlineLabel,
  targetCount,
  submittedCount,
  unsubmittedCount,
  onClick,
}: TaskComponentProps) {
  return (
    <div className="flex cursor-pointer items-center" onClick={onClick}>
      <div className="text-ec-black ml-4.25 w-9.25 justify-start text-center text-sm font-medium">
        {assignmentId}
      </div>
      <div className="text-ec-black ml-4.5 line-clamp-1 w-143.75 justify-start text-sm font-medium">
        {name}
      </div>
      <div className="ml-6 flex w-78 items-center justify-between">
        <div className="text-ec-black w-12 justify-start text-center text-sm font-medium">
          {createdBy}
        </div>
        <div className="text-ec-black w-12 justify-start text-center text-sm font-medium">
          {deadlineLabel}일
        </div>
        <div className="text-ec-black w-12 justify-start text-center text-sm font-medium">
          {targetCount}건
        </div>
        <div className="text-ec-black w-12 justify-start text-center text-sm font-medium">
          {submittedCount}건
        </div>
        <div className="text-ec-black w-12 justify-start text-center text-sm font-medium">
          {unsubmittedCount}건
        </div>
      </div>
    </div>
  );
}

function TaskNotionComponent() {
  return (
    <div className="bg-ec-white border-ec-blue rounded-ec-10 my-5 flex h-14 w-full items-center justify-center border">
      <div className="text-ec-blue w-full px-7.5 text-sm font-medium">
        과제 미제출 시 벌점 부여 회칙이 있으므로 확인해 주세요!
      </div>
    </div>
  );
}

const TaskManagementPage = () => {
  const navigate = useNavigate();
  const { sid } = useParams();
  const [taskManagementData, setTaskManagementData] = useState(
    INITIAL_TASK_MANAGEMENT_DATA,
  );
  const [taskManagementDataPage, setTaskManagementDataPage] = useState(1);

  const taskManagementDataItemNum = taskManagementData.totalElements;

  useEffect(() => {
    let isMounted = true;

    const fetchTaskManagementData = async () => {
      if (!sid) {
        setTaskManagementData(INITIAL_TASK_MANAGEMENT_DATA);
        return;
      }

      try {
        const response = await api.get(
          `/v1/admin/sessions/${sid}/assignments`,
          {
            params: {
              page: taskManagementDataPage - 1,
              size: TASK_MANAGEMENT_PAGE_SIZE,
            },
          },
        );
        const responseData = response.data?.data ?? response.data;

        if (!isMounted) {
          return;
        }

        setTaskManagementData(responseData ?? INITIAL_TASK_MANAGEMENT_DATA);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("과제 목록을 불러오지 못했습니다.", error);
        setTaskManagementData(INITIAL_TASK_MANAGEMENT_DATA);
      }
    };

    fetchTaskManagementData();

    return () => {
      isMounted = false;
    };
  }, [sid, taskManagementDataPage]);

  const handleCreateClick = () => {
    navigate("upload");
  };

  const handleAssignmentClick = (assignmentId: number) => {
    if (!sid) {
      return;
    }

    navigate(`/admin/sessions/${sid}/assignments/${assignmentId}`);
  };

  return (
    <div className="flex w-full items-center justify-center pt-26.25 xl:pt-7.5">
      <div className="flex h-full w-251.5 flex-col items-center">
        <div className="flex w-full justify-between">
          <TitleSection title="과제 관리" />
          <button
            type="button"
            onClick={handleCreateClick}
            disabled={!sid}
            className={`rounded-ec-10 flex h-9.5 w-30 items-center justify-center ${
              sid
                ? "bg-ec-blue cursor-pointer"
                : "bg-ec-blue cursor-not-allowed opacity-50"
            }`}
          >
            <div className="text-ec-gnb-white text-center text-base font-medium">
              새 자료 추가
            </div>
          </button>
        </div>
        <TaskNotionComponent />

        {!sid && (
          <div className="text-ec-red w-full text-sm">
            세션 정보가 없어 과제 목록을 불러올 수 없어요. `sid`를 확인해주세요.
          </div>
        )}

        <PageNationFrame
          itemNum={taskManagementDataItemNum}
          itemSumNum={TASK_MANAGEMENT_PAGE_SIZE}
        >
          {({ startIndex }) => (
            <>
              <div className="flex h-112 w-251.5 flex-col">
                <PageNationMenu>
                  <div className="text-ec-table-topic ml-7.5 justify-start text-center text-xs font-medium">
                    ID
                  </div>
                  <div className="text-ec-table-topic ml-8 justify-start text-center text-xs font-medium">
                    과제 명
                  </div>
                  <div className="text-ec-table-topic ml-143 justify-start text-center text-xs font-medium">
                    등록자
                  </div>
                  <div className="text-ec-table-topic ml-10.75 justify-start text-center text-xs font-medium">
                    마감
                  </div>
                  <div className="text-ec-table-topic ml-10.75 justify-start text-center text-xs font-medium">
                    부여
                  </div>
                  <div className="text-ec-table-topic ml-10.75 justify-start text-center text-xs font-medium">
                    제출
                  </div>
                  <div className="text-ec-table-topic ml-10 justify-start text-center text-xs font-medium">
                    미제출
                  </div>
                </PageNationMenu>
                {taskManagementData.content.map((data, index) => (
                  <PageNationItem
                    key={data.assignmentId}
                    absoluteIndex={startIndex + index}
                  >
                    <TaskComponent
                      assignmentId={data.assignmentId}
                      name={data.name}
                      createdBy={data.createdBy}
                      deadlineLabel={formatDaysAgoTwo(data.endAt)}
                      targetCount={data.targetCount}
                      submittedCount={data.submittedCount}
                      unsubmittedCount={data.unsubmittedCount}
                      onClick={() => handleAssignmentClick(data.assignmentId)}
                    />
                  </PageNationItem>
                ))}
              </div>
              <PageNationButton onPageChange={setTaskManagementDataPage} />
            </>
          )}
        </PageNationFrame>
      </div>
    </div>
  );
};

export default TaskManagementPage;
