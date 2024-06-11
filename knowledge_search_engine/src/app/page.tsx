import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50">
      <main className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-7xl font-bold text-gray-900 mb-4">
          Know<span className="text-8xl font-bold text-cyan-400">U</span>
        </h1>
        <SearchBar />
      </main>
    </div>
  );
}
