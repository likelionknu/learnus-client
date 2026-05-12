interface SessionActivateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
}

function ToggleIcon({ selected }: { selected: boolean }) {
  return (
    <svg
      className="h-4.5 w-7.5"
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="28"
        height="16"
        rx="8"
        stroke="currentColor"
        strokeWidth="4"
      />
      <circle cx={selected ? 22 : 10} cy="10" r="4" fill="currentColor" />
    </svg>
  );
}

function SessionActivateButton({
  selected,
  className = "",
  ...props
}: SessionActivateButtonProps) {
  const selectedClassName = selected
    ? "bg-ec-blue text-ec-white border-2 "
    : "bg-ec-box text-ec-blue border-2 border-transparent";

  return (
    <button
      type="button"
      className={`rounded-ec-10 flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 font-semibold transition-colors ${selectedClassName} ${className}`}
      {...props}
    >
      <ToggleIcon selected={selected} />
      <span className="text-body-2">활성화</span>
    </button>
  );
}

export default SessionActivateButton;
