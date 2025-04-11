export default function Loading() {
  return (
    <div className="flex items-center justify-center p-18 h-screen w-full bg-slate-950 ">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <span className="ml-2 text-gray-200 text-4xl">Loading...</span>
    </div>
  );
}
