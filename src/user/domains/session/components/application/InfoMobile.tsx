interface InfoItemProps {
  label: string;
  value: string;
}

export function InfoMobile({ label, value }: InfoItemProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="text-ec-table-topic min-w-8.75 text-[12px]">{label}</div>
      <div className="text-ec-sub line-clamp-1 text-[12px]">{value}</div>
    </div>
  );
}
