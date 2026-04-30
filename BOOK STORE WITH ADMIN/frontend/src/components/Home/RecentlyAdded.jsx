import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const RecentlyAdded = () => {
  const [Data, setData] = useState([]); // ← empty array better hai null se

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-recent-books",
        );
        setData(response.data.data); // ← Data state mein save karo
        console.log(response.data);
      } catch (error) {
        console.log(error); // ← Error handle karo
      }
    };
    fetchBooks();
  }, []);
  return (
  <div className="mt-5 px-4">
    <div>
      <h4 className="text-3xl text-yellow-100">Recently added books</h4>
      {!Data && <div className="flex items-center justify-center my-8"> <Loader/></div>}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">

        {Data && Data.map((items, i) => (
          <div key={i}>
            <BookCard data={items} />
          </div>
        ))}
      </div>
    </div>
  </div>
);
}
export default RecentlyAdded;
