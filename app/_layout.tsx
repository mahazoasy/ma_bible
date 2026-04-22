import { Slot } from 'expo-router';
import { SettingsProvider } from '../contexts/SettingsContext';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <Slot />
      </LanguageProvider>
    </SettingsProvider>
  );
}