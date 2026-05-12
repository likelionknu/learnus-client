interface QuestionMetaRowProps {
  label: string;
  value: string;
  className?: string;
}

function QuestionMetaRow({ label, value, className }: QuestionMetaRowProps) {
  return (
    <div className={`flex gap-9 ${className ?? ""} px-5 py-2 xl:px-0 xl:py-0`}>
      <span className="text-body-2 text-ec-black w-16">{label}</span>
      <span
        className={`text-body-2 ${value === "완료" ? "text-ec-blue" : "text-ec-sub"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default QuestionMetaRow;
