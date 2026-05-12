import type { ButtonSize, ButtonVariant } from "@/shared/types";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  isLoading?: boolean;
}

const VariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-ec-black",
  danger: "bg-ec-red",
};

const TypeClaseese: Record<ButtonSize, string> = {
  modal: "py-1.5 text-[12px]",
  primary: "px-4.25 py-2.25 text-[14px]",
  large: "px-6 py-2.5 xl:text-[15px] text-[14px]",
};

const Loading = () => {
  return (
    <div className="absolute inset-0 inline-flex items-center justify-center">
      <span
        className="border-ec-white h-4.5 w-4.5 animate-[spin_1.6s_linear_infinite] rounded-full border-[3px] border-t-transparent"
        aria-hidden="true"
      />
    </div>
  );
};

function Button({
  children,
  size,
  variant = "primary",
  isLoading,
  ...props
}: ButtonProps) {
  const baseClass =
    "min-w-13.25 min-h-6.5 tracking-ec-tight relative inline-flex items-center justify-center leading-120 font-medium rounded-ec-10 text-ec-white cursor-pointer";
  const combinedClass = `${baseClass} ${VariantClasses[variant]} ${TypeClaseese[size]}`;

  return (
    <button
      type="button"
      className={combinedClass}
      aria-busy={isLoading}
      {...props}
    >
      <span className={isLoading ? "invisible" : ""}>{children}</span>
      {isLoading ? <Loading /> : null}
    </button>
  );
}

export default Button;
