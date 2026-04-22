import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAVORITES_KEY } from '../utils/storage';

export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  addedAt: string;
  category: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Bookmark[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    if (stored) setFavorites(JSON.parse(stored));
  };

  const saveFavorites = async (newFavs: Bookmark[]) => {
    setFavorites(newFavs);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
  };

  const addFavorite = (bookmark: Bookmark) => {
    if (favorites.some(f => f.id === bookmark.id)) return;
    saveFavorites([bookmark, ...favorites]);
  };

  const removeFavorite = (id: string) => {
    saveFavorites(favorites.filter(f => f.id !== id));
  };

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}