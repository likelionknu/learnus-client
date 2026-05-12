import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextBox, TitleSection, Button } from "@/shared/components";
import { CommentInput } from "@/shared/components/comment";
import {
  formatKoreanDateTime24,
  getCommonErrorState,
  type CommonErrorState,
} from "@/shared/utils";
import {
  QuestionContentSection,
  QuestionMetaRow,
} from "@/user/domains/session/components/question";
import { QuestionMetaRowSkeleton } from "@/user/domains/session/components/skeleton";
import { useMediaQuery } from "react-responsive";
import { Modal, ErrorModal } from "@/shared/components/modal";
import { deleteSessionQuestions, getSessionQuestion } from "../apis";
import {
  CommentSection as CommentSection,
  MobileCommentSection,
} from "../components";
import type { SessionQuestionDetailRow } from "@/user/domains/session/types";

type ModalState = "CONFIRM" | "DONE" | null;
type QuestionMetaRow = {
  label: string;
  value: string;
};

const skeletonRows = ["질문 등록일", "등록자", "답변 등록일", "답변자", "상태"];

const INITIAL_QUESTION_DETAIL_STATE: SessionQuestionDetailRow = {
  answer: null,
  answeredAt: null,
  answeredUserId: null,
  answeredUserName: null,
  content: "",
  createdAt: "",
  createdUserId: null,
  createdUserName: null,
  id: 0,
  isMyQuestion: false,
  sessionId: 0,
  sessionName: "",
  status: "PENDING",
  title: "",
};

const createQuestionMetaRows = (
  detail: SessionQuestionDetailRow,
): QuestionMetaRow[] => [
  {
    label: "질문 등록일",
    value: detail.createdAt ? formatKoreanDateTime24(detail.createdAt) : "-",
  },
  { label: "등록자", value: detail.createdUserName ?? "-" },
  {
    label: "답변 등록일",
    value: detail.answeredAt ? formatKoreanDateTime24(detail.answeredAt) : "-",
  },
  { label: "답변자", value: detail.answeredUserName ?? "-" },
  {
    label: "상태",
    value: detail.status === "COMPLETED" ? "완료" : "대기",
  },
];

