interface TableHeaderLabelProps {
  children: React.ReactNode;
  className?: string;
}

function TableHeaderLabel({ children, className }: TableHeaderLabelProps) {
  const baseClass = "text-caption text-ec-table-topic";
  const combinedClass = `${baseClass} ${className || ""}`;

  return <span className={combinedClass}>{children}</span>;
}

export default TableHeaderLabel;
