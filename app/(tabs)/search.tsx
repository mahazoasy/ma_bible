import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useBible } from '../../hooks/useBible';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SearchScreen() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'ancien' | 'nouveau'>('all');
  const { searchBible } = useBible();
  const router = useRouter();

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return searchBible(query, testamentFilter);
  }, [query, testamentFilter]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={t('search_placeholder')}
        value={query}
        onChangeText={setQuery}
      />
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, testamentFilter === 'all' && styles.filterActive]}
          onPress={() => setTestamentFilter('all')}
        >
          <Text style={styles.filterText}>{t('filter_all')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, testamentFilter === 'ancien' && styles.filterActive]}
          onPress={() => setTestamentFilter('ancien')}
        >
          <Text style={styles.filterText}>{t('filter_old')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, testamentFilter === 'nouveau' && styles.filterActive]}
          onPress={() => setTestamentFilter('nouveau')}
        >
          <Text style={styles.filterText}>{t('filter_new')}</Text>
        </TouchableOpacity>
      </View>
      {results.length > 0 && (
        <Text style={styles.resultCount}>{results.length} {t('results_count')}</Text>
      )}
      <FlatList
        data={results}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => router.push(`/read/${item.book}/${item.chapter}`)}
          >
            <Text style={styles.resultRef}>{item.book} {item.chapter}:{item.verse}</Text>
            <Text style={styles.resultText} numberOfLines={2}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef9ef', padding: 16 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 16, borderWidth: 0.5, borderColor: '#e2cfbc', marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#e8ddd0' },
  filterActive: { backgroundColor: '#6b4c3b' },
  filterText: { color: '#fff' },
  resultCount: { marginBottom: 8, color: '#7a5a48' },
  resultItem: { paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#e2cfbc' },
  resultRef: { fontWeight: 'bold', color: '#6b4c3b', marginBottom: 4 },
  resultText: { fontSize: 15, color: '#2c1e16' },
});