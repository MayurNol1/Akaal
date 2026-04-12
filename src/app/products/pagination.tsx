"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Build page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div style={{ paddingTop:"56px", display:"flex", alignItems:"center", justifyContent:"center", gap:"16px", fontSize:"10px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(160,155,135,0.45)" }}>
      <Link 
        href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"} 
        style={{ width:'48px', height:'48px', borderRadius:'50%', border:'1px solid rgba(212,169,74,0.2)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', opacity:currentPage <= 1 ? 0.2 : 1, cursor:currentPage <= 1 ? 'not-allowed' : 'pointer', pointerEvents:currentPage <= 1 ? 'none' : 'auto', color:'rgba(200,195,178,0.65)' }}
      >
        <ChevronLeft size={18} />
      </Link>
      
      <div className="flex items-center gap-3 px-4">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return <span key={`ellipsis-${index}`} style={{ padding:"0 8px", color:"rgba(160,155,135,0.4)" }}>...</span>;
          }
          return (
            <Link
              key={page}
              href={createPageURL(page)}
              style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"36px", height:"36px", borderRadius:"50%", background:currentPage === page ? "#d4a94a" : "transparent", color:currentPage === page ? "#10100e" : "rgba(160,155,135,0.6)", fontWeight:currentPage === page ? 700 : 400, transition:"all 0.2s" }}
            >
              {page}
            </Link>
          );
        })}
      </div>

      <Link 
        href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"} 
        style={{ width:'48px', height:'48px', borderRadius:'50%', border:'1px solid rgba(212,169,74,0.2)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', opacity:currentPage >= totalPages ? 0.2 : 1, cursor:currentPage >= totalPages ? 'not-allowed' : 'pointer', pointerEvents:currentPage >= totalPages ? 'none' : 'auto', color:'rgba(200,195,178,0.65)' }}
      >
        <ChevronRight size={18} />
      </Link>
    </div>
  );
}
