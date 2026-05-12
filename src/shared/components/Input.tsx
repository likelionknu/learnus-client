interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const BASE_INPUT_CLASS =
  "tracking-ec-normal text-body-2 text-ec-black placeholder:text-ec-sub bg-ec-box rounded-ec-10 w-full px-7 py-3 outline-none";

function Input({ type = "text", className = "", ...props }: InputProps) {
  const combinedClass = className
    ? `${BASE_INPUT_CLASS} ${className}`
    : BASE_INPUT_CLASS;

  return <input type={type} className={combinedClass} {...props} />;
}

export default Input;