function UserQuestionDetailPage() {
  const { questionId, sessionId } = useParams(); // 질문/세션 id
  const navigate = useNavigate();
  // 질문 내용 상태
  const [questionDetail, setQuestionDetail] =
    useState<SessionQuestionDetailRow>(INITIAL_QUESTION_DETAIL_STATE);
  // 상단 메타 데이터 상태
  const [questionsMeta, setQuestionsMeta] = useState<QuestionMetaRow[]>(
    createQuestionMetaRows(INITIAL_QUESTION_DETAIL_STATE),
  );
  const [modalState, setModalState] = useState<ModalState>(null); // 모달 상태
  const [errors, setErrors] = useState<CommonErrorState | null>(null); // 에러 상태
  const [refreshKey, setRefreshKey] = useState(0); // 등록/삭제 후 질문 재조회
  const [commentCount, setCommentCount] = useState(0); // 댓글 개수
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const isMobile = useMediaQuery({ maxWidth: 479 }); // 모바일 반응형 분기 처리

  // 모달 비활성화
  const handleClose = useCallback(() => {
    setModalState(null);
  }, []);

  // 요청 성공 후 이동
  const handleSuccess = useCallback(() => {
    setModalState(null);
    navigate(-1);
  }, [navigate]);

  // 삭제 api
  const handleDeleteQuestion = async () => {
    try {
      await deleteSessionQuestions({ qid: Number(questionId) });
      setErrors(null);
      setModalState("DONE");
    } catch (error) {
      setErrors(getCommonErrorState(error));
    }
  };

  // 삭제 확인 모달
  const renderStepModal = () => {
    if (!modalState) return null;

    const isConfirm = modalState === "CONFIRM";

    return (
      <Modal>
        <Modal.Header onClick={isConfirm ? handleClose : handleSuccess}>
          질문 삭제
        </Modal.Header>
        <Modal.Description>
          {isConfirm
            ? "질문을 정말 삭제하시겠어요? 이 질문을 그대로 남겨두어\n 다른 사용자에게 도움이 될 수 있도록 도와주세요"
            : "질문을 삭제했어요."}
        </Modal.Description>
        <Modal.ButtonLayout>
          <Button
            size="modal"
            variant={isConfirm ? "danger" : "primary"}
            onClick={isConfirm ? handleDeleteQuestion : handleSuccess}
          >
            {isConfirm ? "삭제" : "확인"}
          </Button>
          {isConfirm && <Modal.Cancelled onClick={handleClose} />}
        </Modal.ButtonLayout>
      </Modal>
    );
  };

  // 질문 상세 정보 조회
  useEffect(() => {
    const fetchQuestionDetail = async () => {
      setIsLoading(true);
      const { qid, sid } = { qid: Number(questionId), sid: Number(sessionId) };

      try {
        const res = await getSessionQuestion({ qid, sid });
        const responseData = res.data.data;

        if (responseData) {
          setQuestionDetail(responseData);
          setQuestionsMeta(createQuestionMetaRows(responseData));
        }
        setErrors(null);
      } catch (error) {
        setErrors(getCommonErrorState(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionDetail();
  }, [questionId, sessionId]);

  const isMyQuestion = questionDetail.isMyQuestion; // 내 질문 여부

  return (
    <div
      className={`${isMyQuestion ? "xl:px-8" : "xl:ml-30"} text-ec-black mx-auto w-full max-w-87.5 px-4 pt-7 pb-120 md:max-w-187.5 xl:max-w-280`}
    >
      {/* 에러 모달 */}
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}
      {/* 삭제 확인 모달 */}
      {renderStepModal()}

      <div className="flex flex-col gap-5">
        <TitleSection
          title={questionDetail.title}
          {...(isMyQuestion
            ? {
                actions: [
                  {
                    label: "삭제",
                    buttonType: "danger" as const,
                    onClick: () => {
                      setModalState("CONFIRM");
                    },
                  },
                ],
              }
            : {})}
        />
        {/* 질문 기본 정보 */}
        <TextBox px={!isMobile} py={!isMobile}>
          <div className="flex flex-col gap-0 xl:gap-2">
            {isLoading
              ? skeletonRows.map((row) => (
                  <QuestionMetaRowSkeleton key={row} label={row} />
                ))
              : questionsMeta.map((row, index) => (
                  <QuestionMetaRow
                    key={row.label}
                    label={row.label}
                    value={row.value}
                    className={
                      isMobile
                        ? `px-5 py-4 ${index % 2 === 0 ? "bg-ec-box" : "bg-ec-white border-ec-outline border"} ${
                            index === 0 ? "rounded-t-ec-10" : ""
                          } ${
                            index === questionsMeta.length - 1
                              ? "rounded-b-ec-10"
                              : ""
                          }`
                        : ""
                    }
                  />
                ))}
          </div>
        </TextBox>

        <QuestionContentSection label="질문" content={questionDetail.content} />
        <QuestionContentSection
          label="답변"
          content={questionDetail.answer ?? "아직 등록된 답변이 없어요."}
        />
        {/* 댓글 섹션 */}
        <div className="flex flex-col gap-2">
          <span className="text-body-2 xl:text-ec-sub text-ec-black">
            {`${commentCount}개의 댓글`}
          </span>
          {isMobile ? (
            <>
              <MobileCommentSection
                qid={Number(questionId)}
                refreshKey={refreshKey}
                onCountChange={setCommentCount}
                setRefresh={setRefreshKey}
              />
              <CommentInput
                qid={Number(questionId)}
                setRefresh={setRefreshKey}
              />
            </>
          ) : (
            <TextBox>
              <div>
                <CommentSection
                  qid={Number(questionId)}
                  isLoading={isLoading}
                  refreshKey={refreshKey}
                  onCountChange={setCommentCount}
                  setRefresh={setRefreshKey}
                />
              </div>
              <CommentInput
                qid={Number(questionId)}
                setRefresh={setRefreshKey}
              />
            </TextBox>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserQuestionDetailPage;
