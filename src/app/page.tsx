'use client';

import { useEffect, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults(undefined);
      const res = await fetch(
        `https://fastapi.shahjabir.workers.dev/api/search?q=${input}`
      );
      const data = (await res.json()) as {
        results: string[];
        duration: number;
      };
      setSearchResults(data);
    };
    fetchData();
  }, [input]);

  return (
    <main className="grainy h-screen w-screen">
      <div className="animate flex flex-col items-center gap-6 pt-32 duration-500 animate-in fade-in-5 slide-in-from-bottom-2.5">
        <h1 className="text-5xl font-bold tracking-tight">SpeedSearch ⚡</h1>
        <p className="max-w-prose text-center text-lg text-zinc-600">
          A high-performance API built with Hono, Next.js and Cloudflare. <br />{' '}
          Type a query below and get your results in miliseconds.
        </p>

        <div className="w-full max-w-md">
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search countries..."
              className="placeholder:text-zinc-500"
            />
            <CommandList>
              {searchResults?.results.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : null}

              {searchResults?.results ? (
                <CommandGroup heading="Results">
                  {searchResults?.results.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}
                    >
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {searchResults?.results ? (
                <>
                  <div className="h-px w-full bg-zinc-200" />

                  <p className="p-2 text-xs text-zinc-500">
                    Found {searchResults.results.length} results in{' '}
                    {searchResults?.duration.toFixed(0)}ms
                  </p>
                </>
              ) : null}
            </CommandList>
          </Command>
        </div>
      </div>
    </main>
  );
}
