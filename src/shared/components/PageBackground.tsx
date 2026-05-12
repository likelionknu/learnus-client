import type { ReactNode } from "react";

type PageBackgroundProps = {
  children: ReactNode;
  variant?: "auth" | "status";
};

function PageBackground({ children, variant = "status" }: PageBackgroundProps) {
  const gradientClassName =
    variant === "auth"
      ? "from-ec-blue-item to-ec-blue-item/40 pointer-events-none absolute inset-y-0 left-0 hidden bg-linear-to-r lg:block lg:w-[62.083333%]"
      : "from-ec-blue-item to-ec-blue-item/40 pointer-events-none absolute inset-y-0 left-0 hidden bg-linear-to-r lg:block lg:w-[62.291667%]";

  const contentWrapperClassName =
    variant === "auth"
      ? "relative z-10 flex min-h-screen w-full lg:pl-[62.083333%]"
      : "relative z-10 flex min-h-screen w-full lg:pl-[62.291667%]";

  return (
    <main className="bg-ec-white relative min-h-screen overflow-x-clip">
      <div className="relative flex min-h-screen w-full">
        <div aria-hidden="true" className={gradientClassName} />
        <div className={contentWrapperClassName}>{children}</div>
      </div>
    </main>
  );
}

export default PageBackground;
