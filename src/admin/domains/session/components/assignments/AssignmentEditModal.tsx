import { type FormEvent, useEffect, useState } from "react";
import CalendarIconImg from "@admin/domains/session/assets/calendar.png";
import { Button, Input } from "@/shared/components";
import { Modal } from "@/shared/components/modal";
import { getUpdateAdminAssignmentErrorMessage, updateAdminAssignment } from "../../api";
import type { AdminAssignmentDetail } from "../../types";

const TITLE_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 700;
const FIELD_INPUT_CLASS =
  "h-12.5 px-8 py-0 text-sm leading-6 placeholder:text-sm";

interface AssignmentEditFormState {
  dueDate: string;
  title: string;
  description: string;
}

interface AssignmentEditModalProps {
  assignment: Pick<
    AdminAssignmentDetail,
    "assignmentId" | "title" | "description" | "endAt"
  >;
  onClose: () => void;
  onSuccess: (assignment: AdminAssignmentDetail) => void;
}

function toDateTimeLocalValue(value: string) {
  const parsedDate = new Date(value);

  if (!Number.isNaN(parsedDate.getTime())) {
    const timezoneOffset = parsedDate.getTimezoneOffset() * 60 * 1000;

    return new Date(parsedDate.getTime() - timezoneOffset)
      .toISOString()
      .slice(0, 16);
  }

  const matched = value.trim().match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);

  return matched ? `${matched[1]}T${matched[2]}` : "";
}

function toIsoDateTime(value: string) {
  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
}

interface AssignmentEditFieldProps {
  label: string;
  remainingCount?: number;
  children: React.ReactNode;
}

function AssignmentEditField({
  label,
  remainingCount,
  children,
}: AssignmentEditFieldProps) {
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

function AssignmentEditModal({
  assignment,
  onClose,
  onSuccess,
}: AssignmentEditModalProps) {
  const [form, setForm] = useState<AssignmentEditFormState>({
    dueDate: toDateTimeLocalValue(assignment.endAt),
    title: assignment.title,
    description: assignment.description,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setForm({
      dueDate: toDateTimeLocalValue(assignment.endAt),
      title: assignment.title,
      description: assignment.description,
    });
    setErrorMessage("");
  }, [assignment]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
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
      const updatedAssignment = await updateAdminAssignment({
        aid: assignment.assignmentId,
        endAt,
        name: title,
        description,
      });

      if (!updatedAssignment) {
        setErrorMessage("수정된 과제 정보를 불러오지 못했어요.");
        return;
      }

      onSuccess(updatedAssignment);
    } catch (error) {
      setErrorMessage(getUpdateAdminAssignmentErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal>
      <form className="flex min-w-120 flex-col gap-5" onSubmit={handleSubmit}>
        <Modal.Header onClick={isSubmitting ? undefined : onClose}>
          과제 수정
        </Modal.Header>

        <AssignmentEditField label="과제 종료일 설정">
          <div className="relative">
            <Input
              type="datetime-local"
              step="60"
              aria-label="과제 종료일 수정"
              value={form.dueDate}
              onChange={(event) => {
                setErrorMessage("");
                setForm((prev) => ({ ...prev, dueDate: event.target.value }));
              }}
              className={`${FIELD_INPUT_CLASS} pr-12`}
            />
            <div className="pointer-events-none absolute top-1/2 right-8 -translate-y-1/2">
              <img src={CalendarIconImg} alt="" className="h-3 w-3" />
            </div>
          </div>
        </AssignmentEditField>

        <AssignmentEditField
          label="과제 명"
          remainingCount={TITLE_MAX_LENGTH - form.title.length}
        >
          <Input
            maxLength={TITLE_MAX_LENGTH}
            placeholder="과제 명을 입력하세요"
            value={form.title}
            onChange={(event) => {
              setErrorMessage("");
              setForm((prev) => ({ ...prev, title: event.target.value }));
            }}
            className={FIELD_INPUT_CLASS}
          />
        </AssignmentEditField>

        <AssignmentEditField
          label="과제 설명"
          remainingCount={DESCRIPTION_MAX_LENGTH - form.description.length}
        >
          <textarea
            maxLength={DESCRIPTION_MAX_LENGTH}
            placeholder="과제 설명을 입력하세요"
            value={form.description}
            onChange={(event) => {
              setErrorMessage("");
              setForm((prev) => ({ ...prev, description: event.target.value }));
            }}
            className="bg-ec-box rounded-ec-10 text-ec-black placeholder:text-ec-sub h-48 w-full resize-none px-8 py-3 text-sm leading-6 outline-none placeholder:text-sm"
          />
        </AssignmentEditField>

        {errorMessage && (
          <div className="text-ec-red text-sm">{errorMessage}</div>
        )}

        <Modal.ButtonLayout>
          <Button size="primary" type="submit" isLoading={isSubmitting}>
            수정
          </Button>
          <Modal.Cancelled onClick={isSubmitting ? undefined : onClose} />
        </Modal.ButtonLayout>
      </form>
    </Modal>
  );
}

export default AssignmentEditModal;
