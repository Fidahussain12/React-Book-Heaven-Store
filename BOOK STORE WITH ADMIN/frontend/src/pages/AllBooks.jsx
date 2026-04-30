import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard/BookCard";
const AllBooks = () => {
  const [Data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-all-books"
        );
        console.log("API Response:", response.data);

        // Safe set karo — har format handle hoga
        const books = Array.isArray(response.data)
          ? response.data
          : response.data.books || response.data.data || [];

        setData(books);
      } catch (error) {
        console.log("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filter
  let filtered = Data.filter(
    (b) =>
      (!search ||
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.author?.toLowerCase().includes(search.toLowerCase())) &&
      (!genre || b.genre === genre)
  );

  // Sort
  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "title")
    filtered.sort((a, b) => a.title?.localeCompare(b.title));

  return (
    <div className="min-h-screen bg-zinc-900 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">All Books</h1>
        <p className="text-zinc-400 mt-1">Browse our complete collection</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by title or author..."
          className="flex-1 min-w-[200px] px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-blue-500 transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Genre Filter */}
        <select
          className="px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-blue-500"
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Mystery">Mystery</option>
          <option value="History">History</option>
          <option value="Romance">Romance</option>
          <option value="Fantasy">Fantasy</option>
        </select>

        {/* Sort */}
        <select
          className="px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-blue-500"
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-blue-500 text-xl animate-pulse">
            Loading books...
          </div>
        </div>
      )}

      {/* Books Count */}
      {!loading && (
        <p className="text-zinc-400 text-sm mb-4">
          {filtered.length} book{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* No Books Found */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
          <p className="text-5xl mb-4">📚</p>
          <p className="text-xl">No books found</p>
          <p className="text-sm mt-2">Try a different search or filter</p>
        </div>
      )}

      {/* Books Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((item, i) => (
            <BookCard key={i} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;