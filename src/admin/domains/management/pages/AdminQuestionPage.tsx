import {
  TitleSection,
  PageNationButton,
  PageNationFrame,
  PageNationItem,
  PageNationMenu,
  SerachBar,
  SelectBox,
} from "@/shared/components";
import { QUESTION_STATUS_OPTIONS } from "@/shared/constants";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatKoreanDateTime12 } from "@/shared/utils";

const QUESTION_STATUS_TO_API_VALUE: Record<string, string> = {
  전체: "",
  완료: "COMPLETED",
  대기: "PENDING",
};

const AdminQuestionPage = () => {
  const navigate = useNavigate();
  const authData = JSON.parse(
    localStorage.getItem("ecampus.auth.session") || "null",
  );
  const token = authData?.state?.session?.accessToken;

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체");

  interface QuestionItem {
    id: number;
    sessionId?: number;
    sid?: number;
    sessionName: string;
    title: string;
    createdAt: string;
    createdUserName: string;
    answeredUserName: string;
    status: string;
  }

  interface QuestionDataType {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    questions: QuestionItem[];
  }

  const [QuestionData, setQuestionData] = useState<QuestionDataType | null>(
    null,
  );

  const [QuestionDataPage, setQuestionDataPage] = useState(1);

  const QuestionDataItemNum = QuestionData?.totalElements ?? 0;

  const QuestionDataSumNum = 8;

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const QuestionDataResponse = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/v1/admin/questions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: QuestionDataPage - 1,
              size: QuestionDataSumNum,
              title: search,
              status: QUESTION_STATUS_TO_API_VALUE[selectedStatus],
            },
          },
        );

        const QuestionDataResult = QuestionDataResponse.data;

        if (QuestionDataResult.data) {
          setQuestionData(QuestionDataResult.data);
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

    fetchQuestionData();
  }, [QuestionDataSumNum, QuestionDataPage, search, selectedStatus, token]);

  interface AdminQuestionComponentProps {
    QuestionId: number;
    QuestionSessionName: string;
    QuestionTitle: string;
    QuestionRegistrantDate: string;
    QuestionCreate: string;
    QuestionAnwser: string;
    QuestionState: string;

    onClick?: () => void;
  }
  const AdminQuestionComponent = ({
    QuestionId,
    QuestionSessionName,
    QuestionTitle,
    QuestionRegistrantDate,
    QuestionCreate,
    QuestionAnwser,
    QuestionState,

    onClick,
  }: AdminQuestionComponentProps) => {
    return (
      <div className="flex cursor-pointer items-center" onClick={onClick}>
        <div className="text-ec-black ml-1.5 w-9.25 justify-start text-center text-sm font-medium">
          {QuestionId}
        </div>
        <div className="text-ec-black ml-6 line-clamp-1 w-64 justify-start text-sm font-medium">
          {QuestionSessionName}
        </div>
        <div className="text-ec-black ml-5 w-51.5 justify-start text-sm font-medium">
          {QuestionTitle}
        </div>
        <div className="text-ec-black ml-3.5 w-50 justify-start text-center text-sm font-medium">
          {QuestionRegistrantDate}
        </div>
        <div className="text-ec-black ml-9.75 w-10 justify-start text-center text-sm font-medium">
          {QuestionCreate}
        </div>
        <div
          className={`ml-9.5 w-10 justify-start text-center text-sm font-medium ${
            QuestionAnwser ? "text-ec-black" : "text-ec-sub"
          }`}
        >
          {QuestionAnwser || "미답변"}
        </div>
        <div
          className={`ml-8 w-6.5 justify-start text-center text-sm font-medium ${
            QuestionState === "COMPLETED" ? "text-ec-blue" : "text-ec-sub"
          }`}
        >
          {QuestionState === "COMPLETED" ? "완료" : "대기"}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full items-center justify-center pt-26.25 xl:pt-7.5">
      <div className="flex h-full w-251.5 flex-col items-center">
        <div className="flex w-full">
          <TitleSection title={`질문 및 답변`} />
        </div>
        <div className="my-5 flex w-full gap-2.5">
          <div className="flex w-107.5 items-center justify-center">
            <SerachBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="질문 제목으로 검색"
            />
          </div>
          <SelectBox
            options={QUESTION_STATUS_OPTIONS}
            defaultValue="전체"
            onChange={setSelectedStatus}
          />
        </div>
        <PageNationFrame
          itemNum={QuestionDataItemNum}
          itemSumNum={QuestionDataSumNum}
        >
          {({ startIndex }) => (
            <>
              <div className="flex h-112 w-251.5 flex-col">
                <PageNationMenu>
                  <div className="text-ec-table-topic ml-5 justify-start text-center text-xs font-medium">
                    ID
                  </div>
                  <div className="text-ec-table-topic ml-9.25 justify-start text-center text-xs font-medium">
                    세션 명
                  </div>
                  <div className="text-ec-table-topic ml-60.5 justify-start text-center text-xs font-medium">
                    제목
                  </div>
                  <div className="text-ec-table-topic ml-70.5 justify-start text-center text-xs font-medium">
                    등록일
                  </div>
                  <div className="text-ec-table-topic ml-33.25 justify-start text-center text-xs font-medium">
                    생성
                  </div>
                  <div className="text-ec-table-topic ml-14.25 justify-start text-center text-xs font-medium">
                    답변
                  </div>
                  <div className="text-ec-table-topic ml-11 justify-start text-center text-xs font-medium">
                    상태
                  </div>
                </PageNationMenu>
                {(QuestionData?.questions ?? []).map((data, index) => (
                  <PageNationItem
                    key={data.id}
                    absoluteIndex={startIndex + index}
                  >
                    <AdminQuestionComponent
                      QuestionId={data.id}
                      QuestionSessionName={data.sessionName}
                      QuestionTitle={data.title}
                      QuestionRegistrantDate={formatKoreanDateTime12(
                        data.createdAt,
                      )}
                      QuestionCreate={data.createdUserName}
                      QuestionAnwser={data.answeredUserName}
                      QuestionState={data.status}
                      onClick={() => {
                        navigate(`/admin/questions/manage?qid=${data.id}`);
                      }}
                    />
                  </PageNationItem>
                ))}
              </div>
              <PageNationButton onPageChange={setQuestionDataPage} />
            </>
          )}
        </PageNationFrame>
      </div>
    </div>
  );
};

export default AdminQuestionPage;
