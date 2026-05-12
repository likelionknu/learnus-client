import { type FormEvent, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import CalendarIconImg from "@admin/domains/session/assets/calendar.png";
import { createSessionAssignment, getCreateSessionAssignmentErrorMessage } from "@admin/domains/session/api";
import { Button, Input } from "@/shared/components";

const NOTICE_MESSAGE =
  "과제 등록 시 세션에 추가된 모든 사용자가 과제 대상으로 포함돼요";
const TITLE_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 700;
const FIELD_INPUT_CLASS =
  "h-12.5 px-8 py-0 text-sm leading-6 placeholder:text-sm";

interface AssignmentUploadFormState {
  dueDate: string;
  title: string;
  description: string;
}

const INITIAL_FORM_STATE: AssignmentUploadFormState = {
  dueDate: "",
  title: "",
  description: "",
};

interface AssignmentUploadLocationState {
  sid?: number | string;
  sessionId?: number | string;
}

function parseSessionId(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 ? value : null;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);

    return Number.isInteger(parsedValue) && parsedValue > 0
      ? parsedValue
      : null;
  }

  return null;
}

function toIsoDateTime(value: string) {
  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
}

interface AssignmentUploadFieldProps {
  label: string;
  remainingCount?: number;
  children: React.ReactNode;
}

function AssignmentUploadField({
  label,
  remainingCount,
  children,
}: AssignmentUploadFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-ec-black text-base font-medium">{label}</span>
        {typeof remainingCount === "number" && (
          <span className="text-caption text-ec-sub">
            {remainingCount}자 남음
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function AssignmentUploadForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sid } = useParams();
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const locationState = location.state as AssignmentUploadLocationState | null;
  const sessionId =
    parseSessionId(sid) ??
    parseSessionId(locationState?.sid) ??
    parseSessionId(locationState?.sessionId);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!sessionId) {
      setErrorMessage(
        "세션 정보가 없어 과제를 등록할 수 없어요. sid를 확인해주세요.",
      );
      return;
    }

    if (!form.dueDate) {
      setErrorMessage("과제 종료일을 선택해주세요.");
      return;
    }

    const title = form.title.trim();
    const description = form.description.trim();
    const endAt = toIsoDateTime(form.dueDate);

    if (!endAt) {
      setErrorMessage("올바른 과제 종료일을 입력해주세요.");
      return;
    }

    if (!title) {
      setErrorMessage("과제 명을 입력해주세요.");
      return;
    }

    if (!description) {
      setErrorMessage("과제 설명을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createSessionAssignment({
        sid: sessionId,
        sessionId,
        endAt,
        name: title,
        content: description,
      });

      setForm(INITIAL_FORM_STATE);
      navigate(`/admin/sessions/${sessionId}/assignments`);
    } catch (error) {
      setErrorMessage(getCreateSessionAssignmentErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex w-full flex-col items-end gap-5"
      onSubmit={handleSubmit}
    >
      <div className="border-ec-blue rounded-ec-10 bg-ec-white text-body-2 text-ec-blue self-stretch border px-7 py-4.5">
        {NOTICE_MESSAGE}
      </div>

      <div
        className={`self-stretch text-sm ${
          sessionId ? "text-ec-sub" : "text-ec-red"
        }`}
      >
        {sessionId
          ? `세션 ID ${sessionId}에 과제를 등록해요.`
          : "세션 정보(sid)가 없어 과제를 등록할 수 없어요."}
      </div>

      <AssignmentUploadField label="과제 종료일 설정">
        <div className="relative">
          <Input
            type="datetime-local"
            step="60"
            aria-label="과제 종료일"
            value={form.dueDate}
            onChange={(e) => {
              setErrorMessage("");
              setForm((prev) => ({ ...prev, dueDate: e.target.value }));
            }}
            className={`${FIELD_INPUT_CLASS} pr-12`}
          />
          <div className="pointer-events-none absolute top-1/2 right-8 -translate-y-1/2">
            <img src={CalendarIconImg} alt="" className="h-3 w-3" />
          </div>
        </div>
      </AssignmentUploadField>

      <AssignmentUploadField
        label="과제 명"
        remainingCount={TITLE_MAX_LENGTH - form.title.length}
      >
        <Input
          maxLength={TITLE_MAX_LENGTH}
          placeholder="과제 명을 입력하세요"
          value={form.title}
          onChange={(e) => {
            setErrorMessage("");
            setForm((prev) => ({ ...prev, title: e.target.value }));
          }}
          className={FIELD_INPUT_CLASS}
        />
      </AssignmentUploadField>

      <AssignmentUploadField
        label="과제 설명"
        remainingCount={DESCRIPTION_MAX_LENGTH - form.description.length}
      >
        <textarea
          maxLength={DESCRIPTION_MAX_LENGTH}
          placeholder="과제 설명을 입력하세요"
          value={form.description}
          onChange={(e) => {
            setErrorMessage("");
            setForm((prev) => ({ ...prev, description: e.target.value }));
          }}
          className="bg-ec-box rounded-ec-10 text-ec-black placeholder:text-ec-sub h-55.5 w-full resize-none px-8 py-3 text-sm leading-6 outline-none placeholder:text-sm"
        />
      </AssignmentUploadField>

      {errorMessage && (
        <div className="text-ec-red self-stretch text-sm">{errorMessage}</div>
      )}

      <div className="self-end">
        <Button
          size="large"
          type="submit"
          disabled={!sessionId || isSubmitting}
          isLoading={isSubmitting}
        >
          등록
        </Button>
      </div>
    </form>
  );
}

export default AssignmentUploadForm;
