import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBible } from '../../../../hooks/useBible';
import { useFavorites } from '../../../../hooks/useFavorites';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LAST_POSITION_KEY } from '../../../../utils/storage';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function ReadScreen() {
  const { t } = useLanguage();
  const { book, chapter } = useLocalSearchParams<{ book: string; chapter: string }>();
  const router = useRouter();
  const { getChapter, getBookInfo, getNextChapter, getPrevChapter } = useBible();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [chapterData, setChapterData] = useState<any>(null);
  const [bookInfo, setBookInfo] = useState<any>(null);

  const chNum = parseInt(chapter, 10);

  useEffect(() => {
    loadChapter();
  }, [book, chapter]);

  const loadChapter = async () => {
    const data = getChapter(book, chNum);
    if (data) {
      setChapterData(data);
      setBookInfo(getBookInfo(book));
      await AsyncStorage.setItem(LAST_POSITION_KEY, JSON.stringify({ book, chapter: chNum }));
    } else {
      Alert.alert('Erreur', 'Chapitre introuvable');
    }
  };

  const toggleFavorite = (verseNum: number, verseText: string) => {
    const ref = `${book} ${chNum}:${verseNum}`;
    if (isFavorite(ref)) {
      removeFavorite(ref);
    } else {
      addFavorite({
        id: ref,
        book,
        chapter: chNum,
        verse: verseNum,
        text: verseText,
        addedAt: new Date().toISOString(),
        category: 'default',
      });
    }
  };

  const goToPrev = () => {
    const prev = getPrevChapter(book, chNum);
    if (prev) router.push(`/read/${prev.book}/${prev.chapter}`);
    else Alert.alert('Début', 'Vous êtes au premier chapitre de ce livre');
  };

  const goToNext = () => {
    const next = getNextChapter(book, chNum);
    if (next) router.push(`/read/${next.book}/${next.chapter}`);
    else Alert.alert('Fin', 'Dernier chapitre de ce livre');
  };

  if (!chapterData) return <View style={styles.loading}><Text>Chargement...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={goToPrev}><Ionicons name="chevron-back" size={28} color="#6b4c3b" /></TouchableOpacity>
        <Text style={styles.title}>{bookInfo?.nom} - {t('chapter')} {chNum}</Text>
        <TouchableOpacity onPress={goToNext}><Ionicons name="chevron-forward" size={28} color="#6b4c3b" /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.versesContainer}>
        {chapterData.versets.map((verse: any) => {
          const verseRef = `${book} ${chNum}:${verse.numero}`;
          const favorited = isFavorite(verseRef);
          return (
            <TouchableOpacity
              key={verse.numero}
              onLongPress={() => toggleFavorite(verse.numero, verse.texte)}
              style={[styles.verseRow, favorited && styles.favoritedVerse]}
            >
              <Text style={styles.verseNumber}>{verse.numero}</Text>
              <Text style={styles.verseText}>{verse.texte}</Text>
              {favorited && <Ionicons name="bookmark" size={20} color="#d4a373" />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffaf5' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f5ede4', borderBottomWidth: 1, borderColor: '#e2d4c8' },
  title: { fontSize: 18, fontFamily: 'Georgia', color: '#4a2e24', fontWeight: '500' },
  versesContainer: { padding: 16 },
  verseRow: { flexDirection: 'row', marginBottom: 18, alignItems: 'flex-start' },
  verseNumber: { width: 32, fontSize: 14, color: '#b28b6f', marginRight: 8, fontWeight: 'bold' },
  verseText: { flex: 1, fontSize: 18, fontFamily: 'Georgia', color: '#2c1e16', lineHeight: 26 },
  favoritedVerse: { backgroundColor: '#fff0e0', borderRadius: 8, padding: 8, marginHorizontal: -8 },
});