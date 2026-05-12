interface TextBoxProps {
  children: React.ReactNode;
  px?: boolean;
  py?: boolean;
}

function TextBox({ children, px = true, py = true }: TextBoxProps) {
  return (
    <div
      className={`font-pretendard tracking-ec-normal bg-ec-box text-ec-black rounded-ec-10 text-[14px]/[23px] font-medium whitespace-pre-wrap ${
        px ? "px-7" : ""
      } ${py ? "py-4" : ""}`}
    >
      {children}
    </div>
  );
}

export default TextBox;
