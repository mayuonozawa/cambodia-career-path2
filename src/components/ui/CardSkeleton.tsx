export function CardSkeleton() {
  return (
    <div className="p-5 bg-white border border-gray-200 rounded-xl animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded-full w-14" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
