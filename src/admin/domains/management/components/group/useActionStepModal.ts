import { useState } from "react";
import type { ConfirmDoneModalPhase } from "@/shared/types";

export type ActionStepModalState<TAction extends string> = {
  action: TAction;
  phase: ConfirmDoneModalPhase;
} | null;

function useActionStepModal<TAction extends string>() {
  const [state, setState] = useState<ActionStepModalState<TAction>>(null);

  const openConfirm = (action: TAction) => {
    setState({ action, phase: "CONFIRM" });
  };

  const openDone = (action: TAction) => {
    setState({ action, phase: "DONE" });
  };

  const close = () => {
    setState(null);
  };

  return {
    state,
    setState,
    openConfirm,
    openDone,
    close,
  };
}

export default useActionStepModal;
