import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { TitleSection, SerachBar, PageNationButton, PageNationFrame, PageNationMenu } from "@/shared/components";
import { TableEmptyState } from "@/shared/components/table";
import { GroupTableHeader, GroupTableRow } from "../components";
import { GroupInfo, ListBoxMobile } from "../components/application";
import { getSessionUsers } from "../apis";

interface Group {
  course: number;
  name: string;
  part: string;
  email: string;
}

const PART_MAP: Record<string, string> = {
  BACKEND: "백엔드",
  FRONTEND: "프론트엔드",
  DESIGN: "디자인",
  PLANNING: "기획",
};

const PAGE_SIZE = 8;
const FETCH_SIZE = 1000;

function UserSessionGroupPage() {
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { sid } = useParams();
  const sidNumber = sid ? Number(sid) : null;

  const isTablet = useMediaQuery({ maxWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const fetchUsers = useCallback(async () => {
    if (!sidNumber) return;

    setIsLoading(true);
    try {
      const res = await getSessionUsers({
        sid: sidNumber,
        page: 0,
        size: FETCH_SIZE,
      });

      const data = res.data.data ?? res.data;

      setGroups(Array.isArray(data?.content) ? data.content : []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [sidNumber]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredGroups = useMemo(() => {
    if (!normalizedSearch) return groups;

    return groups.filter((group) =>
      group.name.toLowerCase().includes(normalizedSearch),
    );
  }, [groups, normalizedSearch]);

  const itemNum = filteredGroups.length;
  const itemSumNum = PAGE_SIZE;

  return (
    <div className="mt-30 flex w-full max-w-251 flex-col gap-5 px-8 md:pt-7 xl:mt-0">
      <TitleSection
        title={`사용자 및 그룹(${itemNum})`}
        subText="이 세션에 추가된 사용자를 확인해보세요"
      />

      <div className="w-full lg:w-107.5">
        <SerachBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="사용자 이름으로 검색"
        />
      </div>

      <PageNationFrame
        key={normalizedSearch}
        itemNum={itemNum}
        itemSumNum={itemSumNum}
      >
        {({ startIndex }) => {
          const pagedGroups = filteredGroups.slice(
            startIndex,
            startIndex + itemSumNum,
          );

          return (
            <>
              {!isTablet && (
                <PageNationMenu>
                  <GroupTableHeader />
                </PageNationMenu>
              )}

              {pagedGroups.length === 0 && !isLoading ? (
                <TableEmptyState
                  label={
                    normalizedSearch
                      ? "검색 결과에 맞는 사용자가 없어요"
                      : "등록된 사용자가 없어요"
                  }
                />
              ) : !isTablet ? (
                <GroupTableRow isLoading={isLoading} users={pagedGroups} />
              ) : (
                <div
                  className={`grid w-full gap-4 ${
                    isMobile ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {pagedGroups.map((group) => (
                    <ListBoxMobile
                      key={group.email}
                      title={group.name}
                      subText={group.email}
                    >
                      <GroupInfo label="기수" value={`${group.course}기`} />
                      <GroupInfo
                        label="파트"
                        value={PART_MAP[group.part] || group.part}
                      />
                    </ListBoxMobile>
                  ))}
                </div>
              )}

              <PageNationButton />
            </>
          );
        }}
      </PageNationFrame>
    </div>
  );
}

export default UserSessionGroupPage;
