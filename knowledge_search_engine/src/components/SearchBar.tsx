export default function SearchBar() {
  return (
    <div className="relative w-full max-w-md mx-auto mt-5">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="搜索"
      />
    </div>
  );
}
