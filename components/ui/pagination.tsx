"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams?.get("page")) || 1;
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams || undefined);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    replace(createPageURL(page));
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between md:justify-end space-x-4 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 bg-card border border-hairline rounded-md disabled:opacity-50 text-ink hover:bg-hairline transition-colors flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className="text-body-sm text-ink font-medium">
        Halaman {currentPage} dari {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 bg-card border border-hairline rounded-md disabled:opacity-50 text-ink hover:bg-hairline transition-colors flex items-center justify-center"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
