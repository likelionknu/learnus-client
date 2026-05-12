import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, TitleSection } from "@/shared/components";
import { ErrorModal, Modal } from "@/shared/components/modal";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import {
  AssignmentDeleteModal,
  AssignmentDescriptionSection,
  AssignmentEditModal,
  AssignmentMetaCard,
  AssignmentStatusTable,
  AssignmentSubmitDetailModal,
} from "../components/assignments";
import {
  deleteAdminAssignmentSubmit,
  getAdminAssignmentDetail,
  getAdminAssignmentSubmitUserDetail,
  getAdminAssignmentSubmits,
  updateAdminAssignmentSubmitEvaluate,
} from "../api";
import type {
  AdminAssignmentDetail,
  AdminAssignmentEvaluate,
  AdminAssignmentParticipant,
  AdminAssignmentParticipantsPage,
} from "../types";

function parsePositiveInteger(value: string | null) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function parseNonNegativeInteger(value: string | null) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue >= 0 ? parsedValue : null;
}

const INITIAL_ASSIGNMENT_PARTICIPANTS_PAGE: AdminAssignmentParticipantsPage = {
  content: [],
  empty: true,
  first: true,
  last: true,
  number: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
};

function createCurrentDateTimeString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

function AdminSessionAssignmentsView() {
  const navigate = useNavigate();
  const { aid, sid } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const assignmentId = parsePositiveInteger(aid ?? null);
  const sessionId = parsePositiveInteger(sid ?? null);
  const currentPage = parseNonNegativeInteger(searchParams.get("page")) ?? 0;
  const [assignment, setAssignment] = useState<AdminAssignmentDetail | null>(
    null,
  );
  const [participantsPage, setParticipantsPage] =
    useState<AdminAssignmentParticipantsPage>(
      INITIAL_ASSIGNMENT_PARTICIPANTS_PAGE,
    );
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false);
  const [isParticipantActionPending, setIsParticipantActionPending] =
    useState(false);
  const [isParticipantDetailLoading, setIsParticipantDetailLoading] =
    useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<AdminAssignmentParticipant | null>(null);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAssignmentDetail = async () => {
      if (!assignmentId) {
        setAssignment(null);
        setIsDetailLoading(false);
        return;
      }

      setIsDetailLoading(true);
      setErrors(null);

      try {
        const assignmentDetail = await getAdminAssignmentDetail({
          aid: assignmentId,
        });

        if (!isMounted) {
          return;
        }

        setAssignment(assignmentDetail);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setAssignment(null);
        setErrors(getCommonErrorState(error));
      } finally {
        if (isMounted) {
          setIsDetailLoading(false);
        }
      }
    };

    fetchAssignmentDetail();

    return () => {
      isMounted = false;
    };
  }, [assignmentId]);

  useEffect(() => {
    let isMounted = true;

    const fetchAssignmentSubmits = async () => {
      if (!assignmentId) {
        setParticipantsPage(INITIAL_ASSIGNMENT_PARTICIPANTS_PAGE);
        setIsParticipantsLoading(false);
        return;
      }

      setIsParticipantsLoading(true);

      try {
        const assignmentSubmits = await getAdminAssignmentSubmits({
          aid: assignmentId,
          page: currentPage,
        });

        if (!isMounted) {
          return;
        }

        setParticipantsPage(
          assignmentSubmits ?? INITIAL_ASSIGNMENT_PARTICIPANTS_PAGE,
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setParticipantsPage(INITIAL_ASSIGNMENT_PARTICIPANTS_PAGE);
        setErrors(getCommonErrorState(error));
      } finally {
        if (isMounted) {
          setIsParticipantsLoading(false);
        }
      }
    };

    fetchAssignmentSubmits();

    return () => {
      isMounted = false;
    };
  }, [assignmentId, currentPage]);

  useEffect(() => {
    if (!selectedParticipant) {
      setIsParticipantDetailLoading(false);
      return;
    }

    let isMounted = true;
    const targetSubmitId = selectedParticipant.submitId;

    setIsParticipantDetailLoading(true);

    void (async () => {
      try {
        const participantDetail = await getAdminAssignmentSubmitUserDetail({
          submitId: targetSubmitId,
        });

        if (!isMounted) {
          return;
        }

        setSelectedParticipant((prev) => {
          if (!prev || prev.submitId !== targetSubmitId) {
            return prev;
          }

          return participantDetail ?? { ...prev, submissionContent: null };
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrors(getCommonErrorState(error));
      } finally {
        if (isMounted) {
          setIsParticipantDetailLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedParticipant?.submitId]);

  const handlePageChange = (page: number) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("page", String(page));
    setSearchParams(nextSearchParams);
  };

  const handleDeleteSuccessConfirm = () => {
    setIsDeleteSuccessModalOpen(false);
    navigate(
      sessionId
        ? `/admin/sessions/${sessionId}/assignments`
        : "/admin/sessions",
      {
        replace: true,
      },
    );
  };

  const handleParticipantClick = (participant: AdminAssignmentParticipant) => {
    setSelectedParticipant({
      ...participant,
      submissionContent: undefined,
    });
  };

  const handleParticipantEvaluate = (evaluate: AdminAssignmentEvaluate) => {
    if (
      !selectedParticipant ||
      !evaluate ||
      isParticipantActionPending ||
      isParticipantDetailLoading
    ) {
      return;
    }

    const targetParticipant = selectedParticipant;
    const evaluatedAt = createCurrentDateTimeString();

    setIsParticipantActionPending(true);
    setErrors(null);

    void (async () => {
      try {
        await updateAdminAssignmentSubmitEvaluate({
          sid: targetParticipant.submitId,
          evaluate,
        });

        setParticipantsPage((prev) => ({
          ...prev,
          content: prev.content.map((participant) =>
            participant.submitId === targetParticipant.submitId
              ? { ...participant, evaluate, evaluatedAt }
              : participant,
          ),
        }));

        setSelectedParticipant((prev) =>
          prev?.submitId === targetParticipant.submitId
            ? { ...prev, evaluate, evaluatedAt }
            : prev,
        );
      } catch (error) {
        setErrors(getCommonErrorState(error));
      } finally {
        setIsParticipantActionPending(false);
      }
    })();
  };

  const handleCancelParticipantAssignment = () => {
    if (
      !selectedParticipant ||
      isParticipantActionPending ||
      isParticipantDetailLoading
    ) {
      return;
    }

    const targetParticipant = selectedParticipant;

    setIsParticipantActionPending(true);
    setErrors(null);

    void (async () => {
      try {
        await deleteAdminAssignmentSubmit({
          sid: targetParticipant.submitId,
        });

        setParticipantsPage((prev) => {
          const nextContent = prev.content.filter(
            (participant) =>
              participant.submitId !== targetParticipant.submitId,
          );
          const nextTotalElements = Math.max(prev.totalElements - 1, 0);

          return {
            ...prev,
            content: nextContent,
            empty: nextContent.length === 0,
            totalElements: nextTotalElements,
            totalPages:
              nextTotalElements === 0
                ? 0
                : Math.ceil(nextTotalElements / Math.max(prev.size, 1)),
          };
        });

        setAssignment((prev) => {
          if (!prev) {
            return prev;
          }

          return {
            ...prev,
            participantCount: Math.max(prev.participantCount - 1, 0),
            submittedCount:
              targetParticipant.assignmentStatus === "SUBMITTED"
                ? Math.max(prev.submittedCount - 1, 0)
                : prev.submittedCount,
            notSubmittedCount:
              targetParticipant.assignmentStatus === "NOT_SUBMITTED"
                ? Math.max(prev.notSubmittedCount - 1, 0)
                : prev.notSubmittedCount,
          };
        });

        setSelectedParticipant(null);
      } catch (error) {
        setErrors(getCommonErrorState(error));
      } finally {
        setIsParticipantActionPending(false);
      }
    })();
  };

  const renderContent = () => {
    if (!assignmentId) {
      return (
        <div className="rounded-ec-10 bg-ec-white text-ec-sub px-10 py-10 text-sm">
          조회할 과제 정보가 없어 `aid`를 확인해주세요.
        </div>
      );
    }

    if (isDetailLoading) {
      return (
        <div className="rounded-ec-10 bg-ec-white text-ec-sub px-10 py-10 text-sm">
          과제 정보를 불러오는 중이에요.
        </div>
      );
    }

    if (!assignment) {
      return (
        <div className="rounded-ec-10 bg-ec-white text-ec-sub px-10 py-10 text-sm">
          과제 정보를 찾을 수 없어요.
        </div>
      );
    }

    return (
      <>
        <AssignmentMetaCard assignment={assignment} />
        <AssignmentDescriptionSection description={assignment.description} />
        <AssignmentStatusTable
          participants={participantsPage.content}
          totalElements={participantsPage.totalElements}
          totalPages={participantsPage.totalPages}
          currentPage={currentPage}
          pageSize={participantsPage.size}
          isLoading={isParticipantsLoading}
          onPageChange={handlePageChange}
          onParticipantClick={handleParticipantClick}
        />
      </>
    );
  };

  return (
    <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 px-4 pt-7 pb-120 md:max-w-187.5 xl:mx-0 xl:max-w-280 xl:px-8">
      {isEditModalOpen && assignment && (
        <AssignmentEditModal
          assignment={assignment}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={(updatedAssignment) => {
            setAssignment(updatedAssignment);
            setIsEditModalOpen(false);
          }}
        />
      )}
      {isDeleteModalOpen && assignment && (
        <AssignmentDeleteModal
          assignment={assignment}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={() => {
            setIsDeleteModalOpen(false);
            setIsDeleteSuccessModalOpen(true);
          }}
        />
      )}
      {isDeleteSuccessModalOpen && (
        <Modal>
          <Modal.Header onClick={handleDeleteSuccessConfirm}>
            과제 삭제
          </Modal.Header>
          <Modal.Description>과제를 삭제했어요</Modal.Description>
          <Modal.ButtonLayout>
            <Button size="primary" onClick={handleDeleteSuccessConfirm}>
              확인
            </Button>
          </Modal.ButtonLayout>
        </Modal>
      )}
      {selectedParticipant && (
        <AssignmentSubmitDetailModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          onApprove={() => handleParticipantEvaluate("PASS")}
          onReject={() => handleParticipantEvaluate("FAIL")}
          onCancelAssignment={handleCancelParticipantAssignment}
          isActionPending={isParticipantActionPending}
          isDetailLoading={isParticipantDetailLoading}
        />
      )}
      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}
      <div className="flex w-full max-w-251.5 flex-col gap-5">
        <div className="flex flex-col gap-3">
          <TitleSection title={assignment?.title ?? "과제 상세"} />
          <div className="flex flex-wrap gap-2.5">
            <Button
              size="primary"
              disabled={!assignment}
              onClick={() => setIsEditModalOpen(true)}
            >
              수정
            </Button>
            <Button
              size="primary"
              variant="danger"
              disabled={!assignment}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              삭제
            </Button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default AdminSessionAssignmentsView;
