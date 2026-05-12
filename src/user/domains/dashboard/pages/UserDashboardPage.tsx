import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import DashboardArrow from "@shared/assets/DashboardArrow.png";
import DashboardMain1 from "@shared/assets/DashboardMain1.png";
import DashboardMain2 from "@shared/assets/DashboardMain2.png";
import DashboardMain3 from "@shared/assets/DashboardMain3.png";

import {
  PageNationFrame,
  PageNationItem,
  PageNationMenu,
  PageNationButton,
} from "@shared/components";
import {
  PageNationMobileFrame,
  PageNationMobileItem,
  PageNationMobileButton,
} from "@/shared/components";

import {
  DashboardProfileModal,
  DashboardDemeritsModal,
  NotionSpecificModal,
} from "../components";

import { SkeletonCell } from "@/shared/components/skeleton";

import { formatDaysAgo, formatKoreanDateTime12 } from "@/shared/utils";

function UserDashBoardPage() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDashboardDemeritsModalOpen, setIsDashboardDemeritsModalOpen] =
    useState(false);
  const [isNotionSpecificModalOpen, setIsNotionSpecificModalOpen] =
    useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);

  const isTablet = useMediaQuery({ maxWidth: 1023 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --------------------------------------토큰 로컬스토리지 부분 시작--------------------------------------

  const authData = JSON.parse(
    localStorage.getItem("ecampus.auth.session") || "null",
  );
  const token = authData?.state?.session?.accessToken;

  // --------------------------------------토큰 로컬스토리지 부분 끝--------------------------------------
  // --------------------------------------대시보드 api 부분 시작--------------------------------------

  interface DashboardDataType {
    course: number;
    demeritCount: number;
    name: string;
    part: string;
    profileUrl: string;
    sessionCount: number;
    unsubmittedAssignmentCount: number;
  }

  const [dashboardData, setDashboardData] = useState<DashboardDataType | null>(
    null,
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/v1/users/me/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = response.data;

        if (result.data) {
          setDashboardData(result.data);
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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  // --------------------------------------대시보드 api 부분 끝--------------------------------------
  // --------------------------------------공지사항 api 부분 시작--------------------------------------

  interface NoticeItem {
    id: number;
    title: string;
    createdAt: string;
  }

  interface noticesDataType {
    hasNext: boolean;
    page: number;
    size: string;
    totalElements: number;
    totalPages: string;
    notices: NoticeItem[];
  }

  const [noticesData, setNoticesData] = useState<noticesDataType | null>(null);

  const [noticePage, setNoticePage] = useState(1);

  const NoticePageItemNum = noticesData?.totalElements ?? 0;

  const NoticePageitemSumNum = 4;

  // 위에는 기본 세팅임 페이지 네이션 부분이 섞여있음

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticesResponse = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/v1/notices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: noticePage - 1,
              size: NoticePageitemSumNum,
            },
          },
        );

        const noticesResult = noticesResponse.data;

        if (noticesResult.data) {
          setNoticesData(noticesResult.data);
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

    fetchNotices();
  }, [NoticePageitemSumNum, noticePage, token]);

  // --------------------------------------공자사항 api 부분 끝--------------------------------------
  // --------------------------------------알람 api 부분 시작--------------------------------------

  interface NotificationsItem {
    assignmentId: number;
    content: string;
    createdAt: string;
    fileId: number;
    id: number;
    noticeId: number;
    questionId: number;
    read: boolean;
    sessionId: number;
    type: string;
  }

  interface NotificationsDataType {
    hasNext: boolean;
    page: number;
    size: string;
    totalElements: number;
    totalPages: string;
    notifications: NotificationsItem[];
  }

  const [NotificationsData, setNotificationsData] =
    useState<NotificationsDataType | null>(null);

  const [NotificationsPage, setNotificationsPage] = useState(1);

  const NotificationsPageItemNum = NotificationsData?.totalElements ?? 0;

  const NotificationsPageitemSumNum = 4;

  // 위에는 기본 세팅임 페이지 네이션 부분이 섞여있음

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const NotificationsResponse = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/v1/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: NotificationsPage - 1,
              size: NotificationsPageitemSumNum,
            },
          },
        );

        const NotificationsResult = NotificationsResponse.data;

        if (NotificationsResult.data) {
          setNotificationsData(NotificationsResult.data);
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

    fetchNotices();
  }, [NotificationsPageitemSumNum, NotificationsPage, token]);

  // --------------------------------------알람 api 부분 끝--------------------------------------
  // --------------------------------------api 부분 끝--------------------------------------

  // ----------------------------------프로필 컴포넌트 시작----------------------------------

  const DashboardProfileComponent = () => {
    return (
      <div
        className="bg-ec-white border-ec-outline hover:bg-ec-outline flex h-21.5 w-87.5 cursor-pointer items-center justify-between rounded-full border pr-7.5 lg:w-109"
        onClick={() => setIsProfileModalOpen(true)}
      >
        <div className="flex items-center gap-5">
          {loading ? (
            <>
              <SkeletonCell
                className="ml-2.5 h-17.25 w-17.25"
                rounded="rounded-full"
              />
              <div className="flex h-11.5 flex-col justify-between">
                <SkeletonCell className="h-4 w-13.25" rounded="rounded-full" />
                <SkeletonCell className="h-4 w-30" rounded="rounded-full" />
              </div>
            </>
          ) : (
            <>
              <img
                className="ml-2.5 h-17.25 w-17.25 rounded-full"
                alt="NavUserProfileImg"
                src={dashboardData?.profileUrl}
              />

              <div className="flex h-11.5 flex-col justify-between">
                <div className="text-ec-blue justify-start text-base font-medium">
                  {dashboardData?.name}
                </div>
                <div className="text-ec-sub justify-start text-sm font-medium">
                  {dashboardData?.course}기{" "}
                  {dashboardData?.part === "OPERATOR" ? "운영진" : "아기사자"}
                </div>
              </div>
            </>
          )}
        </div>
        <img
          className="h-6.5 w-6.5"
          alt="DashboardArrow"
          src={DashboardArrow}
        />
      </div>
    );
  };

  // ----------------------------------프로필 컴포넌트 끝----------------------------------
  // ----------------------------------세션,과제,벌점 컴포넌트 시작----------------------------------

  interface DashboardMainComponentProps {
    imageSrc: string;
    description: string;
    count: number;
    bgColorClass?: string;
    darkBgColorClass?: string;
    onClick?: () => void;
  }
  const DashboardMainComponent = ({
    imageSrc,
    description,
    count,
    bgColorClass = "bg-[#E7EDFF]",
    darkBgColorClass = "dark:bg-black",
    onClick,
  }: DashboardMainComponentProps) => {
    const handleClick = typeof onClick === "function" ? onClick : undefined;

    return (
      <div
        className="bg-ec-white border-ec-outline hover:bg-ec-outline flex h-21.5 w-87.5 cursor-pointer items-center rounded-full border lg:w-52"
        onClick={handleClick}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`ml-2.5 flex h-17.25 w-17.25 items-center justify-center rounded-full ${bgColorClass} ${darkBgColorClass}`}
          >
            <img className="scale-50" alt={description} src={imageSrc} />
          </div>

          <div className="flex h-11.5 flex-col justify-between">
            <div className="text-ec-sub text-sm font-medium">{description}</div>
            {loading ? (
              <SkeletonCell className="h-4 w-10" rounded="rounded-ec-10" />
            ) : (
              <div className="text-ec-blue text-base font-medium">
                {count}개
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------세션,과제,벌점 컴포넌트 끝----------------------------------
  // ----------------------------------페이지네이션 제목 컴포넌트 시작----------------------------------

  interface DashboardMainTitleProps {
    title: string;
  }
  const DashboardMainTitle = ({ title }: DashboardMainTitleProps) => {
    return (
      <div className="text-ec-black w-full justify-start pt-7.5 pb-4.5 text-lg font-medium lg:text-2xl lg:font-semibold">
        {title}
      </div>
    );
  };

  // ----------------------------------페이지네이션 제목 컴포넌트 끝----------------------------------
  // ----------------------------------페이지네이션 공지사항 컴포넌트 시작----------------------------------

  interface NotionComponentProps {
    noticeId: string;
    noticeTitle: string;
    createdAt: string;
    onClick?: () => void;
  }
  const NotionComponent = ({
    noticeId,
    noticeTitle,
    createdAt,
    onClick,
  }: NotionComponentProps) => {
    return (
      <div className="flex cursor-pointer items-center" onClick={onClick}>
        {loading ? (
          <>
            <SkeletonCell className="ml-5.25 h-4 w-8" rounded="rounded-full" />
            <SkeletonCell className="ml-5 h-4 w-190" rounded="rounded-full" />
            <SkeletonCell
              className="mr-4 ml-12 h-4 w-52"
              rounded="rounded-full"
            />
          </>
        ) : (
          <>
            <div className="text-ec-black ml-5.25 w-8 justify-start text-center text-sm font-medium">
              {noticeId}
            </div>
            <div className="text-ec-black ml-5 line-clamp-1 w-190 justify-start text-sm font-medium">
              {noticeTitle}
            </div>
            <div className="text-ec-black mr-4 ml-12 w-54 justify-start text-center text-sm font-medium">
              {createdAt}
            </div>
          </>
        )}
      </div>
    );
  };

  // ----------------------------------페이지네이션 공지사항 컴포넌트 끝----------------------------------
  // ----------------------------------페이지네이션 모바일 공지사항 컴포넌트 시작----------------------------------

  interface NotionMoblieComponentProps {
    title: string;
    date: string;
  }

  const NotionMoblieComponent = ({
    title,
    date,
  }: NotionMoblieComponentProps) => {
    return (
      <div className="flex flex-col justify-between gap-2.5 p-5">
        <div className="text-ec-black line-clamp-1 w-80 justify-start text-sm font-medium">
          {title}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-ec-sub line-clamp-1 justify-start text-xs font-medium">
            작성일
          </div>
          <div className="text-ec-sub line-clamp-1 justify-start text-xs font-medium">
            {date}
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------페이지네이션 모바일 공지사항 컴포넌트 끝----------------------------------
  // ----------------------------------페이지네이션 알람 컴포넌트 시작----------------------------------

  interface MissAlartComponentProps {
    alartContent: string;
    alartStatus: boolean;
    alartDate: string;
    onClick?: () => void;
  }
  const MissAlartComponent = ({
    alartContent,
    alartStatus,
    alartDate,
    onClick,
  }: MissAlartComponentProps) => {
    const alartStatusText = alartStatus ? "읽음" : "안 읽음";
    const alartStatusClass = alartStatus ? "text-ec-blue" : "text-ec-red";

    return (
      <div className="flex cursor-pointer items-center" onClick={onClick}>
        {loading ? (
          <>
            <SkeletonCell className="ml-8 h-4 w-218" rounded="rounded-full" />
            <SkeletonCell className="ml-10 h-4 w-14" rounded="rounded-full" />
            <SkeletonCell className="ml-9.5 h-4 w-14" rounded="rounded-full" />
          </>
        ) : (
          <>
            <div className="text-ec-black ml-8 w-218 justify-start text-sm font-medium">
              {alartContent}
            </div>
            <div
              className={`${alartStatusClass} ml-10 line-clamp-1 w-14 justify-center text-center text-sm font-medium`}
            >
              {alartStatusText}
            </div>
            <div className="text-ec-black ml-9.5 w-14 justify-start text-center text-sm font-medium">
              {alartDate}
            </div>
          </>
        )}
      </div>
    );
  };

  // ----------------------------------페이지네이션 알람 컴포넌트 끝----------------------------------
  // ----------------------------------페이지네이션 모바일 알람 컴포넌트 시작----------------------------------

  interface MissAlartMoblieComponentProps {
    title: string;
    date: string;
  }

  const MissAlartMoblieComponent = ({
    title,
    date,
  }: MissAlartMoblieComponentProps) => {
    return (
      <div className="flex flex-col justify-between gap-2.5 p-5">
        <div className="text-ec-black line-clamp-1 w-80 justify-start text-sm font-medium">
          {title}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-ec-sub line-clamp-1 justify-start text-xs font-medium">
            작성일
          </div>
          <div className="text-ec-sub line-clamp-1 justify-start text-xs font-medium">
            {date}
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------페이지네이션 모바일 알람 컴포넌트 끝----------------------------------

  return (
    <>
      <div className="mb-7 flex h-full w-full items-center justify-center min-[1024px]:scale-85 min-[1280px]:scale-100">
        <div className="mt-16.5 flex h-full max-w-87.5 flex-col items-center md:max-w-187.5 md:px-0 lg:mt-0 lg:max-w-280">
          <div className="text-ec-black w-full justify-start py-7.5 text-2xl font-semibold lg:text-3xl">
            환영해요!
          </div>

          <div className="flex h-93.5 w-full flex-wrap justify-between md:h-47 lg:h-21.5 lg:items-center">
            <DashboardProfileComponent />
            <DashboardMainComponent
              imageSrc={DashboardMain1}
              description="미제출 과제"
              count={dashboardData?.unsubmittedAssignmentCount ?? 0}
              bgColorClass="bg-[#FFF5D9]"
              darkBgColorClass="dark:bg-[#332D1E]"
              onClick={() => navigate("/user/sessions/assignments")}
            />
            <DashboardMainComponent
              imageSrc={DashboardMain2}
              description="내가 소속된 세션"
              count={dashboardData?.sessionCount ?? 0}
              bgColorClass="bg-[#E7EDFF]"
              darkBgColorClass="dark:bg-[#1E2A4A]"
              onClick={() => navigate("/user/sessions")}
            />
            <DashboardMainComponent
              imageSrc={DashboardMain3}
              description="내가 받은 벌점"
              count={dashboardData?.demeritCount ?? 0}
              bgColorClass="bg-[#FFE0EB]"
              darkBgColorClass="dark:bg-[#3A242B]"
              onClick={() => setIsDashboardDemeritsModalOpen(true)}
            />
          </div>
          <DashboardMainTitle title="최근 공지사항을 확인하세요" />
          {isTablet ? (
            <>
              <PageNationMobileFrame>
                <PageNationMobileItem>
                  <NotionMoblieComponent
                    title="멋쟁이사자처럼의 첫 번째 공지사항이에요"
                    date="2026년 2월 14일 오전 12시 38분"
                  />
                </PageNationMobileItem>
                <PageNationMobileItem>
                  <NotionMoblieComponent
                    title="멋쟁이사자처럼의 첫 번째 공지사항이에요"
                    date="2026년 2월 14일 오전 12시 38분"
                  />
                </PageNationMobileItem>
                <PageNationMobileItem>
                  <NotionMoblieComponent
                    title="멋쟁이사자처럼의 첫 번째 공지사항이에요"
                    date="2026년 2월 14일 오전 12시 38분"
                  />
                </PageNationMobileItem>
                <PageNationMobileItem>
                  <NotionMoblieComponent
                    title="멋쟁이사자처럼의 첫 번째 공지사항이에요"
                    date="2026년 2월 14일 오전 12시 38분"
                  />
                </PageNationMobileItem>
              </PageNationMobileFrame>
              <PageNationMobileButton />
            </>
          ) : (
            <PageNationFrame
              itemNum={NoticePageItemNum}
              itemSumNum={NoticePageitemSumNum}
            >
              {({ startIndex }) => (
                <>
                  <div className="flex h-61 w-full flex-col">
                    <PageNationMenu>
                      <div className="text-ec-table-topic ml-8 justify-start text-center text-xs font-medium">
                        ID
                      </div>
                      <div className="text-ec-table-topic ml-7.5 justify-start text-center text-xs font-medium">
                        제목
                      </div>
                      <div className="text-ec-table-topic ml-222 justify-start text-center text-xs font-medium">
                        생성일
                      </div>
                    </PageNationMenu>
                    {(noticesData?.notices ?? []).map((notice, index) => (
                      <PageNationItem
                        key={notice.id}
                        absoluteIndex={startIndex + index}
                      >
                        <NotionComponent
                          noticeId={String(notice.id)}
                          noticeTitle={notice.title}
                          createdAt={formatKoreanDateTime12(notice.createdAt)}
                          onClick={() => {
                            setSelectedNoticeId(notice.id);
                            setIsNotionSpecificModalOpen(true);
                          }}
                        />
                      </PageNationItem>
                    ))}
                  </div>
                  <PageNationButton onPageChange={setNoticePage} />
                </>
              )}
            </PageNationFrame>
          )}

          <DashboardMainTitle title="놓친 알림이 없는지 확인하세요" />

          {isTablet ? (
            <>
              <PageNationMobileFrame>
                <PageNationMobileItem>
                  <MissAlartMoblieComponent
                    title="멋쟁이사자처럼의 첫 번째 공지사항이에요"
                    date="2026년 2월 14일 오전 12시 38분"
                  />
                </PageNationMobileItem>
                <PageNationMobileItem>
                  <MissAlartMoblieComponent
                    title="멋쟁이사자처럼의 첫 번째 공지사항이에요"
                    date="2026년 2월 14일 오전 12시 38분"
                  />
                </PageNationMobileItem>
                <PageNationMobileItem>
                  <MissAlartMoblieComponent
                    title="멋쟁이사자처럼의 첫 번째 공지사항이에요"
                    date="2026년 2월 14일 오전 12시 38분"
                  />
                </PageNationMobileItem>
                <PageNationMobileItem>
                  <MissAlartMoblieComponent
                    title="멋쟁이사자처럼의 첫 번째 공지사항이에요"
                    date="2026년 2월 14일 오전 12시 38분"
                  />
                </PageNationMobileItem>
              </PageNationMobileFrame>
              <PageNationMobileButton />
            </>
          ) : (
            <PageNationFrame
              itemNum={NotificationsPageItemNum}
              itemSumNum={NotificationsPageitemSumNum}
            >
              {({ startIndex }) => (
                <>
                  <div className="flex h-61 w-full flex-col">
                    <PageNationMenu>
                      <div className="text-ec-table-topic ml-8 justify-start text-center text-xs font-medium">
                        내용
                      </div>
                      <div className="text-ec-table-topic ml-225 justify-start text-center text-xs font-medium">
                        상태
                      </div>
                      <div className="text-ec-table-topic ml-19 justify-start text-center text-xs font-medium">
                        수신일
                      </div>
                    </PageNationMenu>
                    {(NotificationsData?.notifications ?? []).map(
                      (Notifications, index) => (
                        <PageNationItem
                          key={Notifications.id}
                          absoluteIndex={startIndex + index}
                        >
                          <MissAlartComponent
                            alartContent={String(Notifications.content)}
                            alartStatus={Notifications.read}
                            alartDate={formatDaysAgo(Notifications.createdAt)}
                            onClick={() => navigate("/user/notification")}
                          />
                        </PageNationItem>
                      ),
                    )}
                  </div>
                  <PageNationButton onPageChange={setNotificationsPage} />
                </>
              )}
            </PageNationFrame>
          )}
        </div>
      </div>
      {isProfileModalOpen && (
        <DashboardProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
      {isDashboardDemeritsModalOpen && (
        <DashboardDemeritsModal
          onClose={() => setIsDashboardDemeritsModalOpen(false)}
        />
      )}
      {isNotionSpecificModalOpen && selectedNoticeId !== null && (
        <NotionSpecificModal
          noticeId={selectedNoticeId}
          onClose={() => setIsNotionSpecificModalOpen(false)}
        />
      )}
    </>
  );
}

export default UserDashBoardPage;
