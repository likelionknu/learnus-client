import CloseImg from "../../assets/close.svg?react";

interface ModalProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

function ModalHeader({ children, onClick }: ModalProps) {
  return (
    <div className="text-ec-black flex max-h-6 items-center justify-between text-[16px] font-semibold">
      {children}
      <CloseImg
        className="fill-ec-black h-3 w-3 cursor-pointer"
        onClick={onClick}
      />
    </div>
  );
}

function ModalDescription({ children }: ModalProps) {
  return (
    <div className="tracking-ec-normal text-ec-sub mt-3 text-[14px] leading-6.25 font-medium whitespace-pre-line">
      {children}
    </div>
  );
}

function ModalButtonLayout({ children }: ModalProps) {
  return (
    <div className="mt-3 flex flex-row items-center gap-5">{children}</div>
  );
}

function ModalCancelled({ onClick }: ModalProps) {
  return (
    <span
      className="text-ec-black tracking-ec-normal cursor-pointer text-[12px] leading-120 font-medium"
      onClick={onClick}
    >
      취소
    </span>
  );
}

function ModalMain({ children }: ModalProps) {
  return (
    <>
      <div className="fixed inset-0 z-90 bg-black/20 backdrop-blur-[3px]" />
      <div className="bg-ec-white rounded-ec-10 fixed top-1/2 left-1/2 z-100 min-h-46 min-w-95 -translate-x-1/2 -translate-y-1/2 px-10 py-8">
        {children}
      </div>
    </>
  );
}

const Modal = Object.assign(ModalMain, {
  Header: ModalHeader,
  Description: ModalDescription,
  ButtonLayout: ModalButtonLayout,
  Cancelled: ModalCancelled,
});

export default Modal;
