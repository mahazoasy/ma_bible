import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SettingsProvider } from '../contexts/SettingsContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useLanguage } from '../contexts/LanguageContext';

// Composant interne pour les titres traduits
function TabsLayout() {
  const { t } = useLanguage();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';
          if (route.name === 'index') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'books') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'favorites') iconName = focused ? 'heart' : 'heart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6b4c3b',
        tabBarInactiveTintColor: '#a08c7a',
        headerStyle: { backgroundColor: '#f5f0e8' },
        headerTitleStyle: { fontFamily: 'Georgia', color: '#3e2a21' },
      })}
    >
      <Tabs.Screen name="index" options={{ title: t('home') }} />
      <Tabs.Screen name="books" options={{ title: t('books') }} />
      <Tabs.Screen name="search" options={{ title: t('search') }} />
      <Tabs.Screen name="favorites" options={{ title: t('favorites') }} />
    </Tabs>
  );
}

export default function Layout() {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <TabsLayout />
      </LanguageProvider>
    </SettingsProvider>
  );
}