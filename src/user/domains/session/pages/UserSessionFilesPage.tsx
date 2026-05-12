import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { TitleSection, PageNationButton, PageNationFrame, PageNationMenu } from "@/shared/components";
import { TableEmptyState } from "@/shared/components/table";
import { formatKoreanDateTime12, getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { FilesTableHeader, FilesTableRow } from "../components";
import { ListBoxMobile, InfoMobile } from "../components/application";
import { getSessionFiles } from "../apis";
import type { SessionFile } from "../types";
import { ErrorModal } from "@/shared/components/modal";

function UserSessionFilesPage() {
  const navigate = useNavigate();
  const isTablet = useMediaQuery({ maxWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 764 });

  const [files, setFiles] = useState<SessionFile[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const size = 8;
  const { sid } = useParams();
  const sidNumber = sid ? Number(sid) : null;

  const openFileDetail = (id: number) => {
    navigate(`${id}`);
  };

  const [errors, setErrors] = useState<CommonErrorState | null>(null);

  const fetchFiles = useCallback(
    async (page = 0) => {
      if (!sidNumber) return;

      setIsLoading(true);
      try {
        const res = await getSessionFiles({ sid: sidNumber, page, size });
        const responseData = res.data;
        setFiles(
          Array.isArray(responseData?.content) ? responseData.content : [],
        );
        setTotalElements(responseData?.totalElements ?? 0);
      } catch (error) {
        setErrors(getCommonErrorState(error));
      } finally {
        setIsLoading(false);
      }
    },
    [sidNumber, size],
  );

  useEffect(() => {
    if (!sidNumber) return;
    fetchFiles(0);
  }, [sidNumber, fetchFiles]);

  const itemNum = totalElements;

  return (
    <div className="mx-auto mt-30 flex w-full max-w-251 flex-col gap-5 px-4 md:pt-7 xl:mt-0">
      <TitleSection
        title={`자료(${itemNum})`}
        subText="이 세션에 추가된 자료예요"
      />

      <PageNationFrame itemNum={totalElements} itemSumNum={size}>
        {() => {
          return (
            <>
              {!isTablet && (
                <PageNationMenu>
                  <FilesTableHeader />
                </PageNationMenu>
              )}

              {files.length === 0 && !isLoading ? (
                <TableEmptyState label="등록된 세션 자료가 없어요" />
              ) : !isTablet ? (
                <FilesTableRow
                  files={files}
                  isLoading={isLoading}
                  onRowClick={(file) => openFileDetail(file.id)}
                />
              ) : (
                <div
                  className={`grid gap-4 ${
                    isMobile ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {files.map((file) => (
                    <ListBoxMobile
                      key={file.id}
                      title={file.name}
                      onClick={() => openFileDetail(file.id)}
                    >
                      <InfoMobile label="작성자" value={file.createdBy} />
                      <InfoMobile
                        label="등록일"
                        value={formatKoreanDateTime12(file.createdAt)}
                      />
                    </ListBoxMobile>
                  ))}
                </div>
              )}

              <PageNationButton onPageChange={(page) => fetchFiles(page - 1)} />
            </>
          );
        }}
      </PageNationFrame>
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}
    </div>
  );
}

export default UserSessionFilesPage;
