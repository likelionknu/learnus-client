interface MobileItemProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function MobileItem({
  label,
  value,
  valueClassName = "text-ec-sub",
}: MobileItemProps) {
  return (
    <div className="flex gap-2">
      <span className="text-caption text-ec-table-topic">{label}</span>
      <span className={`text-caption ${valueClassName}`}>{value}</span>
    </div>
  );
}

export default MobileItem;
