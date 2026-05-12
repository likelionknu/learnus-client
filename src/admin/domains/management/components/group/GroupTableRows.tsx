import { useState } from "react";
import { SkeletonCell } from "@/shared/components/skeleton";
import { GroupActionStepModal, type GroupActionType } from "../modal";
import GroupIcon from "./GroupIcon";
import type { AdminGroupRow } from "../../types";
import {
  addDemerit,
  addMemo,
  changePart,
  changeGeneration,
  deleteAllDemerits,
  deleteAllMemos,
  deleteDemerit,
  deleteMemo,
  getDemerits,
  getMemos,
} from "../../apis";
import { SESSION_PART_OPTIONS } from "@/shared/constants";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { ErrorModal } from "@/shared/components/modal";
import {
  MemoModal,
  GenerationModal,
  PartModal,
  DemeritModal,
} from "../modal/group";
import type { GroupMemo, MemoModalTarget, GroupDemerit } from "../modal/types";
import useActionStepModal from "./useActionStepModal";

interface GroupTableRowsProps {
  isLoading: boolean;
  members: AdminGroupRow[];
  onOpenModal: (action: GroupActionType, uid?: number) => void;
  onRefresh: () => void;
}

interface GroupMemoApiRow {
  id: number;
  content: string;
  createdAt: string;
  grantedUser?:
    | {
        name?: string;
      }
    | string;
}

interface SelectOption<TValue extends string> {
  label: string;
  value: TValue;
}

interface SelectedMemberTarget extends MemoModalTarget {
  part: string;
  penaltyPoint: number;
}

interface GroupDemeritApiRow {
  id?: number | string;
  did?: number | string;
  demeritId?: number | string;
  demeritHistoryId?: number | string;
  reason?: DemeritReasonCode | string;
  demerit?: number;
  score?: number;
  createdAt?: string;
  grantedAt?: string;
  grantedUser?:
    | {
        name?: string;
      }
    | string;
}

const GROUP_TABLE_COLUMNS =
  "grid-cols-[0.55fr_0.85fr_0.9fr_2.2fr_2.2fr_0.7fr_3.6fr]";
const MEMO_MAX_LENGTH = 170;

type GenerationValue = "11" | "12" | "13" | "14";
type DemeritReasonCode =
  | "LATE"
  | "ABSENT"
  | "ASSIGNMENT_NOT_SUBMITTED"
  | "ASSIGNMENT_COPY"
  | "ETC";

type PartCode = "OPERATOR" | "PLANNING" | "BACKEND" | "FRONTEND" | "DESIGN";

const GENERATION_OPTIONS: ReadonlyArray<SelectOption<GenerationValue>> = [
  { label: "11기", value: "11" },
  { label: "12기", value: "12" },
  { label: "13기", value: "13" },
  { label: "14기", value: "14" },
];
const GENERATION_OPTION_LABELS = GENERATION_OPTIONS.map(
  (option) => option.label,
);
const GENERATION_VALUE_BY_LABEL = new Map<string, GenerationValue>(
  GENERATION_OPTIONS.map((option) => [option.label, option.value]),
);

const PART_OPTIONS: ReadonlyArray<SelectOption<PartCode>> = [
  {
    label: SESSION_PART_OPTIONS[1] ?? "운영진",
    value: "OPERATOR",
  },
  {
    label: SESSION_PART_OPTIONS[2] ?? "기획",
    value: "PLANNING",
  },
  {
    label: SESSION_PART_OPTIONS[3] ?? "백엔드",
    value: "BACKEND",
  },
  {
    label: SESSION_PART_OPTIONS[4] ?? "프론트엔드",
    value: "FRONTEND",
  },
  {
    label: SESSION_PART_OPTIONS[5] ?? "디자인",
    value: "DESIGN",
  },
];
const PART_OPTION_LABELS = PART_OPTIONS.map((option) => option.label);
const PART_VALUE_BY_LABEL = new Map<string, PartCode>(
  PART_OPTIONS.map((option) => [option.label, option.value]),
);
const PART_LABEL_BY_VALUE = new Map<PartCode, string>(
  PART_OPTIONS.map((option) => [option.value, option.label]),
);

