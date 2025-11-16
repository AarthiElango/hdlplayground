import React, { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  onSearch?: (val: string) => void;
  className?: string;
  debounce?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value = "",
  placeholder = "Search…",
  onChange,
  onSearch,
  className = "",
  debounce = 0,
}) => {
  const [input, setInput] = useState<string>(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    if (!onChange) return;
    if (!debounce) {
      onChange(input);
      return;
    }
    const t = setTimeout(() => onChange(input), debounce);
    return () => clearTimeout(t);
  }, [input, onChange, debounce]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch?.(input.trim());
  };

  const handleClear = () => {
    setInput("");
    onChange?.("");
  };

  const handleSearchClick = () => {
    onSearch?.(input.trim());
  };

  return (
    <div className={`relative w-full ${className}`} role="search">
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pr-10 pl-3 text-sm bg-card border-border focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Search"
      />

      {/* Clear button (X) */}
      {input.length > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* Search icon button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
        onClick={handleSearchClick}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchInput;