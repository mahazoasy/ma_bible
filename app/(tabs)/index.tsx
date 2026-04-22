import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../hooks/useFavorites';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LAST_POSITION_KEY } from '../../utils/storage';

export default function HomeScreen() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const { favorites } = useFavorites();
  const [lastPosition, setLastPosition] = useState<{ book: string; chapter: number } | null>(null);

  useEffect(() => {
    loadLastPosition();
  }, []);

  const loadLastPosition = async () => {
    const pos = await AsyncStorage.getItem(LAST_POSITION_KEY);
    if (pos) {
      try {
        setLastPosition(JSON.parse(pos));
      } catch (e) {}
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📖 Ma Bible</Text>
      </View>

      <TouchableOpacity style={styles.verseCard} onPress={() => router.push('/search')}>
        <Text style={styles.verseText}>“Heureux les débonnaires, car ils hériteront la terre!”</Text>
        <Text style={styles.verseRef}>Matthieu 5:5</Text>
      </TouchableOpacity>

      {lastPosition && (
        <TouchableOpacity
          style={styles.resumeCard}
          onPress={() => router.push(`/read/${lastPosition.book}/${lastPosition.chapter}`)}
        >
          <Text style={styles.resumeTitle}>{t('resume_reading')}</Text>
          <Text style={styles.resumeRef}>{lastPosition.book} {lastPosition.chapter}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{favorites.length}</Text>
          <Text style={styles.statLabel}>{t('favorites_count')}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>-</Text>
          <Text style={styles.statLabel}>{t('reading_days')}</Text>
        </View>
      </View>

      <View style={styles.langRow}>
        <TouchableOpacity
          style={[styles.langButton, language === 'fr' && styles.langActive]}
          onPress={() => setLanguage('fr')}
        >
          <Text style={styles.langText}>Français</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langButton, language === 'mg' && styles.langActive]}
          onPress={() => setLanguage('mg')}
        >
          <Text style={styles.langText}>Malagasy</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.quickButton} onPress={() => router.push('/books')}>
        <Text style={styles.quickButtonText}>{t('all_books')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef9ef', padding: 20 },
  header: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 28, fontFamily: 'Georgia', color: '#4a2e24', fontWeight: '600' },
  verseCard: { backgroundColor: '#fff5e6', padding: 16, borderRadius: 16, marginBottom: 20, elevation: 2 },
  verseText: { fontSize: 18, fontFamily: 'Georgia', color: '#3e2a21', lineHeight: 26 },
  verseRef: { marginTop: 8, fontSize: 14, color: '#8b694c', textAlign: 'right' },
  resumeCard: { backgroundColor: '#e8ddce', padding: 16, borderRadius: 16, marginBottom: 24 },
  resumeTitle: { fontSize: 16, fontWeight: '600', color: '#5a3e2e' },
  resumeRef: { fontSize: 18, fontFamily: 'Georgia', color: '#2b1b12', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  statBox: { alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, width: '40%' },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#6b4c3b' },
  statLabel: { fontSize: 14, color: '#7a5a48' },
  langRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 16, gap: 12 },
  langButton: { padding: 8, borderRadius: 8, width: 100, alignItems: 'center', backgroundColor: '#ddd' },
  langActive: { backgroundColor: '#6b4c3b' },
  langText: { color: '#fff', fontWeight: '500' },
  quickButton: { backgroundColor: '#6b4c3b', padding: 14, borderRadius: 30, alignItems: 'center' },
  quickButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});