import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookmarkState {
  bookmarkedQids: string[];
  setBookmarks: (qids: string[]) => void;
  addBookmark: (qid: string) => void;
  removeBookmark: (qid: string) => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      bookmarkedQids: [],
      
      setBookmarks: (qids) => set({ bookmarkedQids: qids }),
      
      addBookmark: (qid) => set((state) => ({
        bookmarkedQids: state.bookmarkedQids.includes(qid)
          ? state.bookmarkedQids
          : [...state.bookmarkedQids, qid]
      })),
      
      removeBookmark: (qid) => set((state) => ({
        bookmarkedQids: state.bookmarkedQids.filter((id) => id !== qid)
      })),
    }),
    {
      name: 'bookmark-storage',
    }
  )
);