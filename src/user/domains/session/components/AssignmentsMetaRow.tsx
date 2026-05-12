import type React from "react";
import { SkeletonCell } from "@/shared/components/skeleton";

interface AssignmentMetaRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  skeletonWidthClassName?: string;
}

function AssignmentMetaRow({
  label,
  value,
  className,
  isLoading = false,
  skeletonWidthClassName = "w-24",
}: AssignmentMetaRowProps) {
  return (
    <div className={`flex gap-9 px-2 py-1 ${className ?? ""}`}>
      <span className="text-caption md:text-body-2 text-ec-black w-16">
        {label}
      </span>
      {isLoading ? (
        <div className="flex items-center">
          <SkeletonCell className={`h-4 ${skeletonWidthClassName}`} />
        </div>
      ) : (
        <span className="text-caption md:text-body-2 text-ec-sub line-clamp-1">
          {value}
        </span>
      )}
    </div>
  );
}

export default AssignmentMetaRow;
