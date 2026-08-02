"use client";

import React, { useState, useEffect, useRef } from "react";
import kotaData from "@/lib/data/kota.json";

interface CityComboboxProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function CityCombobox({ value, onChange, error }: CityComboboxProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    
    // Only filter if query doesn't match the selected value to avoid showing dropdown on selection
    if (query !== value && isOpen) {
      const filtered = (kotaData as string[])
        .filter(city => city.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 20); // limit to 20 results for performance
      setResults(filtered);
    }
  }, [query, isOpen, value]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        className={`w-full bg-canvas border rounded-md px-4 py-2 text-ink outline-none transition-colors ${
          error ? "border-danger focus:border-danger" : "border-hairline focus:border-accent"
        }`}
        placeholder="Ketik nama kota/kabupaten..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(""); // Clear actual value until a selection is made
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      
      {isOpen && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-card border border-hairline rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((city, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-canvas cursor-pointer text-ink text-body-sm transition-colors"
                  onClick={() => {
                    setQuery(city);
                    onChange(city);
                    setIsOpen(false);
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-body-sm text-muted">Kota tidak ditemukan</div>
          )}
        </div>
      )}
    </div>
  );
}
