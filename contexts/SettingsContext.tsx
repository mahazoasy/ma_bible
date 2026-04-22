import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SETTINGS_KEY } from '../utils/storage';

type Settings = { fontSize: number; darkMode: boolean };

const SettingsContext = createContext<{
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}>({
  settings: { fontSize: 18, darkMode: false },
  updateSettings: () => {},
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [settings, setSettings] = useState<Settings>({ fontSize: 18, darkMode: systemScheme === 'dark' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const stored = await AsyncStorage.getItem(SETTINGS_KEY);
    if (stored) setSettings(JSON.parse(stored));
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);