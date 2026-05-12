import { SkeletonCell } from "@/shared/components/skeleton";
import { formatKoreanDateTime12 } from "@/shared/utils";
import type { SessionFile } from "../types";

interface FilesTableRowsProps {
  files: SessionFile[];
  isLoading: boolean;
  onRowClick?: (file: SessionFile) => void;
}

function FilesTableRow({ files, isLoading, onRowClick }: FilesTableRowsProps) {
  return (
    <div className="flex w-243 flex-col">
      {isLoading &&
        Array.from({ length: 3 }, (_, index) => (
          <div
            className="grid animate-pulse items-center rounded-2xl px-8 py-4"
            style={{ gridTemplateColumns: "50px minmax(0,1fr) 200px 120px" }}
            key={index}
          >
            <SkeletonCell className="mx-auto h-4 w-7" />
            <SkeletonCell className="h-4 w-121" />
            <SkeletonCell className="mx-auto h-4 w-46" />
            <SkeletonCell className="mx-auto h-4 w-20" />
          </div>
        ))}
      {files.map((file, index) => (
        <div
          key={`${file.id}-${file.createdBy}-${index}`}
          onClick={() => onRowClick?.(file)}
          className={`cursor-pointer px-8 py-4 ${index % 2 === 1 ? "bg-ec-box" : ""}`}
        >
          <div
            className="grid w-full items-center"
            style={{ gridTemplateColumns: "50px minmax(0,1fr) 200px 120px" }}
          >
            <span className="text-body-2 text-center">{file.id}</span>

            <span className="text-body-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {file.name}
            </span>
            <span className="text-body-2 text-center whitespace-nowrap">
              {formatKoreanDateTime12(file.createdAt)}
            </span>
            <span className="text-body-2 text-center">{file.createdBy}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FilesTableRow;
