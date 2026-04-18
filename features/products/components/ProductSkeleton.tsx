export function ProductSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="bg-card rounded-[calc(var(--radius-xl))] overflow-hidden border border-border flex flex-row gap-0">
        <div className="w-36 sm:w-44 shrink-0 aspect-square shimmer" />
        <div className="flex flex-col flex-1 p-4 gap-3 justify-center">
          <div className="h-2.5 w-20 rounded-full shimmer" />
          <div className="h-4 w-3/4 rounded-full shimmer" />
          <div className="h-3 w-full rounded-full shimmer" />
          <div className="h-3 w-2/3 rounded-full shimmer" />
          <div className="flex justify-between items-center pt-1">
            <div className="h-5 w-24 rounded-full shimmer" />
            <div className="h-8 w-28 rounded-xl shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[calc(var(--radius-xl))] overflow-hidden border border-border">
      <div className="aspect-square shimmer" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-2.5 w-16 rounded-full shimmer" />
        <div className="h-4 w-full rounded-full shimmer" />
        <div className="h-4 w-3/4 rounded-full shimmer" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 w-20 rounded-full shimmer" />
          <div className="h-7 w-20 rounded-xl shimmer" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 12,
  viewMode = "grid",
}: {
  count?: number;
  viewMode?: "grid" | "list";
}) {
  return (
    <div
      className={
        viewMode === "list"
          ? "flex flex-col gap-4"
          : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}