const DEMERIT_REASON_PLACEHOLDER = "사유 선택하세요";
const DEMERIT_SCORE_PLACEHOLDER = "점수 선택";
const DEMERIT_REASON_ENTRIES: ReadonlyArray<{
  label: string;
  value: DemeritReasonCode;
}> = [
  { label: "지각", value: "LATE" },
  { label: "결석", value: "ABSENT" },
  {
    label: "과제 미제출",
    value: "ASSIGNMENT_NOT_SUBMITTED",
  },
  {
    label: "과제 카피 제출",
    value: "ASSIGNMENT_COPY",
  },
  { label: "기타", value: "ETC" },
];
const DEMERIT_REASON_OPTIONS = [
  DEMERIT_REASON_PLACEHOLDER,
  ...DEMERIT_REASON_ENTRIES.map((entry) => entry.label),
];
const DEMERIT_REASON_CODE_BY_LABEL = new Map<string, DemeritReasonCode>(
  DEMERIT_REASON_ENTRIES.map((entry) => [entry.label, entry.value]),
);
const DEMERIT_REASON_LABEL_BY_CODE = new Map<string, string>(
  DEMERIT_REASON_ENTRIES.map((entry) => [entry.value, entry.label]),
);
const DEMERIT_SCORE_OPTIONS = [DEMERIT_SCORE_PLACEHOLDER, "1점", "2점", "3점"];
const DEMERIT_SCORE_VALUE_BY_LABEL = new Map<string, number>([
  ["1점", 1],
  ["2점", 2],
  ["3점", 3],
]);

const getDemeritId = (...values: Array<number | string | undefined | null>) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number.parseInt(value, 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return null;
};

type MemoActionType = Extract<
  GroupActionType,
  "USER_MEMO_ADD" | "USER_MEMO_DELETE" | "USER_MEMO_RESET"
>;
type DemeritActionType = Extract<
  GroupActionType,
  "USER_DEMERIT_ASSIGN" | "USER_DEMERIT_RESET" | "USER_DEMERIT_REVOKE"
>;

type MemoActionPayload =
  | { type: "USER_MEMO_ADD"; content: string }
  | { type: "USER_MEMO_DELETE"; mid: number }
  | { type: "USER_MEMO_RESET" };
type DemeritActionPayload =
  | { type: "USER_DEMERIT_ASSIGN"; reason: DemeritReasonCode; demerit: number }
  | { type: "USER_DEMERIT_RESET" }
  | { type: "USER_DEMERIT_REVOKE"; did: number };

const truncateKoreanName = (name: string) => {
  const chars = [...name];
  const isKoreanOnly = /^[가-힣]+$/.test(name);

  if (!isKoreanOnly || chars.length <= 3) {
    return name;
  }

  return `${chars.slice(0, 3).join("")}...`;
};

