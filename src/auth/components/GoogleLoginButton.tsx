import GoogleIcon from "@auth/assets/googleicon.svg";

interface GoogleLoginButtonProps {
  className: string;
  labelClassName?: string;
  disabled?: boolean;
  loadingLabel?: string;
  onClick: () => void;
}

function GoogleLoginButton({
  className,
  labelClassName,
  disabled = false,
  loadingLabel = "Google로 이동 중...",
  onClick,
}: GoogleLoginButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${className} ${disabled ? "cursor-wait opacity-60" : ""}`}
    >
      <img
        src={GoogleIcon}
        alt=""
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
      />
      <span className={labelClassName}>
        {disabled ? loadingLabel : "구글 계정으로 시작하기"}
      </span>
    </button>
  );
}

export default GoogleLoginButton;
