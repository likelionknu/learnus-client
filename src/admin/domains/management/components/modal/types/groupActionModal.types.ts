import type { ConfirmDoneModalPhase } from "@/shared/types";

export type GroupActionType =
  | "USER_MEMO_DELETE"
  | "USER_MEMO_RESET"
  | "USER_RESUME"
  | "USER_MEMO_ADD"
  | "USER_DEMERIT_ASSIGN"
  | "USER_DEMERIT_REVOKE"
  | "USER_DEMERIT_RESET"
  | "USER_GENERATION_CHANGE"
  | "USER_PART_CHANGE"
  | "WHITELIST_ADD"
  | "WHITELIST_DELETE"
  | "USER_SUSPEND"
  | "USER_REACTIVE";

export type GroupActionModalState = {
  action: GroupActionType;
  phase: ConfirmDoneModalPhase;
} | null;

export interface GroupActionModalConfig {
  title: string;
  confirmMessage: string;
  doneMessage: string;
  confirmLabel: string;
  confirmVariant: "primary" | "danger";
}
