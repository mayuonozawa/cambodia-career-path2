// FeaturedScholarships / FeaturedSchools の読み込み中に表示するスケルトン。
// 実カードと同じ padding / gap / grid 構成にすることで、データ到着時の
// レイアウトシフト（CLS）をなるべく起こさないようにしている。

function CardSkeleton() {
  return (
    <div className="bg-card rounded-xl border py-6 shadow-sm flex h-full flex-col animate-pulse">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-100" />
          </div>
          <div className="h-5 w-14 shrink-0 rounded-full bg-gray-100" />
        </div>
      </div>
      <div className="px-6 flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-5/6 rounded bg-gray-100" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-2/3 rounded bg-gray-100" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
        </div>
        <div className="mt-auto pt-2">
          <div className="h-9 w-full rounded-md bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedScholarshipsSkeleton() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-24 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </section>
  );
}

export function FeaturedSchoolsSkeleton() {
  return (
    <section className="bg-card px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-24 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </section>
  );
}
