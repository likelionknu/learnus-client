import { SkeletonCell } from "@/shared/components/skeleton";

function QuestionCommentSkeleton() {
  return (
    <div className="border-ec-outline flex flex-col gap-2 border-b py-2">
      <div className="font-pretendard flex animate-pulse rounded-2xl">
        <div className="flex gap-1">
          <SkeletonCell className="h-4 w-9" />
          <SkeletonCell className="h-4 w-11" />
        </div>
      </div>
      <SkeletonCell className="h-4 w-full" />
    </div>
  );
}

export default QuestionCommentSkeleton;
