import { Button } from "..";
import Modal from "./Modal";

interface ErrorModalProps {
  status: string;
  message: string;
  onClick: () => void;
}

function ErrorModal({ status, message, onClick }: ErrorModalProps) {
  return (
    <Modal>
      <Modal.Header onClick={onClick}>Error {status}</Modal.Header>
      <Modal.Description>{message}</Modal.Description>
      <Modal.ButtonLayout>
        <Button size="modal" variant="primary" onClick={onClick}>
          닫기
        </Button>
      </Modal.ButtonLayout>
    </Modal>
  );
}

export default ErrorModal;