function GroupTableRows({
  isLoading,
  members,
  onOpenModal,
  onRefresh,
}: GroupTableRowsProps) {
  const [errors, setErrors] = useState<CommonErrorState | null>(null);
  const [selectedMember, setSelectedMember] =
    useState<SelectedMemberTarget | null>(null);

  const [memoModalStep, setMemoModalStep] = useState<"LIST" | "ADD">("LIST");
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [memos, setMemos] = useState<GroupMemo[]>([]);
  const [memoInput, setMemoInput] = useState("");
  const [isMemoLoading, setIsMemoLoading] = useState(false);
  const memoActionModal = useActionStepModal<MemoActionType>();
  const [memoActionPayload, setMemoActionPayload] =
    useState<MemoActionPayload | null>(null);

  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState<
    GenerationValue | ""
  >("");
  const generationActionModal = useActionStepModal<"USER_GENERATION_CHANGE">();

  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [selectedPartCode, setSelectedPartCode] = useState<PartCode | null>(
    null,
  );
  const partActionModal = useActionStepModal<"USER_PART_CHANGE">();
  const [demeritModalStep, setDemeritModalStep] = useState<"MAIN" | "LIST">(
    "MAIN",
  );
  const [isDemeritModalOpen, setIsDemeritModalOpen] = useState(false);
  const [demerits, setDemerits] = useState<GroupDemerit[]>([]);
  const [isDemeritLoading, setIsDemeritLoading] = useState(false);
  const demeritActionModal = useActionStepModal<DemeritActionType>();
  const [demeritActionPayload, setDemeritActionPayload] =
    useState<DemeritActionPayload | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDemeritReason, setSelectedDemeritReason] = useState(
    DEMERIT_REASON_PLACEHOLDER,
  );
  const [selectedDemeritScore, setSelectedDemeritScore] = useState(
    DEMERIT_SCORE_PLACEHOLDER,
  );

  const fetchMemos = async (uid: number) => {
    setIsMemoLoading(true);

    try {
      const res = await getMemos({ uid });
      const responseData: GroupMemoApiRow[] = Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      const mappedMemos: GroupMemo[] = responseData.map((memo) => {
        const grantedUserName =
          typeof memo.grantedUser === "string"
            ? memo.grantedUser
            : (memo.grantedUser?.name ?? "");

        return {
          id: memo.id,
          content: memo.content,
          createdAt: memo.createdAt,
          grantedUser: grantedUserName,
        };
      });

      setMemos(mappedMemos);
    } catch (error) {
      setErrors(getCommonErrorState(error));
    } finally {
      setIsMemoLoading(false);
    }
  };

  const fetchDemerits = async (uid: number) => {
    setIsDemeritLoading(true);

    try {
      const res = await getDemerits({ uid });
      const responseData: GroupDemeritApiRow[] = Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      const mappedDemerits: GroupDemerit[] = responseData.map((demerit) => {
        const parsedScore = Number(
          demerit.demerit ?? demerit.score ?? Number.NaN,
        );
        const reasonCode = String(demerit.reason ?? "");
        const parsedId = getDemeritId(
          demerit.did,
          demerit.id,
          demerit.demeritId,
          demerit.demeritHistoryId,
        );
        const grantedUserName =
          typeof demerit.grantedUser === "string"
            ? demerit.grantedUser
            : (demerit.grantedUser?.name ?? "");

        return {
          id: parsedId,
          reason:
            DEMERIT_REASON_LABEL_BY_CODE.get(reasonCode) || reasonCode || "-",
          demerit: Number.isFinite(parsedScore) ? parsedScore : 0,
          createdAt: demerit.createdAt ?? demerit.grantedAt ?? "",
          name: grantedUserName,
        };
      });

      setDemerits(mappedDemerits);
      setSelectedMember((prev) => {
        if (!prev || prev.uid !== uid) return prev;

        return {
          ...prev,
          penaltyPoint: mappedDemerits.reduce(
            (sum, demerit) => sum + demerit.demerit,
            0,
          ),
        };
      });
    } catch (error) {
      setErrors(getCommonErrorState(error));
    } finally {
      setIsDemeritLoading(false);
    }
  };

  const handleCloseMemoActionModal = () => {
    memoActionModal.close();
    setMemoActionPayload(null);
  };

  const handleCloseMemoModal = () => {
    handleCloseMemoActionModal();
    setIsMemoModalOpen(false);
    setSelectedMember(null);
    setMemoModalStep("LIST");
    setMemoInput("");
    setMemos([]);
  };

  const openMemoActionModal = (
    action: MemoActionType,
    payload: MemoActionPayload,
  ) => {
    setMemoActionPayload(payload);
    memoActionModal.openConfirm(action);
  };

  const executeMemoAction = async (payload: MemoActionPayload) => {
    if (!selectedMember) return;

    switch (payload.type) {
      case "USER_MEMO_ADD":
        await addMemo({ uid: selectedMember.uid, content: payload.content });
        setMemoInput("");
        setMemoModalStep("LIST");
        await fetchMemos(selectedMember.uid);
        break;
      case "USER_MEMO_DELETE":
        await deleteMemo({ uid: selectedMember.uid, mid: payload.mid });
        setMemos((prev) => prev.filter((memo) => memo.id !== payload.mid));
        break;
      case "USER_MEMO_RESET":
        await deleteAllMemos({ uid: selectedMember.uid });
        setMemos([]);
        break;
      default:
        break;
    }
  };

  const handleConfirmMemoAction = async () => {
    if (
      !selectedMember ||
      !memoActionPayload ||
      memoActionModal.state?.phase !== "CONFIRM" ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await executeMemoAction(memoActionPayload);
      memoActionModal.openDone(memoActionPayload.type);
    } catch (error) {
      setErrors(getCommonErrorState(error));
      handleCloseMemoActionModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMemo = (mid: number) => {
    if (!selectedMember || isSubmitting) return;

    openMemoActionModal("USER_MEMO_DELETE", {
      type: "USER_MEMO_DELETE",
      mid,
    });
  };

  const handleDeleteAllMemos = () => {
    if (!selectedMember || isSubmitting) return;

    openMemoActionModal("USER_MEMO_RESET", {
      type: "USER_MEMO_RESET",
    });
  };

  const handleOpenAddModal = () => {
    setMemoInput("");
    setMemoModalStep("ADD");
  };

  const handleAddMemo = () => {
    if (!selectedMember || isSubmitting) return;

    const content = memoInput.trim();

    if (content.length === 0 || content.length > MEMO_MAX_LENGTH) return;

    openMemoActionModal("USER_MEMO_ADD", {
      type: "USER_MEMO_ADD",
      content,
    });
  };

  const handleCloseDemeritActionModal = () => {
    demeritActionModal.close();
    setDemeritActionPayload(null);
  };

  const handleCloseDemeritModal = () => {
    handleCloseDemeritActionModal();
    setIsDemeritModalOpen(false);
    setDemeritModalStep("MAIN");
    setSelectedDemeritReason(DEMERIT_REASON_PLACEHOLDER);
    setSelectedDemeritScore(DEMERIT_SCORE_PLACEHOLDER);
    setDemerits([]);
    setSelectedMember(null);
  };

  const openDemeritActionModal = (
    action: DemeritActionType,
    payload: DemeritActionPayload,
  ) => {
    setDemeritActionPayload(payload);
    demeritActionModal.openConfirm(action);
  };

  const handleOpenDemeritModal = (member: AdminGroupRow) => {
    setSelectedMember({
      uid: member.id,
      name: member.name,
      course: member.course,
      part: member.part,
      penaltyPoint: member.penaltyPoint,
    });
    handleCloseDemeritActionModal();
    setMemoModalStep("LIST");
    setIsMemoModalOpen(false);
    setIsGenerationModalOpen(false);
    setIsPartModalOpen(false);
    setSelectedGeneration("");
    setSelectedPartCode(null);
    setSelectedDemeritReason(DEMERIT_REASON_PLACEHOLDER);
    setSelectedDemeritScore(DEMERIT_SCORE_PLACEHOLDER);
    setDemeritModalStep("MAIN");
    setDemerits([]);
    setIsDemeritModalOpen(true);
  };

  const handleOpenDemeritHistory = async () => {
    if (!selectedMember || isSubmitting) return;

    setDemeritModalStep("LIST");
    await fetchDemerits(selectedMember.uid);
  };

  const handleAssignDemerit = () => {
    if (
      !selectedMember ||
      selectedDemeritReason === DEMERIT_REASON_PLACEHOLDER ||
      selectedDemeritScore === DEMERIT_SCORE_PLACEHOLDER ||
      isSubmitting
    ) {
      return;
    }

    const reason = DEMERIT_REASON_CODE_BY_LABEL.get(selectedDemeritReason);
    const demerit = DEMERIT_SCORE_VALUE_BY_LABEL.get(selectedDemeritScore);
    if (!reason || demerit === undefined) return;

    openDemeritActionModal("USER_DEMERIT_ASSIGN", {
      type: "USER_DEMERIT_ASSIGN",
      reason,
      demerit,
    });
  };

  const handleResetDemerits = () => {
    if (!selectedMember || isSubmitting) return;

    openDemeritActionModal("USER_DEMERIT_RESET", {
      type: "USER_DEMERIT_RESET",
    });
  };

  const handleDeleteDemerit = (did: number) => {
    if (!selectedMember || isSubmitting) return;
    if (!Number.isFinite(did) || did <= 0) {
      setErrors({
        status: "500",
        message: "벌점 항목 ID를 찾을 수 없어요. 목록을 다시 열어주세요.",
      });
      return;
    }

    openDemeritActionModal("USER_DEMERIT_REVOKE", {
      type: "USER_DEMERIT_REVOKE",
      did: Number(did),
    });
  };

  const executeDemeritAction = async (payload: DemeritActionPayload) => {
    if (!selectedMember) return;

    switch (payload.type) {
      case "USER_DEMERIT_ASSIGN":
        await addDemerit({
          uid: selectedMember.uid,
          reason: payload.reason,
          demerit: payload.demerit,
        });
        break;
      case "USER_DEMERIT_RESET":
        await deleteAllDemerits({ uid: selectedMember.uid });
        break;
      case "USER_DEMERIT_REVOKE":
        await deleteDemerit({
          uid: selectedMember.uid,
          did: Number(payload.did),
        });
        break;
      default:
        break;
    }

    await fetchDemerits(selectedMember.uid);
    onRefresh();
  };

  const handleConfirmDemeritAction = async () => {
    if (
      !selectedMember ||
      !demeritActionPayload ||
      demeritActionModal.state?.phase !== "CONFIRM" ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await executeDemeritAction(demeritActionPayload);
      if (demeritActionPayload.type === "USER_DEMERIT_ASSIGN") {
        setSelectedDemeritReason(DEMERIT_REASON_PLACEHOLDER);
        setSelectedDemeritScore(DEMERIT_SCORE_PLACEHOLDER);
      }
      demeritActionModal.openDone(demeritActionPayload.type);
    } catch (error) {
      setErrors(getCommonErrorState(error));
      handleCloseDemeritActionModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMemoModal = async (member: AdminGroupRow) => {
    setSelectedMember({
      uid: member.id,
      name: member.name,
      course: member.course,
      part: member.part,
      penaltyPoint: member.penaltyPoint,
    });
    memoActionModal.close();
    setMemoModalStep("LIST");
    setIsMemoModalOpen(true);
    setIsGenerationModalOpen(false);
    setIsPartModalOpen(false);
    setIsDemeritModalOpen(false);
    setDemeritModalStep("MAIN");
    setSelectedDemeritReason(DEMERIT_REASON_PLACEHOLDER);
    setSelectedDemeritScore(DEMERIT_SCORE_PLACEHOLDER);
    handleCloseDemeritActionModal();
    setMemoInput("");
    setSelectedGeneration("");
    setSelectedPartCode(null);
    await fetchMemos(member.id);
  };

  const handleOpenGenerationModal = (member: AdminGroupRow) => {
    setSelectedMember({
      uid: member.id,
      name: member.name,
      course: member.course,
      part: member.part,
      penaltyPoint: member.penaltyPoint,
    });
    generationActionModal.close();
    setSelectedGeneration("");
    setIsMemoModalOpen(false);
    setIsPartModalOpen(false);
    setIsDemeritModalOpen(false);
    setDemeritModalStep("MAIN");
    setSelectedDemeritReason(DEMERIT_REASON_PLACEHOLDER);
    setSelectedDemeritScore(DEMERIT_SCORE_PLACEHOLDER);
    handleCloseDemeritActionModal();
    setIsGenerationModalOpen(true);
  };

  const handleCloseGenerationModal = () => {
    generationActionModal.close();
    setIsGenerationModalOpen(false);
    setSelectedMember(null);
    setSelectedGeneration("");
    setIsDemeritModalOpen(false);
    setDemeritModalStep("MAIN");
    setSelectedDemeritReason(DEMERIT_REASON_PLACEHOLDER);
    setSelectedDemeritScore(DEMERIT_SCORE_PLACEHOLDER);
    handleCloseDemeritActionModal();
  };

  const handleOpenGenerationActionModal = () => {
    if (!selectedMember || selectedGeneration.length === 0 || isSubmitting) {
      return;
    }

    generationActionModal.openConfirm("USER_GENERATION_CHANGE");
  };

  const handleConfirmGenerationAction = async () => {
    if (
      !selectedMember ||
      generationActionModal.state?.phase !== "CONFIRM" ||
      selectedGeneration.length === 0 ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await changeGeneration({
        uid: selectedMember.uid,
        course: Number(selectedGeneration),
      });
      onRefresh();
      generationActionModal.openDone("USER_GENERATION_CHANGE");
      setSelectedMember((prev) =>
        prev ? { ...prev, course: Number(selectedGeneration) } : prev,
      );
    } catch (error) {
      setErrors(getCommonErrorState(error));
      generationActionModal.close();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseGenerationActionModal = () => {
    if (generationActionModal.state?.phase === "DONE") {
      handleCloseGenerationModal();
      return;
    }

    generationActionModal.close();
  };

  const handleOpenPartModal = (member: AdminGroupRow) => {
    setSelectedMember({
      uid: member.id,
      name: member.name,
      course: member.course,
      part: member.part,
      penaltyPoint: member.penaltyPoint,
    });
    partActionModal.close();
    setSelectedPartCode(null);
    setIsMemoModalOpen(false);
    setIsGenerationModalOpen(false);
    setIsDemeritModalOpen(false);
    setDemeritModalStep("MAIN");
    setSelectedDemeritReason(DEMERIT_REASON_PLACEHOLDER);
    setSelectedDemeritScore(DEMERIT_SCORE_PLACEHOLDER);
    handleCloseDemeritActionModal();
    setIsPartModalOpen(true);
  };

  const handleClosePartModal = () => {
    partActionModal.close();
    setIsPartModalOpen(false);
    setSelectedMember(null);
    setSelectedPartCode(null);
    setIsDemeritModalOpen(false);
    setDemeritModalStep("MAIN");
    setSelectedDemeritReason(DEMERIT_REASON_PLACEHOLDER);
    setSelectedDemeritScore(DEMERIT_SCORE_PLACEHOLDER);
    handleCloseDemeritActionModal();
  };

  const handleSelectPart = (value: string) => {
    setSelectedPartCode(PART_VALUE_BY_LABEL.get(value) ?? null);
  };

  const handleOpenPartActionModal = () => {
    if (!selectedMember || !selectedPartCode || isSubmitting) {
      return;
    }

    partActionModal.openConfirm("USER_PART_CHANGE");
  };

  const handleConfirmPartAction = async () => {
    if (
      !selectedMember ||
      partActionModal.state?.phase !== "CONFIRM" ||
      !selectedPartCode ||
      isSubmitting
    ) {
      return;
    }

    const nextPartCode = selectedPartCode;
    setIsSubmitting(true);
    try {
      await changePart({
        uid: selectedMember.uid,
        part: nextPartCode,
      });
      onRefresh();
      partActionModal.openDone("USER_PART_CHANGE");
      const nextPartLabel = PART_LABEL_BY_VALUE.get(nextPartCode);
      setSelectedMember((prev) => {
        if (!prev) return prev;

        return nextPartLabel ? { ...prev, part: nextPartLabel } : prev;
      });
    } catch (error) {
      setErrors(getCommonErrorState(error));
      partActionModal.close();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePartActionModal = () => {
    if (partActionModal.state?.phase === "DONE") {
      handleClosePartModal();
      return;
    }

    partActionModal.close();
  };

  return (
    <div className="rounded-ec-10 w-full overflow-hidden">
      {isDemeritModalOpen && selectedMember && (
        <DemeritModal
          step={demeritModalStep}
          currentPoint={selectedMember.penaltyPoint}
          demerits={demerits}
          reasonOptions={DEMERIT_REASON_OPTIONS}
          scoreOptions={DEMERIT_SCORE_OPTIONS}
          selectedReason={selectedDemeritReason}
          selectedScore={selectedDemeritScore}
          canAssign={
            selectedDemeritReason !== DEMERIT_REASON_PLACEHOLDER &&
            selectedDemeritScore !== DEMERIT_SCORE_PLACEHOLDER
          }
          isLoading={isDemeritLoading}
          isSubmitting={isSubmitting}
          onClose={handleCloseDemeritModal}
          onBack={() => setDemeritModalStep("MAIN")}
          onOpenHistory={handleOpenDemeritHistory}
          onReset={handleResetDemerits}
          onAssign={handleAssignDemerit}
          onDeleteDemerit={handleDeleteDemerit}
          onSelectReason={setSelectedDemeritReason}
          onSelectScore={setSelectedDemeritScore}
        />
      )}

      {isMemoModalOpen && selectedMember && (
        <MemoModal
          target={selectedMember}
          step={memoModalStep}
          memos={memos}
          value={memoInput}
          maxLength={MEMO_MAX_LENGTH}
          isLoading={isMemoLoading}
          isSubmitting={isSubmitting}
          onClose={handleCloseMemoModal}
          onOpenAdd={handleOpenAddModal}
          onDeleteMemo={handleDeleteMemo}
          onDeleteAllMemos={handleDeleteAllMemos}
          onBack={() => setMemoModalStep("LIST")}
          onChange={setMemoInput}
          onSubmit={handleAddMemo}
        />
      )}

      {isGenerationModalOpen && selectedMember && (
        <GenerationModal
          currentGeneration={selectedMember.course}
          options={GENERATION_OPTION_LABELS}
          selectedGeneration={selectedGeneration}
          isSubmitting={isSubmitting}
          onClose={handleCloseGenerationModal}
          onSelectGeneration={(value) => {
            setSelectedGeneration(GENERATION_VALUE_BY_LABEL.get(value) ?? "");
          }}
          onSubmit={handleOpenGenerationActionModal}
        />
      )}

      {isPartModalOpen && selectedMember && (
        <PartModal
          currentPart={selectedMember.part}
          options={PART_OPTION_LABELS}
          selectedPartCode={selectedPartCode ?? ""}
          isSubmitting={isSubmitting}
          onClose={handleClosePartModal}
          onSelectPart={handleSelectPart}
          onSubmit={handleOpenPartActionModal}
        />
      )}

      {partActionModal.state && (
        <GroupActionStepModal
          modalState={partActionModal.state}
          onClose={handleClosePartActionModal}
          onNext={handleConfirmPartAction}
          isSubmitting={isSubmitting}
        />
      )}

      {generationActionModal.state && (
        <GroupActionStepModal
          modalState={generationActionModal.state}
          onClose={handleCloseGenerationActionModal}
          onNext={handleConfirmGenerationAction}
          isSubmitting={isSubmitting}
        />
      )}

      {memoActionModal.state && (
        <GroupActionStepModal
          modalState={memoActionModal.state}
          onClose={handleCloseMemoActionModal}
          onNext={handleConfirmMemoAction}
          isSubmitting={isSubmitting}
        />
      )}

      {demeritActionModal.state && (
        <GroupActionStepModal
          modalState={demeritActionModal.state}
          onClose={handleCloseDemeritActionModal}
          onNext={handleConfirmDemeritAction}
          isSubmitting={isSubmitting}
        />
      )}

      {errors && (
        <ErrorModal
          status={errors.status}
          message={errors.message}
          onClick={() => setErrors(null)}
        />
      )}

      {isLoading && (
        <div
          className={`grid w-full animate-pulse items-center gap-3 px-6 py-5 ${GROUP_TABLE_COLUMNS}`}
        >
          <SkeletonCell className="h-4 w-8" />
          <SkeletonCell className="h-4 w-16" />
          <SkeletonCell className="h-4 w-12" />
          <SkeletonCell className="h-4 w-46" />
          <SkeletonCell className="h-4 w-46" />
          <SkeletonCell className="h-4 w-8 justify-self-center" />
          <SkeletonCell className="h-4 w-full" />
        </div>
      )}

      {members.map((member, index) => (
        <div
          key={`${member.id}-${member.email}`}
          className={`text-body-2 grid w-full items-center gap-3 px-6 py-5 ${GROUP_TABLE_COLUMNS} ${
            index % 2 === 1 ? "bg-ec-box" : "bg-ec-white"
          }`}
        >
          <span className="min-w-0">{member.course}기</span>
          <span className="min-w-0 truncate" title={member.part}>
            {member.part}
          </span>
          <span className="min-w-0 truncate" title={member.name}>
            {truncateKoreanName(member.name)}
          </span>
          <span
            className="block max-w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
            title={member.email}
          >
            {member.email}
          </span>
          <span className="min-w-0 truncate">{member.joinedAt}</span>
          <span className="min-w-0 text-center">{member.penaltyPoint}점</span>
          <div className="flex w-full min-w-0 flex-nowrap items-center justify-center gap-3">
            <GroupIcon
              label="메모"
              type="memo"
              onClick={() => handleOpenMemoModal(member)}
            />
            <GroupIcon
              label="파트 변경"
              type="change"
              onClick={() => handleOpenPartModal(member)}
            />
            <GroupIcon
              label="기수 변경"
              type="change"
              onClick={() => handleOpenGenerationModal(member)}
            />
            <GroupIcon
              label="벌점"
              type="demerit"
              onClick={() => handleOpenDemeritModal(member)}
            />
            {member.useable ? (
              <GroupIcon
                label="정지"
                type="stop"
                onClick={() => onOpenModal("USER_SUSPEND", member.id)}
              />
            ) : (
              <GroupIcon
                label="복구"
                type="restore"
                onClick={() => onOpenModal("USER_REACTIVE", member.id)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupTableRows;
