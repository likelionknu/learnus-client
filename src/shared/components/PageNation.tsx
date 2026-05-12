import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface PageNationContextValue {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  startIndex: number;
  currentItems: string[];
}

const PageNationContext = createContext<PageNationContextValue | null>(null);

const usePageNationContext = () => {
  const context = useContext(PageNationContext);

  if (!context) {
    throw new Error(
      "PageNation components must be used inside PageNationFrame.",
    );
  }

  return context;
};

/* ====================== 프레임 시작 ====================== */

interface PageNationFrameProps {
  itemNum: number;
  itemSumNum: number;
  children:
    | ReactNode
    | ((args: { currentItems: string[]; startIndex: number }) => ReactNode);
}

export const PageNationFrame = ({
  itemNum,
  itemSumNum,
  children,
}: PageNationFrameProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages =
    itemSumNum > 0 ? Math.ceil(Math.max(itemNum, 0) / itemSumNum) : 0;
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * itemSumNum;
  const currentItems = useMemo(
    () =>
      Array.from({ length: Math.max(itemNum, 0) }, (_, index) => {
        return ` ${index + 1}`;
      }).slice(startIndex, startIndex + itemSumNum),
    [itemNum, itemSumNum, startIndex],
  );

  const value = useMemo(
    () => ({
      currentPage: safeCurrentPage,
      setCurrentPage,
      totalPages,
      startIndex,
      currentItems,
    }),
    [safeCurrentPage, totalPages, startIndex, currentItems],
  );

  const resolvedChildren =
    typeof children === "function"
      ? children({ currentItems, startIndex })
      : children;

  return (
    <PageNationContext.Provider value={value}>
      <div className="flex w-full flex-col items-center">
        {resolvedChildren}
      </div>
    </PageNationContext.Provider>
  );
};

/* ====================== 프레임 종료 ====================== */
/* ====================== 메뉴 시작 ====================== */

export const PageNationMenu = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-ec-table-header text-ec-black rounded-tl-ec-10 rounded-tr-ec-10 flex h-10 w-full items-center">
      {children}
    </div>
  );
};

/* ====================== 메뉴 종료 ====================== */
/* ====================== 아이템 시작 ====================== */

interface PageNationItemProps {
  absoluteIndex: number;
  children: ReactNode;
}

export const PageNationItem = ({
  absoluteIndex,
  children,
}: PageNationItemProps) => {
  const bgClass = (absoluteIndex + 1) % 2 === 0 ? "bg-ec-box" : "bg-ec-white";

  return (
    <div
      className={`${bgClass} text-ec-black flex h-12.75 w-full items-center`}
    >
      {children}
    </div>
  );
};

/* ====================== 아이템 종료 ====================== */
/* ====================== 버튼 시작 ====================== */
interface PageNationButtonProps {
  onPageChange?: (page: number) => void;
}

export const PageNationButton = ({ onPageChange }: PageNationButtonProps) => {
  const { totalPages, currentPage, setCurrentPage } = usePageNationContext();

  return (
    <div className="mt-5.5 flex items-center gap-2">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            className={`hover:bg-ec-table-topic hover:text-ec-white h-6.5 w-6.5 cursor-pointer rounded-full text-sm ${
              isActive
                ? "bg-ec-table-topic text-ec-white"
                : "bg-ec-table-header text-ec-table-topic"
            }`}
            onClick={() => {
              setCurrentPage(page);
              onPageChange?.(page);
            }}
            type="button"
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

/* ====================== 버튼 종료 ====================== */
