"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const sort = e.target.value;
    
    if (sort === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative inline-block">
      <select 
        value={currentSort}
        onChange={handleSortChange}
        className="appearance-none bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 focus:ring-0 cursor-pointer outline-none pl-3 pr-6 z-10 relative"
      >
        <option value="relevance" style={{ background:"#10100e", color:"#f0ede6" }}>Relevance</option>
        <option value="price_asc" style={{ background:"#10100e", color:"#f0ede6" }}>Price: Low to High</option>
        <option value="price_desc" style={{ background:"#10100e", color:"#f0ede6" }}>Price: High to Low</option>
        <option value="newest" style={{ background:"#10100e", color:"#f0ede6" }}>Newest Rituals</option>
      </select>
      <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-orange-500 font-bold pointer-events-none z-0 text-[14px]">expand_more</span>
    </div>
  );
}
