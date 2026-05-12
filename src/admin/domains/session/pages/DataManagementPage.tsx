import { TitleSection, PageNationButton, PageNationFrame, PageNationItem, PageNationMenu } from "@/shared/components";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatKoreanDateTime12 } from "@/shared/utils";
import { useNavigate, useParams } from "react-router-dom";

const DataManagementPage = () => {
  const navigate = useNavigate();
  const { sid } = useParams();

  const authData = JSON.parse(
    localStorage.getItem("ecampus.auth.session") || "null",
  );
  const token = authData?.state?.session?.accessToken;

  // --------------------------------------자료관리 api 부분 시작--------------------------------------

  interface FileItem {
    fileId: number;
    name: string;
    createdAt: string;
    writer: string;
    isPublic: boolean;
  }

  interface FilesDataType {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    files: FileItem[];
  }

  const [FilesData, setFilesData] = useState<FilesDataType | null>(null);

  const [FilesDataPage, setFilesDataPage] = useState(1);

  //api요청 주소에 1대신 setFilesDataPage의 값을 받아서 넣으면 됨

  const FilesDataItemNum = FilesData?.totalElements ?? 0;

  const FilesDataSumNum = 8;

  useEffect(() => {
    if (!token) return;

    const fetchFilesData = async () => {
      try {
        const FilesDataResponse = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/v1/admin/sessions/${sid}/files`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: FilesDataPage - 1,
              size: FilesDataSumNum,
            },
          },
        );

        const FilesDataResult = FilesDataResponse.data;

        if (FilesDataResult.data) {
          setFilesData(FilesDataResult.data);
          console.log("자료관리 데이터:", FilesDataResult.data);
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

    fetchFilesData();
  }, [FilesDataPage, token, sid]);

  // --------------------------------------자료관리 api 부분 끝--------------------------------------

  interface DataComponentProps {
    DataId: number;
    DataName: string;
    DataRegisterDate: string;
    DataRegistrant: string;
    DataVisibility: boolean;
    onClick?: () => void;
  }
  const DataComponent = ({
    DataId,
    DataName,
    DataRegisterDate,
    DataRegistrant,
    DataVisibility,
    onClick,
  }: DataComponentProps) => {
    return (
      <div className="flex cursor-pointer items-center" onClick={onClick}>
        <div className="text-ec-black ml-5 w-12.25 justify-start text-center text-sm font-medium">
          {DataId}
        </div>
        <div className="text-ec-black ml-2.5 line-clamp-1 w-134.75 justify-start text-sm font-medium">
          {DataName}
        </div>
        <div className="text-ec-black ml-3.5 w-50.5 justify-start text-center text-sm font-medium">
          {DataRegisterDate}
        </div>
        <div className="text-ec-black ml-6 w-12 justify-start text-center text-sm font-medium">
          {DataRegistrant}
        </div>
        <div
          className={`ml-6 w-11 justify-start text-center text-sm font-medium ${
            DataVisibility ? "text-ec-blue" : "text-ec-sub"
          }`}
        >
          {DataVisibility ? "공개" : "비공개"}
        </div>
      </div>
    );
  };
  return (
    <div className="flex w-full items-center justify-center pt-26.25 xl:pt-7.5">
      <div className="flex h-full w-251.5 flex-col items-center">
        <div className="flex w-full justify-between">
          <TitleSection title={`자료 관리`} />
          <div
            className="bg-ec-blue rounded-ec-10 flex h-9.5 w-30 cursor-pointer items-center justify-center"
            onClick={() => navigate("upload")}
          >
            <div className="text-ec-gnb-white text-center text-base font-medium">
              새 자료 추가
            </div>
          </div>
        </div>
        <div className="mt-5">
          <PageNationFrame
            itemNum={FilesDataItemNum}
            itemSumNum={FilesDataSumNum}
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
                  {(FilesData?.files ?? []).map((data, index) => (
                    <PageNationItem
                      key={data.fileId}
                      absoluteIndex={startIndex + index}
                    >
                      <DataComponent
                        DataId={data.fileId}
                        DataName={data.name}
                        DataRegisterDate={formatKoreanDateTime12(
                          data.createdAt,
                        )}
                        DataRegistrant={data.writer}
                        DataVisibility={data.isPublic}
                        onClick={() => navigate(`${data.fileId}`)}
                      />
                    </PageNationItem>
                  ))}
                </div>
                <PageNationButton onPageChange={setFilesDataPage} />
              </>
            )}
          </PageNationFrame>
        </div>
      </div>
    </div>
  );
};

export default DataManagementPage;
