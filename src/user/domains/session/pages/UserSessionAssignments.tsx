import { useMediaQuery } from "react-responsive";
import { TitleSection, PageNationButton, PageNationFrame, PageNationMenu } from "@/shared/components";
import { TableEmptyState } from "@/shared/components/table";
import { formatDateTime } from "@/shared/utils";
import { AssignmentsTableHeader, AssignmentsTableRow } from "../components";
import { ListBoxMobile, AssignmentInfo } from "../components/application";
import { useEffect, useState } from "react";
import { getAssignments } from "../apis";
import { useNavigate, useParams } from "react-router-dom";

interface AssignmentRow {
  id: number;
  name: string;
  endAt: string;
  assignmentStatus: "NOT_SUBMITTED" | "SUBMITTED";
  evaluate: "PASS" | "FAIL" | null;
}

interface AssignmentsPageState {
  assignments: AssignmentRow[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

const INITIAL_ASSIGNMENTS_PAGE_STATE: AssignmentsPageState = {
  assignments: [],
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
};

const ASSIGNMENTS_PAGE_SIZE = 8;

function UserSessionAssignments() {
  const [assignmentsPage, setAssignmentsPage] = useState<AssignmentsPageState>(
    INITIAL_ASSIGNMENTS_PAGE_STATE,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const isTablet = useMediaQuery({ maxWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const { sid } = useParams();
  const sidNumber = sid ? Number(sid) : null;
  const itemNum = assignmentsPage.totalElements;
  const itemSumNum = ASSIGNMENTS_PAGE_SIZE;

  const openAssignmentDetail = (aid: number) => {
    navigate(`${aid}`);
  };

  const ASSIGNMENT_STATUS_MAP: Record<string, string> = {
    NOT_SUBMITTED: "미제출",
    SUBMITTED: "제출",
  };
  const ASSIGNMENT_EVALUATE_MAP: Record<string, string> = {
    PASS: "합격",
    FAIL: "실패",
  };

  useEffect(() => {
    if (sidNumber === null || Number.isNaN(sidNumber)) return;

    const fetchAssignments = async () => {
      setIsLoading(true);

      try {
        const res = await getAssignments({
          sid: sidNumber,
          page: currentPage - 1,
          size: ASSIGNMENTS_PAGE_SIZE,
        });
        const responseData = res.data?.data ?? res.data;

        setAssignmentsPage({
          assignments: responseData?.content ?? [],
          page: responseData?.number ?? 0,
          size: responseData?.size ?? ASSIGNMENTS_PAGE_SIZE,
          totalElements: responseData?.totalElements ?? 0,
          totalPages: responseData?.totalPages ?? 0,
          hasNext: !(responseData?.last ?? true),
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [sidNumber, currentPage]);
  return (
    <div className="mx-auto mt-30 flex w-full max-w-251 flex-col gap-5 md:pt-7 xl:mt-0">
      <TitleSection
        title={`과제(${assignmentsPage.totalElements})`}
        subText="내게 부여된 과제를 확인하세요"
      />
      <PageNationFrame itemNum={itemNum} itemSumNum={itemSumNum}>
        {() => {
          const pageAssignments = assignmentsPage.assignments;
          return (
            <>
              {!isTablet && (
                <PageNationMenu>
                  <AssignmentsTableHeader />
                </PageNationMenu>
              )}
              {pageAssignments.length === 0 && !isLoading ? (
                <TableEmptyState label="등록된 과제가 없어요." />
              ) : !isTablet ? (
                <AssignmentsTableRow
                  isLoading={isLoading}
                  assignments={pageAssignments}
                  onRowClick={(assignment) =>
                    openAssignmentDetail(assignment.id)
                  }
                />
              ) : (
                <div
                  className={`grid gap-4 ${
                    isMobile ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {pageAssignments.map((assignment) => {
                    const statusValue =
                      ASSIGNMENT_STATUS_MAP[assignment.assignmentStatus];
                    const statusClass =
                      assignment.assignmentStatus === "SUBMITTED"
                        ? "text-ec-blue"
                        : "text-ec-red";

                    const evaluateValue = assignment.evaluate
                      ? ASSIGNMENT_EVALUATE_MAP[assignment.evaluate]
                      : "-";
                    const evaluateClass = assignment.evaluate
                      ? assignment.evaluate === "PASS"
                        ? "text-ec-blue"
                        : "text-ec-red"
                      : "";

                    return (
                      <ListBoxMobile
                        key={assignment.id}
                        title={assignment.name}
                        subText={`${formatDateTime(assignment.endAt)} · 제출 종료`}
                        onClick={() => openAssignmentDetail(assignment.id)}
                      >
                        <AssignmentInfo
                          label="제출 상태"
                          value={statusValue}
                          valueClassName={statusClass}
                        />
                        <AssignmentInfo
                          label="평가 상태"
                          value={evaluateValue}
                          valueClassName={evaluateClass}
                        />
                      </ListBoxMobile>
                    );
                  })}
                </div>
              )}
              <PageNationButton onPageChange={(page) => setCurrentPage(page)} />
            </>
          );
        }}
      </PageNationFrame>
    </div>
  );
}

export default UserSessionAssignments;
