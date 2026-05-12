import { Modal, ErrorModal } from "@/shared/components/modal";
import { useCallback, useState, type ChangeEvent, type ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import { Button, TitleSection } from "@/shared/components";
import type { CreateConfirmErrorModalStep } from "@/shared/types";
import { BoxLayout } from "@/user/shared/components";
import { SessionQuestionWarning } from "../../components/question";
import type { CreateQuestion } from "../../types";
import { postSessionQuestions } from "../../apis";
import { getCommonErrorState, type CommonErrorState } from "@/shared/utils";
import { useNavigate, useParams } from "react-router-dom";

interface FieldProps<T extends HTMLInputElement | HTMLTextAreaElement> {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<T>) => void;
}

const BoxWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="flex justify-between">{children}</div>;
};

const InputField = ({
  placeholder,
  value,
  onChange,
}: FieldProps<HTMLInputElement>) => {
  return (
    <input
      type="text"
      maxLength={80}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-ec-table-header rounded-ec-10 w-full resize-none px-7 py-4 text-[14px] placeholder:text-[14px] xl:text-[16px] xl:placeholder:text-[16px]"
    />
  );
};

const TextAreaField = ({
  placeholder,
  value,
  onChange,
}: FieldProps<HTMLTextAreaElement>) => {
  return (
    <textarea
      placeholder={placeholder}
      maxLength={900}
      value={value}
      onChange={onChange}
      className="bg-ec-table-header rounded-ec-10 min-h-71 w-full resize-none px-7 py-4 text-[14px] placeholder:text-[14px] xl:text-[16px] xl:placeholder:text-[16px]"
    />
  );
};

const MODAL_CONFIG: Record<
  CreateConfirmErrorModalStep,
  {
    description: string;
  }
> = {
  CREATE: {
    description: "새로운 질문 게시글을 업로드할까요?",
  },
  CONFIRM: {
    description: "새로운 질문 게시글을 업로드했어요",
  },
  ERROR: {
    description: "요청을 다시 확인해주세요",
  },
};

function UserSessionQuestionCreatePage() {
  const { sid } = useParams();
  const navigate = useNavigate();
  const [createQuestion, setCreateQuestion] = useState<CreateQuestion>({
    title: "",
    content: "",
  });
  const [step, setStep] = useState<CreateConfirmErrorModalStep | null>(null);
  const [errors, setErrors] = useState<CommonErrorState | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 479 });

  // 모달 비활성화
  const handleClose = useCallback(() => {
    setStep(null);
  }, []);

  // 요청 성공 후 이동
  const handleSuccess = useCallback(() => {
    setStep(null);
    navigate(-1);
  }, [navigate]);

  const handleConfirm = async () => {
    try {
      await postSessionQuestions({
        sid: Number(sid),
        payload: createQuestion,
      });

      setStep("CONFIRM");
    } catch (error) {
      setStep(null);
      setErrors(getCommonErrorState(error));
    }
  };

  return (
    <div className="text-ec-black mx-auto flex w-full max-w-87.5 flex-col gap-5 pt-7 pb-120 md:max-w-187.5 md:px-8 lg:px-0 xl:max-w-251">
      {step && (
        <Modal>
          <Modal.Header
            onClick={step === "CREATE" ? handleClose : handleSuccess}
          >
            새 질문 등록
          </Modal.Header>
          <Modal.Description>
            {MODAL_CONFIG[step].description}
          </Modal.Description>
          <Modal.ButtonLayout>
            <Button
              size="modal"
              variant="primary"
              onClick={step === "CREATE" ? handleConfirm : handleSuccess}
            >
              확인
            </Button>
            {step === "CREATE" && (
              <Modal.Cancelled
                onClick={step === "CREATE" ? handleClose : handleSuccess}
              />
            )}
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

      <TitleSection title="새 질문 등록" />
      <SessionQuestionWarning />

      <BoxLayout>
        <BoxWrapper>
          <span className="text-body-1 text-ec-black">제목</span>
          <span className="text-caption text-ec-sub">
            {!isMobile && `${80 - createQuestion.title.length}자 남음`}
          </span>
        </BoxWrapper>
        <InputField
          placeholder="제목을 입력해주세요."
          value={createQuestion.title}
          onChange={(e) => {
            setCreateQuestion({ ...createQuestion, title: e.target.value });
          }}
        />
      </BoxLayout>

      <BoxLayout>
        <BoxWrapper>
          <span className="text-body-1 text-ec-black">질문</span>
          <span className="text-caption text-ec-sub">
            {!isMobile && `${900 - createQuestion.content.length}자 남음`}
          </span>
        </BoxWrapper>
        <TextAreaField
          placeholder="질문 내용을 입력해주세요."
          value={createQuestion.content}
          onChange={(e) => {
            setCreateQuestion({ ...createQuestion, content: e.target.value });
          }}
        />
      </BoxLayout>

      <div className="text-right">
        <Button
          size="large"
          onClick={() => {
            setStep("CREATE");
          }}
        >
          등록
        </Button>
      </div>
    </div>
  );
}

export default UserSessionQuestionCreatePage;
