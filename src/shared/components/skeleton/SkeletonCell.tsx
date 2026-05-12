function SkeletonCell({
  className = "",
  rounded = "rounded-sm",
}: {
  className?: string;
  rounded?: string;
}) {
  return <div className={`bg-ec-loading ${rounded} ${className}`} />;
}

export default SkeletonCell;
