import { create } from 'zustand'

interface SearchState {
  searchTerm: string
  sortOrder: 'asc' | 'desc'
  selectedTag: string | null
  setSearchTerm: (term: string) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setSelectedTag: (tag: string | null) => void
  reset: () => void
}

export const useSearch = create<SearchState>((set) => ({
  searchTerm: '',
  sortOrder: 'asc',
  selectedTag: null,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  reset: () => set({ searchTerm: '', sortOrder: 'asc', selectedTag: null })
}))