export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200/20 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200/20 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200/20 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="h-12 bg-gray-200/20 rounded"></div>
            <div className="h-12 bg-gray-200/20 rounded"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-gray-200/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}