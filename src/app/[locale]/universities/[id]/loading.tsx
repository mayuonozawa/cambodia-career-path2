export default function UniversityDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-4 w-16 bg-gray-200 rounded mb-6" />

      {/* Hero skeleton */}
      <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl mb-6" />

      {/* Quick info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl border border-gray-200" />
        ))}
      </div>

      {/* Description */}
      <div className="space-y-3 mb-6 p-5 bg-gray-50 rounded-xl">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>

      {/* Programs */}
      <div className="mb-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 bg-blue-50 rounded-lg border border-blue-100" />
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="h-12 w-40 bg-gray-200 rounded-xl" />
    </div>
  );
}
