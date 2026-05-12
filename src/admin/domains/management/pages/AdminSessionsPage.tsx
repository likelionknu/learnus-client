import { useMediaQuery } from "react-responsive";
import { TitleSection, PageNationButton, PageNationFrame, PageNationMenu } from "@/shared/components";
import { TableEmptyState } from "@/shared/components/table";
import { SessionsTableRows, SessionHeader } from "../components/session";
import type { AdminSessionRow } from "../types";
import { useCallback, useEffect, useState } from "react";
import { CreateModal, ConfirmModal, DoneModal } from "../components/modal/sessions";
import type { CreateConfirmDoneModalStep } from "@/shared/types";
import { createSession, getSessions } from "../apis";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { ErrorModal } from "@/shared/components/modal";

interface SessionsPageState {
  sessions: AdminSessionRow[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

const INITIAL_SESSIONS_PAGE_STATE: SessionsPageState = {
  sessions: [],
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
};

function AdminSessionsPage() {
  const [sessionsPage, setSessionsPage] = useState<SessionsPageState>(
    INITIAL_SESSIONS_PAGE_STATE,
  );
  const [refreshKey, setRefreshKey] = useState(0); // 세션 추가시 재조회
  const [errors, setErrors] = useState<CommonErrorState | null>(null); // 에러 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [name, setName] = useState<string>(""); // 세션 추가 이름 상태
  const [step, setStep] = useState<CreateConfirmDoneModalStep | null>(null); // 모달 단계
  const isTablet = useMediaQuery({ maxWidth: 1023 });
  const itemNum = sessionsPage.totalElements;
  const itemSumNum = sessionsPage.size;

  // 모달 비활성화
  const handleClose = useCallback(() => {
    setStep(null);

    if (name) setName("");
  }, [name]);

  const handleDone = () => {
    setRefreshKey((prev) => prev + 1);
    handleClose();
  };

  // 세션 추가
  const handleCreateSession = async () => {
    if (!name) return;

    try {
      await createSession({ name: name });
      setStep("DONE");
    } catch (error) {
      setErrors(getCommonErrorState(error));
    }
  };

  const renderStepModal = () => {
    switch (step) {
      case "CREATE":
        return (
          <CreateModal
            name={name}
            onChange={(e) => setName(e.target.value)}
            onClick={() => setStep("CONFIRM")}
            onClose={handleClose}
          />
        );
      case "CONFIRM":
        return (
          <ConfirmModal onClose={handleClose} onClick={handleCreateSession} />
        );
      case "DONE":
        return <DoneModal onClose={handleDone} />;
      default:
        return null;
    }
  };

  // 세션 조회
  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);

      try {
        const res = await getSessions();
        const responseData = res.data?.data ?? res.data;

        setSessionsPage({
          sessions: Array.isArray(responseData?.content)
            ? responseData.content
            : [],
          page: responseData?.number ?? 0,
          size: responseData?.size ?? INITIAL_SESSIONS_PAGE_STATE.size,
          totalElements: responseData?.totalElements ?? 0,
          totalPages: responseData?.totalPages ?? 0,
          hasNext: !(responseData?.last ?? true),
        });
      } catch (error) {
        setErrors(getCommonErrorState(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [refreshKey]);

  return (
    <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 px-4 pt-7 pb-120 md:max-w-187.5 xl:max-w-251.5 xl:px-0">
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}

      {renderStepModal()}

      <TitleSection
        title="세션 관리"
        actions={[
          {
            label: "새 세션 추가하기",
            buttonType: "primary",
            onClick: () => setStep("CREATE"),
          },
        ]}
      />

      <PageNationFrame itemNum={itemNum} itemSumNum={itemSumNum}>
        {({ currentItems, startIndex }) => {
          const pagedSessions = sessionsPage.sessions.slice(
            startIndex,
            startIndex + currentItems.length,
          );

          return (
            <>
              {!isTablet && (
                <PageNationMenu>
                  <SessionHeader />
                </PageNationMenu>
              )}

              {pagedSessions.length === 0 && !isLoading ? (
                <TableEmptyState label="등록된 세션이 없어요." />
              ) : (
                <SessionsTableRows
                  isLoading={isLoading}
                  sessions={pagedSessions}
                />
              )}
              <PageNationButton />
            </>
          );
        }}
      </PageNationFrame>
    </div>
  );
}

export default AdminSessionsPage;
