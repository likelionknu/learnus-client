import type { GroupActionModalConfig, GroupActionType } from "../types";

export const MODAL_CONFIG = {
  USER_MEMO_ADD: {
    title: "사용자 메모 추가",
    confirmMessage: "해당 사용자에게 메모를 추가할까요?",
    doneMessage: "사용자 메모를 추가했어요.",
    confirmLabel: "확인",
    confirmVariant: "primary",
  },
  USER_MEMO_DELETE: {
    title: "사용자 메모 삭제",
    confirmMessage:
      "선택한 항목에 대한 메모를 삭제할까요?\n이 작업은 되돌릴 수 없어요.",
    doneMessage: "사용자 메모를 삭제했어요.",
    confirmLabel: "삭제",
    confirmVariant: "danger",
  },
  USER_MEMO_RESET: {
    title: "사용자 메모 초기화",
    confirmMessage:
      "선택한 항목에 대한 메모를 초기화할까요?\n이 작업은 되돌릴 수 없어요.",
    doneMessage: "사용자 메모를 초기화했어요.",
    confirmLabel: "삭제",
    confirmVariant: "danger",
  },
  USER_DEMERIT_ASSIGN: {
    title: "사용자 벌점 부여",
    confirmMessage: "사용자에게 벌점을 부여할까요?",
    doneMessage: "사용자에게 벌점을 부여했어요.",
    confirmLabel: "확인",
    confirmVariant: "primary",
  },
  USER_DEMERIT_REVOKE: {
    title: "사용자 벌점 부여 취소",
    confirmMessage:
      "선택한 항목에 대한 벌점 부여를 취소할까요?\n이 작업은 되돌릴 수 없어요.",
    doneMessage: "벌점 부여를 취소했어요.",
    confirmLabel: "확인",
    confirmVariant: "danger",
  },
  USER_DEMERIT_RESET: {
    title: "사용자 벌점 초기화",
    confirmMessage:
      "사용자가 받은 벌점을 모두 초기화할까요?\n이 작업은 되돌릴 수 없어요.",
    doneMessage: "사용자가 받은 벌점을 모두 초기화했어요.",
    confirmLabel: "확인",
    confirmVariant: "danger",
  },
  USER_GENERATION_CHANGE: {
    title: "사용자 기수 변경",
    confirmMessage: "사용자 기수를 변경할까요?",
    doneMessage: "사용자 기수를 변경했어요.",
    confirmLabel: "확인",
    confirmVariant: "primary",
  },
  USER_PART_CHANGE: {
    title: "사용자 파트 변경",
    confirmMessage: "사용자 파트를 변경할까요?",
    doneMessage: "사용자 파트를 변경했어요.",
    confirmLabel: "확인",
    confirmVariant: "primary",
  },
  WHITELIST_ADD: {
    title: "화이트리스트 추가",
    confirmMessage:
      "해당 사용자를 화이트리스트에 추가할까요?\n이메일 주소가 정확한지 다시 확인해주세요.",
    doneMessage: "화이트리스트를 추가했어요.",
    confirmLabel: "확인",
    confirmVariant: "primary",
  },
  WHITELIST_DELETE: {
    title: "화이트리스트 삭제",
    confirmMessage: "해당 사용자를 화이트리스트에서 삭제할까요?",
    doneMessage: "화이트리스트를 삭제했어요.",
    confirmLabel: "삭제",
    confirmVariant: "danger",
  },
  USER_SUSPEND: {
    title: "사용자 이용 정지",
    confirmMessage: "해당 사용자를 서비스에서 이용 정지 처리할까요?",
    doneMessage: "해당 사용자를 서비스에서 이용 정지 처리했어요.",
    confirmLabel: "삭제",
    confirmVariant: "danger",
  },
  USER_REACTIVE: {
    title: "사용자 이용 재개",
    confirmMessage:
      "서비스에서 이용 정지된 사용자를 다시 이용할 수 있도록\n재개 처리할까요?",
    doneMessage: "이제부터 해당 사용자가 이용할 수 있어요.",
    confirmLabel: "확인",
    confirmVariant: "primary",
  },
  USER_RESUME: {
    title: "사용자 이용 재개",
    confirmMessage:
      "서비스에서 이용 정지된 사용자를 다시 이용할 수 있도록 재개 처리할까요?",
    doneMessage: "이제부터 해당 사용자가 이용할 수 있어요.",
    confirmLabel: "확인",
    confirmVariant: "primary",
  },
} satisfies Record<GroupActionType, GroupActionModalConfig>;
