import { useMediaQuery } from "react-responsive";
import { Button, TextBox, TitleSection } from "@/shared/components";
import { AssignmentsMetaRow as AssignmentMetaRow, AssignmentContentSection } from "../components";
import { QuestionContentSection } from "../components/question";
import { useEffect, useState } from "react";
import { postAssignmentSubmission } from "../apis";
import { useParams } from "react-router-dom";
import { Modal, ErrorModal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { useAssignmentDetail } from "../hooks";
import { createAssignmentMetaRows } from "../utils";

function UserSessionAssignmentsView() {
  const isTablet = useMediaQuery({ maxWidth: 1024 });

  const [modalType, setModalType] = useState<
    "assignmentConfirm" | "assignmentSuccess" | null
  >(null);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);

  const { sid, assignmentId: assignmentIdParam } = useParams();
  const sidNumber = sid ? Number(sid) : null;
  const assignmentId = assignmentIdParam ? Number(assignmentIdParam) : null;

  const isValidAssignmentParams =
    sidNumber !== null &&
    assignmentId !== null &&
    !Number.isNaN(sidNumber) &&
    !Number.isNaN(assignmentId) &&
    sidNumber > 0 &&
    assignmentId > 0;

  const {
    assignment,
    assignmentName,
    content,
    setContent,
    isLoading,
    error,
    fetchData,
  } = useAssignmentDetail(sidNumber, assignmentId);

  useEffect(() => {
    if (!isValidAssignmentParams) {
      return;
    }
    fetchData();
  }, [fetchData, isValidAssignmentParams]);

  const handleSubmit = async () => {
    if (!sidNumber || !assignmentId) return;
    if (!content.trim()) {
      alert("내용을 입력하세요");
      return;
    }
    try {
      await postAssignmentSubmission({
        sid: sidNumber,
        assignmentId,
        payload: { content },
      });
      await fetchData();
    } catch (error) {
      setErrors(getCommonErrorState(error));
    }
  };

  if (isLoading) return <div className="px-4 py-8">로딩 중...</div>;
  if (error) return <div className="px-4 py-8 text-red-500">{error}</div>;
  if (!assignment)
    return <div className="px-4 py-8">과제 정보를 찾을 수 없습니다.</div>;

  const assignmentMetaRows = createAssignmentMetaRows(assignment);
  return (
    <div className="mt-30 flex w-full max-w-251 flex-col gap-5 px-8 md:pt-7 xl:mt-0">
      <TitleSection title={assignmentName || "과제 상세"} />
      <TextBox>
        <div className="flex flex-col">
          {assignmentMetaRows.map((row, index) => (
            <AssignmentMetaRow
              key={row.label}
              label={row.label}
              value={row.value}
              className={`px-2 py-1 ${
                isTablet && index % 2 === 1 ? "bg-ec-box" : ""
              }`}
            />
          ))}
        </div>
      </TextBox>
      <QuestionContentSection label="설명" content={assignment.description} />
      <AssignmentContentSection
        label="제출"
        content={content}
        onChange={setContent}
      />
      {assignment.assignmentStatus === "NOT_SUBMITTED" && (
        <Button
          onClick={() => setModalType("assignmentConfirm")}
          disabled={!content.trim()}
          size="primary"
          className="rounded-ec-10 bg-ec-blue text-ec-white w-20 cursor-pointer self-end px-3.5 py-2 text-sm font-medium"
        >
          과제 제출
        </Button>
      )}
      {modalType === "assignmentConfirm" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            과제 제출
          </Modal.Header>
          <Modal.Description>
            이 과제를 제출할까요? <br />
            과제를 제출하면 더 이상 제출한 과제에 대해 수정할 수 없어요
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="primary"
              variant="primary"
              onClick={async () => {
                await handleSubmit();
                setModalType("assignmentSuccess");
              }}
            >
              확인
            </Button>
            <Modal.Cancelled onClick={() => setModalType(null)} />
          </Modal.ButtonLayout>
        </Modal>
      )}
      {modalType === "assignmentSuccess" && (
        <Modal>
          <Modal.Header onClick={() => setModalType(null)}>
            과제 제출
          </Modal.Header>
          <Modal.Description>과제를 성공적으로 제출했어요</Modal.Description>
          <Modal.ButtonLayout>
            <Button size="primary" onClick={() => setModalType(null)}>
              확인
            </Button>
          </Modal.ButtonLayout>
        </Modal>
      )}
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

export default UserSessionAssignmentsView;
