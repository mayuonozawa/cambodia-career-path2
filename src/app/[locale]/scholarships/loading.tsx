import { CardSkeletonGrid } from "@/components/ui/CardSkeleton";

export default function ScholarshipsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="h-9 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
      <div className="h-12 bg-gray-100 rounded-lg mb-8 animate-pulse" />
      <CardSkeletonGrid count={6} />
    </div>
  );
}
