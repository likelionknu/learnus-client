import { SkeletonCell } from "@/shared/components/skeleton";

interface QuestionMetaRowSkeletonProps {
  label: string;
}

function QuestionMetaRowSkeleton({ label }: QuestionMetaRowSkeletonProps) {
  const skeletonWidthByLabel: Record<string, string> = {
    "질문 등록일": "w-40",
    등록자: "w-15",
    "답변 등록일": "w-40",
    답변자: "w-15",
    상태: "w-11",
  };

  const skeletonWidth = skeletonWidthByLabel[label] ?? "w-15";

  return (
    <div className="flex gap-9">
      <span className="text-body-2 text-ec-black w-16">{label}</span>
      <div className="animate-pulse rounded-2xl">
        <SkeletonCell className={`h-4 ${skeletonWidth}`} />
      </div>
    </div>
  );
}

export default QuestionMetaRowSkeleton;
