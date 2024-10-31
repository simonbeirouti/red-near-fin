// @ts-nocheck
"use client"

import { Plus, Search, SortAsc, SortDesc } from "@repo/icons"
import { Input } from "@repo/ui/input"
import { useEffect } from "react"
import { useSearch } from "@/store/use-search"
import { ReactNode } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Button } from "@repo/ui/button"

interface FilterableItem {
  title: string
  description: string
  tags: string[]
}

interface SearchLayoutProps<T> {
  children: ReactNode
  data: T[]
  onDataFiltered: (filtered: T[]) => void
  tags?: string[]
  onAdd?: () => void
}

export function SearchLayout<T extends FilterableItem>({ 
  children, 
  data,
  onDataFiltered,
  tags = [],
  onAdd
}: SearchLayoutProps<T>) {
  const { 
    searchTerm, 
    setSearchTerm,
    sortOrder, 
    setSortOrder,
    selectedTag, 
    setSelectedTag 
  } = useSearch()

  useEffect(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(lowercasedSearch) ||
        item.description.toLowerCase().includes(lowercasedSearch) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowercasedSearch))
      );
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(item => 
        item.tags.includes(selectedTag)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    onDataFiltered(filtered);
  }, [data, searchTerm, selectedTag, sortOrder, onDataFiltered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background text-foreground"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        <div className="flex items-center gap-4 w-full">
          <Select
            value={sortOrder}
            onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
          >
            <SelectTrigger className="flex-1 bg-background text-foreground">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">
                <div className="flex items-center">
                  <SortAsc className="mr-2 h-4 w-4" />
                  Ascending
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center">
                  <SortDesc className="mr-2 h-4 w-4" />
                  Descending
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedTag || "all"}
            onValueChange={(value) =>
              setSelectedTag(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="flex-1 bg-background text-foreground">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {onAdd && (
            <Button
              onClick={onAdd}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Data
            </Button>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}