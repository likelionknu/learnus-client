interface AssignmentInfoProps {
  label: string;
  value: string;
  valueClassName?: string;
}

export function AssignmentInfo({
  label,
  value,
  valueClassName,
}: AssignmentInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-ec-table-topic min-w-8.75 text-[12px]">{label}</div>

      <div
        className={`line-clamp-1 text-[12px] ${
          valueClassName ?? "text-ec-sub"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
