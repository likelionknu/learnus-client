interface GroupInfoProps {
  label: string;
  value: string;
}

export function GroupInfo({ label, value }: GroupInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-ec-table-topic min-w-5 text-[12px]">{label}</div>
      <div className="text-ec-sub line-clamp-1 text-[12px]">{value}</div>
    </div>
  );
}
