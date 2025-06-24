"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  defaultValue?: string
}

export function SearchBar({ placeholder = "Search...", onSearch, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSearch?.(query)
    },
    [query, onSearch],
  )

  const clearSearch = useCallback(() => {
    setQuery("")
  }, [])

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10 h-12"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  )
}
