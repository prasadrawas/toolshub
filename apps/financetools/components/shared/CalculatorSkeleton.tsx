export function CalculatorSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        <div className="p-6 space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
        <div className="p-6 bg-gray-50/50 space-y-4">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-28 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
