import {
  TitleSection,
  SerachBar,
  Button,
  SelectBox,
  PageNationButton,
  PageNationFrame,
  PageNationMenu,
  Input,
} from "@/shared/components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  SessionInfoOverview,
  type SessionDashboardData,
  SelectedUser,
  DashboardHeader,
  DashboardTableRows,
  SessionActivateButton,
  SessionDeactivateButton,
} from "../components/dashboard";
import { useMediaQuery } from "react-responsive";
import { TableEmptyState } from "@/shared/components/table";
import {
  ADMIN_DASHBOARD_PART_DEFAULT,
  SESSION_PART_OPTIONS,
} from "@/shared/constants";
import type { AdminDashboardMemberRow, MemberState } from "../types";
import {
  addMembers,
  editSessionInfo,
  getSessionInfo,
  getSessionMember,
  serachUser,
} from "../api";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { ErrorModal, Modal } from "@/shared/components/modal";

interface SessionMembersPageState {
  content: AdminDashboardMemberRow[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

interface SessionEditState {
  name: string;
  useable: boolean;
}

const PART_LABEL_TO_REQUEST: Record<string, string> = {
  전체: "ALL",
  운영진: "OPERATOR",
  기획: "PLANNING",
  백엔드: "BACKEND",
  프론트엔드: "FRONTEND",
  디자인: "DESIGN",
};

const INITIAL_SESSION_DASHBOARD_STATE: SessionDashboardData = {
  sessionId: 0,
  name: "",
  createdAt: "",
  createdBy: "",
  userCount: 0,
  fileCount: 0,
  assignmentCount: 0,
  questionCount: 0,
  status: "",
};

const INITIAL_SESSION_MEMBERS_PAGE_STATE: SessionMembersPageState = {
  content: [],
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
};

const INITIAL_SESSION_EDIT_STATE: SessionEditState = {
  name: "",
  useable: false,
};

function AdminDashboardPage() {
  const { sid } = useParams();
  // 상단 데이터 상태
  const [sessionInfo, setSessionInfo] = useState<SessionDashboardData>(
    INITIAL_SESSION_DASHBOARD_STATE,
  );
  // 사용자 데이터 상태
  const [membersPage, setMembersPage] = useState<SessionMembersPageState>(
    INITIAL_SESSION_MEMBERS_PAGE_STATE,
  );
  const itemSumNum = INITIAL_SESSION_MEMBERS_PAGE_STATE.size;
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // 재조회 키
  const [errors, setErrors] = useState<CommonErrorState | null>(null); // 에러 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [editModal, setEditModal] = useState(false); // 정보 수정 모달 상태
  const isTablet = useMediaQuery({ maxWidth: 1023 });
  // 세션 정보 수정 상태
  const [sessionEdit, setSessionEdit] = useState<SessionEditState>(
    INITIAL_SESSION_EDIT_STATE,
  ); // 세션 정보 데이터 상태
  const [searchKeyword, setSearchKeyword] = useState(""); // 사용자 입력 상태
  const [deboundedKeyword, setDeboundedKeyword] = useState(searchKeyword); // 과도한 요청 방지
  const [members, setMembers] = useState<MemberState[]>([]); // 검색 응답 데이터 상태
  const [selectedMembers, setSelectedMembers] = useState<MemberState[]>([]); // 선택된 사용자
  const [selectedPartLabel, setSelectedPartLabel] = useState(
    ADMIN_DASHBOARD_PART_DEFAULT,
  );
  const [selectedPart, setSelectedPart] = useState("ALL"); // 요청 보낼 파트 상태

  // 세션 정보 수정
  const handleEdit = async () => {
    try {
      await editSessionInfo({
        sid: Number(sid),
        name: sessionEdit.name,
        useable: sessionEdit.useable,
      });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrors(getCommonErrorState(error));
    } finally {
      setEditModal(false);
    }
  };

  // 세션 활성/비활성화 토글
  const handleToggle = () => {
    setSessionEdit((prev) => ({ ...prev, useable: !prev.useable }));
  };

  // 검색된 사용자 리스트 추가
  const handleSelectMember = (member: MemberState) => {
    setSelectedMembers((prev) =>
      prev.some((selected) => selected.userId === member.userId)
        ? prev
        : [...prev, member],
    );
    setSearchKeyword("");
  };

  // 선택된 사용자 삭제
  const handleRemoveMember = (userId: number) => {
    setSelectedMembers((prev) =>
      prev.filter((member) => member.userId !== userId),
    );
  };

  // 파트 셀렉트 선택
  const handlePartChange = (partLabel: string) => {
    setSelectedPartLabel(partLabel);
    setSelectedPart(PART_LABEL_TO_REQUEST[partLabel] ?? "ALL");
  };

  // 사용자 추가
  const handleAdd = async () => {
    const userIds = selectedMembers.map((member) => member.userId);
    const hasSelectedPart = selectedPart !== "ALL";

    if (!hasSelectedPart && userIds.length === 0) return;

    try {
      await addMembers(
        hasSelectedPart
          ? {
              sid: Number(sid),
              part: selectedPart,
            }
          : {
              sid: Number(sid),
              userIds,
            },
      );
      setSearchKeyword("");
      setSelectedMembers([]);
      setSelectedPartLabel(ADMIN_DASHBOARD_PART_DEFAULT);
      setSelectedPart("ALL");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrors(getCommonErrorState(error));
    }
  };
  // 키워드 지연 반영
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeboundedKeyword(searchKeyword);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // 사용자 검색
  useEffect(() => {
    const getMembers = async () => {
      try {
        const res = await serachUser({ keyword: deboundedKeyword });
        const responseData = res.data?.data ?? res.data;

        setMembers(Array.isArray(responseData) ? responseData : []);
      } catch (error) {
        setErrors(getCommonErrorState(error));
      }
    };

    getMembers();
  }, [deboundedKeyword, selectedPart]);

  // 세션 정보/사용자 조회
  useEffect(() => {
    let alive = true;

    // 세셔 정보
    const fetchInfo = async () => {
      try {
        const res = await getSessionInfo({ sid: Number(sid) });
        const responseData = res.data?.data ?? res.data;
        const name = res.data.data.name;
        const useable = res.data.data.status === "활성화" ? true : false;

        if (!alive) return;

        setSessionInfo(responseData);
        setSessionEdit((prev) => ({ ...prev, name: name, useable: useable }));
      } catch (error) {
        if (!alive) return;
        setErrors(getCommonErrorState(error));
      }
    };

    // 사용자 정보
    const fetchMember = async () => {
      try {
        const res = await getSessionMember({
          sid: Number(sid),
          page: currentPage - 1,
          size: itemSumNum,
        });
        const responseData = res.data?.data ?? res.data;

        if (!alive) return;

        setMembersPage({
          content: Array.isArray(responseData?.content)
            ? responseData.content
            : [],
          page: responseData?.number ?? responseData?.page ?? 0,
          size: responseData?.size ?? itemSumNum,
          totalElements: responseData?.totalElements ?? 0,
          totalPages: responseData?.totalPages ?? 0,
          hasNext:
            typeof responseData?.hasNext === "boolean"
              ? responseData.hasNext
              : !(responseData?.last ?? true),
        });
      } catch (error) {
        if (!alive) return;
        setErrors(getCommonErrorState(error));
      }
    };

    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchInfo(), fetchMember()]);
      if (!alive) return;
      setIsLoading(false);
    };

    fetchAll();

    return () => {
      alive = false;
    };
  }, [sid, refreshKey, currentPage, itemSumNum]);

  useEffect(() => {
    if (membersPage.totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    if (membersPage.totalPages > 0 && currentPage > membersPage.totalPages) {
      setCurrentPage(membersPage.totalPages);
    }
  }, [currentPage, membersPage.totalPages]);

  return (
    <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 px-4 pt-7 pb-120 md:max-w-187.5 xl:max-w-280 xl:px-8">
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}

      {/* 세션 정보 수정 모달 */}
      {editModal && (
        <Modal>
          <Modal.Header onClick={() => setEditModal(false)}>
            정보 수정하기
          </Modal.Header>
          <div className="flex w-153 flex-col gap-2">
            <Modal.Description>세션명</Modal.Description>
            <Input
              value={sessionEdit.name}
              onChange={(e) =>
                setSessionEdit((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <Modal.Description>상태 설정</Modal.Description>
          <div className="mt-2 flex w-153 gap-2.5">
            <SessionActivateButton
              selected={sessionEdit.useable}
              onClick={handleToggle}
            />
            <SessionDeactivateButton
              selected={!sessionEdit.useable}
              onClick={handleToggle}
            />
          </div>

          <div className="flex justify-end">
            <Modal.ButtonLayout>
              <Button size="large" variant="primary" onClick={handleEdit}>
                수정
              </Button>
            </Modal.ButtonLayout>
          </div>
        </Modal>
      )}

      <TitleSection title="대시보드" />

      <SessionInfoOverview
        data={sessionInfo}
        onClick={() => setEditModal(true)}
      />

      <section>
        <div className="text-title text-ec-black">이 세션에 등록된 사용자</div>
        <div className="mt-2 flex gap-5">
          <div className="relative w-110">
            <SerachBar
              placeholder="추가하려는 사용자 이름 입력"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            {members.length > 0 && (
              <div className="bg-ec-box rounded-ec-10 absolute mt-1 w-full px-7 py-2">
                {members.map((member: MemberState) => (
                  <div
                    key={member.userId}
                    className="border-ec-outline-dark flex cursor-pointer items-center gap-2 border-b py-2 last:border-b-0"
                    onClick={() => handleSelectMember(member)}
                  >
                    <img
                      src={member.profileUrl}
                      className="h-5 w-5 rounded-[50%]"
                    />
                    {member.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <SelectBox
            options={SESSION_PART_OPTIONS}
            defaultValue={selectedPartLabel}
            onChange={handlePartChange}
          />
          <Button size="large" variant="primary" onClick={handleAdd}>
            사용자 등록
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-caption text-ec-sub">
            추가될 사용자(클릭하여 삭제)
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {selectedMembers.map((member) => (
              <SelectedUser
                key={member.userId}
                item={member}
                onRemove={handleRemoveMember}
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <PageNationFrame
            itemNum={membersPage.totalElements}
            itemSumNum={itemSumNum}
          >
            {() => {
              const pagedMembers = membersPage.content;

              return (
                <>
                  {!isTablet && (
                    <PageNationMenu>
                      <DashboardHeader />
                    </PageNationMenu>
                  )}

                  {pagedMembers.length === 0 && !isLoading ? (
                    <TableEmptyState label="등록된 사용자가 없어요." />
                  ) : (
                    <DashboardTableRows
                      sessionId={Number(sid)}
                      isLoading={isLoading}
                      members={pagedMembers}
                      onDeleteSuccess={() => setRefreshKey((prev) => prev + 1)}
                    />
                  )}

                  <PageNationButton onPageChange={setCurrentPage} />
                </>
              );
            }}
          </PageNationFrame>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboardPage;
