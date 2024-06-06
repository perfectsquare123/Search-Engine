import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50">
      <main className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Knowledge Search Engine
        </h1>
        <SearchBar />
      </main>
    </div>
  );
}
