import {
  TitleSection,
  PageNationButton,
  PageNationFrame,
  PageNationItem,
  PageNationMenu,
} from "@/shared/components";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatKoreanDateTime12 } from "@/shared/utils";
import { useNavigate } from "react-router-dom";

const AdminNotionPage = () => {
  const navigate = useNavigate();
  const authData = JSON.parse(
    localStorage.getItem("ecampus.auth.session") || "null",
  );
  const token = authData?.state?.session?.accessToken;

  // --------------------------------------공지사항 api 부분 시작--------------------------------------

  interface NotionDataItem {
    id: number;
    title: string;
    pinned: boolean;
    createdAt: string;
    authorName: string;
  }

  interface NotionDataType {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    notices: NotionDataItem[];
  }

  const [NotionData, setNotionData] = useState<NotionDataType | null>(null);

  const [NotionDataPage, setNotionDataPage] = useState(1);

  //api요청 주소에 1대신 setNotionDataPage의 값을 받아서 넣으면 됨

  const NotionDataItemNum = NotionData?.totalElements ?? 0;

  const NotionDataSumNum = 8;

  useEffect(() => {
    const fetchNotionData = async () => {
      try {
        const NotionDataResponse = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/v1/admin/notices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: NotionDataPage - 1,
              size: NotionDataSumNum,
            },
          },
        );

        const NotionDataResult = NotionDataResponse.data;

        if (NotionDataResult.data) {
          setNotionData(NotionDataResult.data);
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

    fetchNotionData();
  }, [NotionDataSumNum, NotionDataPage, token]);

  // --------------------------------------공지사항 api 부분 끝--------------------------------------

  interface AdminNotionComponentProps {
    NotionId: number;
    NotionTitle: string;
    NotionFix: boolean;
    NotionDate: string;
    NotionRegistrant: string;

    onClick?: () => void;
  }
  const AdminNotionComponent = ({
    NotionId,
    NotionTitle,
    NotionFix,
    NotionDate,
    NotionRegistrant,
    onClick,
  }: AdminNotionComponentProps) => {
    return (
      <div className="flex cursor-pointer items-center" onClick={onClick}>
        <div className="text-ec-black ml-5 w-12.25 justify-start text-center text-sm font-medium">
          {NotionId}
        </div>
        <div className="text-ec-black ml-2.5 line-clamp-1 w-lg justify-start text-sm font-medium">
          {NotionTitle}
        </div>
        <div className="text-ec-black ml-9 w-50 justify-start text-center text-sm font-medium">
          {NotionDate}
        </div>

        <div className="text-ec-black ml-8.5 w-11 justify-start text-center text-sm font-medium">
          {NotionRegistrant}
        </div>
        <div
          className={`text-ec-black ml-8.5 w-7 justify-start text-center text-sm font-medium ${
            NotionFix ? "text-ec-red" : "text-ec-sub"
          }`}
        >
          {NotionFix ? "고정" : "-"}
        </div>
      </div>
    );
  };
  return (
    <div className="flex w-full items-center justify-center pt-26.25 xl:pt-7.5">
      <div className="flex h-full w-251.5 flex-col items-center">
        <div className="flex w-full justify-between">
          <TitleSection title={`공지사항`} />
          <div
            className="bg-ec-blue rounded-ec-10 flex h-9.5 w-30 cursor-pointer items-center justify-center"
            onClick={() => {
              navigate("upload");
            }}
          >
            <div className="text-ec-gnb-white text-center text-base font-medium">
              새 공지사항 추가
            </div>
          </div>
        </div>
        <div className="mt-5">
          <PageNationFrame
            itemNum={NotionDataItemNum}
            itemSumNum={NotionDataSumNum}
          >
            {({ startIndex }) => (
              <>
                <div className="flex h-112 w-251.5 flex-col">
                  <PageNationMenu>
                    <div className="text-ec-table-topic ml-9.5 justify-start text-center text-xs font-medium">
                      ID
                    </div>
                    <div className="text-ec-table-topic ml-7.25 justify-start text-center text-xs font-medium">
                      자료 명
                    </div>
                    <div className="text-ec-table-topic ml-151 justify-start text-center text-xs font-medium">
                      등록일
                    </div>
                    <div className="text-ec-table-topic ml-29.5 justify-start text-center text-xs font-medium">
                      등록자
                    </div>
                    <div className="text-ec-table-topic ml-8.25 justify-start text-center text-xs font-medium">
                      공개 여부
                    </div>
                  </PageNationMenu>
                  {(NotionData?.notices ?? []).map((data, index) => (
                    <PageNationItem
                      key={data.id}
                      absoluteIndex={startIndex + index}
                    >
                      <AdminNotionComponent
                        NotionId={data.id}
                        NotionTitle={data.title}
                        NotionFix={data.pinned}
                        NotionDate={formatKoreanDateTime12(data.createdAt)}
                        NotionRegistrant={data.authorName}
                        onClick={() => navigate(`${data.id}`)}
                      />
                    </PageNationItem>
                  ))}
                </div>
                <PageNationButton onPageChange={setNotionDataPage} />
              </>
            )}
          </PageNationFrame>
        </div>
      </div>
    </div>
  );
};

export default AdminNotionPage;
