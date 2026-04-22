import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import bibleFr from '../assets/bible_fr.json';
import bibleMg from '../assets/bible_mg.json';

interface BibleBook {
  nom: string;
  abrev: string;
  testament: 'ancien' | 'nouveau';
  chapitres: { numero: number; versets: { numero: number; texte: string }[] }[];
}

// Déclarer le type attendu pour les fichiers JSON
interface BibleData {
  livres: BibleBook[];
}

export function useBible() {
  const { language } = useLanguage();
  const [books, setBooks] = useState<BibleBook[]>([]);

  useEffect(() => {
    // Forcer le typage avec "as BibleData"
    const bibleData = (language === 'fr' ? bibleFr : bibleMg) as BibleData;
    if (bibleData && Array.isArray(bibleData.livres)) {
      setBooks(bibleData.livres);
    } else {
      console.error('Structure invalide pour la Bible', bibleData);
      setBooks([]);
    }
  }, [language]);

  // Le reste des fonctions est identique
  const getChapter = (bookName: string, chapterNum: number) => {
    const book = books.find(b => b.nom === bookName);
    return book?.chapitres.find(c => c.numero === chapterNum);
  };

  const getBookInfo = (bookName: string) => books.find(b => b.nom === bookName);

  const getNextChapter = (bookName: string, currentChapter: number) => {
    const bookIdx = books.findIndex(b => b.nom === bookName);
    if (bookIdx === -1) return null;
    const book = books[bookIdx];
    const nextChap = book.chapitres.find(c => c.numero === currentChapter + 1);
    if (nextChap) return { book: book.nom, chapter: currentChapter + 1 };
    if (bookIdx + 1 < books.length) {
      const nextBook = books[bookIdx + 1];
      return { book: nextBook.nom, chapter: nextBook.chapitres[0]?.numero || 1 };
    }
    return null;
  };

  const getPrevChapter = (bookName: string, currentChapter: number) => {
    const bookIdx = books.findIndex(b => b.nom === bookName);
    if (bookIdx === -1) return null;
    if (currentChapter > 1) return { book: bookName, chapter: currentChapter - 1 };
    if (bookIdx - 1 >= 0) {
      const prevBook = books[bookIdx - 1];
      const lastChap = prevBook.chapitres[prevBook.chapitres.length - 1];
      return { book: prevBook.nom, chapter: lastChap.numero };
    }
    return null;
  };

  const searchBible = (query: string, testamentFilter: 'all' | 'ancien' | 'nouveau') => {
    const lowerQuery = query.toLowerCase();
    const results: any[] = [];
    for (const book of books) {
      if (testamentFilter !== 'all' && book.testament !== testamentFilter) continue;
      for (const chap of book.chapitres) {
        for (const verse of chap.versets) {
          if (verse.texte.toLowerCase().includes(lowerQuery)) {
            results.push({
              book: book.nom,
              chapter: chap.numero,
              verse: verse.numero,
              text: verse.texte,
            });
          }
        }
      }
    }
    return results;
  };

  return { books, getChapter, getBookInfo, getNextChapter, getPrevChapter, searchBible };
}