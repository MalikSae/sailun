"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export interface FilterConfig {
  paramName: string;
  options: { label: string; value: string }[];
}

export function SearchFilterBar({ 
  placeholder = "Cari...",
  filters = []
}: { 
  placeholder?: string;
  filters?: FilterConfig[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [, startTransition] = useTransition();
  const [term, setTerm] = useState(searchParams?.get("query")?.toString() || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentQuery = searchParams?.get("query")?.toString() || "";
      if (term !== currentQuery) {
        const params = new URLSearchParams(searchParams || undefined);
        params.set("page", "1");
        if (term) {
          params.set("query", term);
        } else {
          params.delete("query");
        }
        startTransition(() => {
          replace(`${pathname}?${params.toString()}`);
        });
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [term, pathname, replace, searchParams]);

  const handleFilterChange = (paramName: string, value: string) => {
    const params = new URLSearchParams(searchParams || undefined);
    params.set("page", "1");
    if (value && value !== "ALL") {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
      <div className="relative w-full sm:max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          placeholder={placeholder}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full bg-card border border-hairline rounded-md px-[12px] py-[10px] pl-[40px] text-[13.5px] text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-muted"
        />
      </div>
      
      {filters.length > 0 && (
        <div className="flex gap-4 flex-wrap w-full sm:w-auto">
          {filters.map((filter) => (
            <div key={filter.paramName} className="w-full sm:w-auto min-w-[140px]">
              <select
                value={searchParams?.get(filter.paramName)?.toString() || "ALL"}
                onChange={(e) => handleFilterChange(filter.paramName, e.target.value)}
                className="w-full bg-card border border-hairline rounded-md px-[12px] py-[10px] pr-[32px] text-[13.5px] text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none cursor-pointer truncate"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237E93B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 12px center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
