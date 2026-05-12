export interface ModalProps {
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onClose?: () => void;
}
