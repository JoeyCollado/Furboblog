"use client";
import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export function SearchInput() {
  // connect input to server function
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false); //for dropdown

  const results = useQuery(
    api.posts.searchPosts,
    term.length >= 2 ? { limit: 5, term: term } : "skip"
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
    setOpen(true); //set to true when search input is open
  }

  return (
    <div className="relative w-full max-w-sm z-10">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Posts..."
          className="w-full pl-8 bg-background"
          value={term}
          onChange={handleInputChange}
        />
      </div>
      {open &&
        term.length >= 2 && ( //when user types
          <div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
            {" "}
            {/* render absolute relative to the main container */}
            {/* showcase loading state */}
            {results === undefined ? ( //if results is undefined means data is still being fetched hence render a loading state
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Searching...
              </div>
            ) : results.length === 0 ? ( //if results is equal to 0 characters
              <p className="p-4 text-sm text-muted-foreground text-center">
                No results found!
              </p>
            ) : (
              //if successful
              <div className="py-1">
                {results.map((post) => (
                  <Link
                    className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    href={`/blog/${post._id}`}
                    key={post._id}
                    onClick={() => {
                      setOpen(false)
                      setTerm("");
                    }}
                  >
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground pt-1">
                      {post.body.substring(0, 60)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
