import { useEffect, useState } from "react";
import axios from "axios";
import {
  TitleSection,
  SerachBar,
  SelectBox,
  PageNationButton,
  PageNationFrame,
  PageNationItem,
  PageNationMenu,
} from "@/shared/components";
import { TableEmptyState } from "@/shared/components/table";
import { ErrorModal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import {
  SESSION_PART_OPTIONS,
  SESSION_PARTS_DEFAULT_OPTION,
} from "@/shared/constants";

const SESSION_PART_OPTIONS_API_VALUE: Record<string, string> = {
  전체: "",
  운영진: "OPERATOR",
  기획: "PLANNING",
  백엔드: "BACKEND",
  프론트엔드: "FRONTEND",
  디자인: "DESIG",
};

const USER_PART_LABELS: Record<string, string> = {
  OPERATOR: "운영진",
  PLANNING: "기획",
  BACKEND: "백엔드",
  FRONTEND: "프론트엔드",
  DESIGN: "디자인",
  DESIG: "디자인",
};

interface UserListItem {
  course: number;
  name: string;
  part: string;
  email: string;
}

interface UserListPageState {
  users: UserListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface FilterState {
  name: string;
  part: string;
}

interface UserListComponentProps {
  ListCohort: string;
  ListName: string;
  ListPart: string;
  ListMail: string;
  onClick?: () => void;
}

const INITIAL_USER_LIST_PAGE_STATE: UserListPageState = {
  users: [],
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
};

const UserListComponent = ({
  ListCohort,
  ListName,
  ListPart,
  ListMail,
  onClick,
}: UserListComponentProps) => {
  return (
    <div className="flex cursor-pointer items-center" onClick={onClick}>
      <div className="text-ec-black ml-7.75 w-7 justify-start text-center text-sm font-medium">
        {ListCohort}
      </div>
      <div className="text-ec-black ml-18 line-clamp-1 w-10 justify-start text-center text-sm font-medium">
        {ListName}
      </div>
      <div className="text-ec-black ml-9.5 w-28 justify-start text-center text-sm font-medium">
        {ListPart}
      </div>
      <div className="text-ec-black ml-12.5 w-173.5 justify-start text-sm font-medium">
        {ListMail}
      </div>
    </div>
  );
};

const UserListPage = () => {
  const authData = JSON.parse(
    localStorage.getItem("ecampus.auth.session") || "null",
  );
  const token = authData?.state?.session?.accessToken;

  const [userListPage, setUserListPage] = useState<UserListPageState>(
    INITIAL_USER_LIST_PAGE_STATE,
  );
  const [filter, setFilter] = useState<FilterState>({
    name: "",
    part: SESSION_PARTS_DEFAULT_OPTION,
  });
  const [debouncedName, setDebouncedName] = useState(filter.name);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);

  const itemNum = userListPage.totalElements;
  const itemSumNum = userListPage.size;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedName(filter.name);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [filter.name]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedName, filter.part]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/v1/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: currentPage - 1,
              size: INITIAL_USER_LIST_PAGE_STATE.size,
              name: debouncedName,
              part: SESSION_PART_OPTIONS_API_VALUE[filter.part] ?? "",
            },
          },
        );

        const responseData = response.data?.data ?? response.data;

        setErrors(null);
        setUserListPage({
          users: Array.isArray(responseData?.users) ? responseData.users : [],
          page: responseData?.page ?? 0,
          size: responseData?.size ?? INITIAL_USER_LIST_PAGE_STATE.size,
          totalElements: responseData?.totalElements ?? 0,
          totalPages: responseData?.totalPages ?? 0,
        });
      } catch (error) {
        setErrors(getCommonErrorState(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, debouncedName, filter.part, token]);

  return (
    <div className="flex w-full items-center justify-center pt-26.25 xl:pt-7.5">
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}

      <div className="flex h-full w-251.5 flex-col items-center">
        <div className="flex w-full">
          <TitleSection
            title={`사용자(${userListPage.totalElements})`}
            subText="멋쟁이사자처럼 강남대학교의 소속원을 확인할 수 있어요"
          />
        </div>
        <div className="my-5 flex w-full gap-2.5">
          <div className="flex w-107.5 items-center justify-center">
            <SerachBar
              value={filter.name}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="사용자 이름으로 검색"
            />
          </div>
          <SelectBox
            options={SESSION_PART_OPTIONS}
            defaultValue={SESSION_PARTS_DEFAULT_OPTION}
            onChange={(value) =>
              setFilter((prev) => ({ ...prev, part: value }))
            }
          />
        </div>

        <PageNationFrame itemNum={itemNum} itemSumNum={itemSumNum}>
          {({ startIndex }) => {
            const isEmpty = userListPage.users.length === 0;

            return (
              <>
                <div className="flex h-112 w-251.5 flex-col">
                  <PageNationMenu>
                    <div className="text-ec-table-topic ml-8.25 justify-start text-center text-xs font-medium">
                      기수
                    </div>
                    <div className="text-ec-table-topic ml-21 justify-start text-center text-xs font-medium">
                      이름
                    </div>
                    <div className="text-ec-table-topic ml-23.75 justify-start text-center text-xs font-medium">
                      파트
                    </div>
                    <div className="text-ec-table-topic ml-24 justify-start text-center text-xs font-medium">
                      이메일 주소
                    </div>
                  </PageNationMenu>

                  {isEmpty && !isLoading ? (
                    <TableEmptyState label="등록된 사용자를 찾을 수 없거나 존재하지 않아요" />
                  ) : (
                    userListPage.users.map((user, index) => (
                      <PageNationItem
                        key={`${user.email}-${user.name}-${index}`}
                        absoluteIndex={startIndex + index}
                      >
                        <UserListComponent
                          ListCohort={`${user.course}기`}
                          ListName={user.name}
                          ListPart={
                            USER_PART_LABELS[user.part] ?? user.part ?? ""
                          }
                          ListMail={user.email}
                        />
                      </PageNationItem>
                    ))
                  )}
                </div>
                <PageNationButton onPageChange={setCurrentPage} />
              </>
            );
          }}
        </PageNationFrame>
      </div>
    </div>
  );
};

export default UserListPage;
