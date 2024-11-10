'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState<string>();
  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();

  useEffect(() => {
    const fecthData = async () => {
      if (!input) {
        setSearchResults(undefined);
      }
      const res = await fetch(`/api/search?q=${input}`);
      const data = await res.json();
      console.log(data);
    };
    fecthData();
  }, [input]);

  console.log(searchResults);

  return (
    <>
      <div>
        <h1>Fast API</h1>
        <input
          type="text"
          className="text-zinc-900"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </>
  );
}
