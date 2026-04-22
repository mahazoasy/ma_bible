import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBible } from '../../hooks/useBible';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BooksScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const { books } = useBible();

  const sections = [
    { title: t('old_testament'), data: books.filter(b => b.testament === 'ancien') },
    { title: t('new_testament'), data: books.filter(b => b.testament === 'nouveau') },
  ];

  const renderBook = ({ item }: any) => (
    <TouchableOpacity style={styles.bookItem} onPress={() => router.push(`/read/${item.nom}/1`)}>
      <Text style={styles.bookName}>{item.nom}</Text>
      <Text style={styles.bookAbbrev}>{item.abrev}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.nom}
        renderItem={renderBook}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef9ef', paddingHorizontal: 16, paddingTop: 12 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#5a3e2e', marginVertical: 12, fontFamily: 'Georgia' },
  bookItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#e0cfbf' },
  bookName: { fontSize: 18, color: '#3e2a21' },
  bookAbbrev: { fontSize: 14, color: '#9b7a62' },
});