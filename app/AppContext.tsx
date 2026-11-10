'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, Translation } from './i18n';
import { ThemeItem, CardItem, DeckItem, initialThemes, initialCards, initialDecks } from './store';

export interface UserProfile {
  name: string;
  username: string;
  avatar: string; // URL path (/uploads/avatars/...) or emoji
  bio: string;
  favoriteVibe: string;
  totalCardsDrawn: number;
  totalSessionsPlayed: number;
  dayStreak: number;
  joinedDate: string;
}

export interface GameSettings {
  soundEffects: boolean;
  hapticFeedback: boolean;
  timerSeconds: number; // 0 = unlimited, 30, 60, 90
  adultContentFilter: boolean;
  reducedMotion: boolean;
  themeAccent: 'pink' | 'purple' | 'emerald' | 'amber';
  keepHistory: boolean;
}

export const defaultProfile: UserProfile = {
  name: 'Bintang Nongkee',
  username: 'bintang_talks',
  avatar: '',
  bio: 'Suka obrolan deep talk jam 2 pagi dan ketawa lepas bareng teman.',
  favoriteVibe: 'Romantic & Deep Talk',
  totalCardsDrawn: 42,
  totalSessionsPlayed: 8,
  dayStreak: 4,
  joinedDate: 'November 2026',
};

export const defaultSettings: GameSettings = {
  soundEffects: true,
  hapticFeedback: true,
  timerSeconds: 0,
  adultContentFilter: true,
  reducedMotion: false,
  themeAccent: 'pink',
  keepHistory: true,
};

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translation;
  themes: ThemeItem[];
  cards: CardItem[];
  decks: DeckItem[];
  addCard: (card: Omit<CardItem, 'id'>) => Promise<CardItem>;
  deleteCard: (id: string) => Promise<void>;
  updateCard: (card: CardItem) => Promise<void>;
  addDeck: (deck: DeckItem) => Promise<DeckItem>;
  deleteDeck: (id: string) => Promise<void>;
  updateDeck: (deck: DeckItem) => Promise<void>;
  addTheme: (theme: ThemeItem) => void;
  deleteTheme: (slug: string) => void;
  // Auth State
  isLoggedIn: boolean;
  userEmail: string;
  login: (userData: { email: string; name?: string; username?: string; avatar?: string }) => void;
  logout: () => void;
  // Profile & Settings
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  uploadAvatarPhoto: (file: File) => Promise<{ success: boolean; avatarUrl?: string; error?: string }>;
  settings: GameSettings;
  updateSettings: (updates: Partial<GameSettings>) => void;
  favoriteCardIds: string[];
  toggleFavoriteCard: (id: string) => void;
  resetAllData: () => void;
  // Theme Mode (Dark / Light)
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
  toggleThemeMode: () => void;
  isMounted: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [lang, setLangState] = useState<Language>('id');
  const [themeMode, setThemeModeState] = useState<'dark' | 'light'>('dark');
  const [themes, setThemes] = useState<ThemeItem[]>(initialThemes);
  const [cards, setCards] = useState<CardItem[]>(initialCards);
  const [decks, setDecks] = useState<DeckItem[]>(initialDecks);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [favoriteCardIds, setFavoriteCardIds] = useState<string[]>(['lov-02', 'fri-04']);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);

    // Check login state
    let savedLoggedIn = localStorage.getItem('kartu_logged_in') === 'true';
    let savedEmail = localStorage.getItem('kartu_user_email') || '';

    // Check OAuth return params from Google callback
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auth_success') === '1') {
        const paramEmail = urlParams.get('email') || '';
        const paramName = urlParams.get('name') || '';
        const paramAvatar = urlParams.get('avatar') || '';
        if (paramEmail) {
          savedLoggedIn = true;
          savedEmail = paramEmail;
          localStorage.setItem('kartu_logged_in', 'true');
          localStorage.setItem('kartu_user_email', paramEmail);
          updateProfile({
            name: paramName || paramEmail.split('@')[0],
            avatar: paramAvatar || '',
          });
        }
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    setIsLoggedIn(savedLoggedIn);
    setUserEmail(savedEmail);

    // 0. Theme Mode
    const savedMode = localStorage.getItem('kartu_theme_mode') as 'dark' | 'light';
    if (savedMode === 'light' || savedMode === 'dark') {
      setThemeModeState(savedMode);
      if (typeof document !== 'undefined') {
        if (savedMode === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
        }
      }
    }

    // 1. Language
    const savedLang = localStorage.getItem('kartu_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
      setLangState(savedLang);
    }

    // 2. Cards & Themes
    const DELETED_THEMES = new Set(['horror', 'mending-mana', 'event-midnight', 'event-party']);
    const savedCards = localStorage.getItem('kartu_cards');
    if (savedCards) {
      try {
        const parsed = (JSON.parse(savedCards) as CardItem[]).filter(c => !DELETED_THEMES.has(c.themeSlug));
        // Sinkronkan kartu kids terbaru agar 15+ pertanyaan baru langsung aktif
        const nonKids = parsed.filter(c => c.themeSlug !== 'kids');
        const kidsFromInitial = initialCards.filter(c => c.themeSlug === 'kids');
        const existingIds = new Set(nonKids.map((c: any) => c.id));
        const missing = initialCards.filter(c => c.themeSlug !== 'kids' && !existingIds.has(c.id));
        const finalCards = [...nonKids, ...missing, ...kidsFromInitial];
        setCards(finalCards);
        localStorage.setItem('kartu_cards', JSON.stringify(finalCards));
      } catch(e){}
    }
    const savedThemes = localStorage.getItem('kartu_themes');
    if (savedThemes) {
      try {
        const parsed = (JSON.parse(savedThemes) as ThemeItem[]).filter(th => !DELETED_THEMES.has(th.slug));
        const updatedParsed = parsed.map(th => {
          const init = initialThemes.find(i => i.slug === th.slug);
          if (init) {
            return {
              ...th,
              titleEn: init.titleEn,
              subtitleEn: init.subtitleEn,
              titleId: init.titleId,
              subtitleId: init.subtitleId,
              editionLabel: init.editionLabel,
            };
          }
          return th;
        });
        const existingSlugs = new Set(updatedParsed.map((th: any) => th.slug));
        const missing = initialThemes.filter(th => !existingSlugs.has(th.slug));
        const finalThemes = [...updatedParsed, ...missing];
        setThemes(finalThemes);
        localStorage.setItem('kartu_themes', JSON.stringify(finalThemes));
      } catch(e){}
    }

    // 3. Profile dari LocalStorage
    const savedProfile = localStorage.getItem('kartu_profile');
    if (savedProfile) {
      try {
        setProfile({ ...defaultProfile, ...JSON.parse(savedProfile) });
      } catch(e){}
    }

    // 4. Sinkronkan Profile langsung dari Database Server
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile((prev) => ({ ...prev, ...data.profile }));
          localStorage.setItem('kartu_profile', JSON.stringify(data.profile));
        }
      })
      .catch(() => {});

    // 4b. Sinkronkan Kartu & Kustom Langsung dari Database Server
    fetch('/api/cards')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.cards) && data.cards.length > 0) {
          setCards((prev) => {
            const dbIds = new Set(data.cards.map((c: any) => c.id));
            const merged = [...data.cards, ...prev.filter((c) => !dbIds.has(c.id))];
            localStorage.setItem('kartu_cards', JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch(() => {});

    // 4c. Sinkronkan Decks / Koleksi dari LocalStorage & Database Server
    const savedDecks = localStorage.getItem('kartu_decks');
    if (savedDecks) {
      try {
        setDecks(JSON.parse(savedDecks));
      } catch(e){}
    }

    fetch('/api/decks')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.decks) && data.decks.length > 0) {
          setDecks((prev) => {
            const dbIds = new Set(data.decks.map((d: any) => d.id));
            const merged = [...data.decks, ...prev.filter((d) => !dbIds.has(d.id))];
            localStorage.setItem('kartu_decks', JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch(() => {});

    // 5. Settings
    const savedSettings = localStorage.getItem('kartu_settings');
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch(e){}
    }

    // 6. Favorites
    const savedFavorites = localStorage.getItem('kartu_favorites');
    if (savedFavorites) {
      try {
        setFavoriteCardIds(JSON.parse(savedFavorites));
      } catch(e){}
    }
  }, []);

  const setThemeMode = (mode: 'dark' | 'light') => {
    setThemeModeState(mode);
    localStorage.setItem('kartu_theme_mode', mode);
    if (typeof document !== 'undefined') {
      if (mode === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }
  };

  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('kartu_lang', l);
  };

  const addCard = async (card: Omit<CardItem, 'id'>): Promise<CardItem> => {
    const newCard: CardItem = { ...card, id: 'card-' + Date.now() };
    const updated = [newCard, ...cards];
    setCards(updated);
    localStorage.setItem('kartu_cards', JSON.stringify(updated));

    // Sinkronkan ke PostgreSQL / Server Database
    try {
      await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });
    } catch (e) {
      console.warn('Gagal sinkron kartu ke database:', e);
    }
    return newCard;
  };

  const deleteCard = async (id: string): Promise<void> => {
    const updated = cards.filter(c => c.id !== id);
    setCards(updated);
    localStorage.setItem('kartu_cards', JSON.stringify(updated));

    // Sinkronkan hapus ke database
    try {
      await fetch(`/api/cards?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Gagal menghapus kartu dari database:', e);
    }
  };

  const updateCard = async (card: CardItem): Promise<void> => {
    const updated = cards.map(c => c.id === card.id ? card : c);
    setCards(updated);
    localStorage.setItem('kartu_cards', JSON.stringify(updated));

    // Sinkronkan pembaruan ke database
    try {
      await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card),
      });
    } catch (e) {
      console.warn('Gagal mengupdate kartu di database:', e);
    }
  };

  const addTheme = (theme: ThemeItem) => {
    const updated = [...themes, theme];
    setThemes(updated);
    localStorage.setItem('kartu_themes', JSON.stringify(updated));
  };

  const deleteTheme = (slug: string) => {
    const updated = themes.filter(th => th.slug !== slug);
    setThemes(updated);
    localStorage.setItem('kartu_themes', JSON.stringify(updated));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    localStorage.setItem('kartu_profile', JSON.stringify(newProfile));

    // Sinkronisasi otomatis ke Database Server
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfile),
    }).catch((err) => console.error('Gagal sinkron profil ke DB:', err));
  };

  const uploadAvatarPhoto = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.avatarUrl) {
        updateProfile({ avatar: data.avatarUrl });
        return { success: true, avatarUrl: data.avatarUrl };
      } else {
        return { success: false, error: data.error || 'Gagal mengunggah foto' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Terjadi kesalahan jaringan' };
    }
  };

  const updateSettings = (updates: Partial<GameSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('kartu_settings', JSON.stringify(newSettings));
  };

  const toggleFavoriteCard = (id: string) => {
    const updated = favoriteCardIds.includes(id)
      ? favoriteCardIds.filter(fId => fId !== id)
      : [...favoriteCardIds, id];
    setFavoriteCardIds(updated);
    localStorage.setItem('kartu_favorites', JSON.stringify(updated));
  };

  const resetAllData = () => {
    localStorage.removeItem('kartu_cards');
    localStorage.removeItem('kartu_themes');
    localStorage.removeItem('kartu_profile');
    localStorage.removeItem('kartu_settings');
    localStorage.removeItem('kartu_favorites');
    localStorage.removeItem('kartu_theme_mode');
    setCards(initialCards);
    setThemes(initialThemes);
    setProfile(defaultProfile);
    setSettings(defaultSettings);
    setFavoriteCardIds(['lov-02', 'fri-04']);
    setThemeMode('dark');

    // Reset di database juga
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultProfile),
    }).catch(() => {});
  };

  const t = translations[lang];

  const addDeck = async (deck: DeckItem): Promise<DeckItem> => {
    const updated = [deck, ...decks.filter((d) => d.id !== deck.id)];
    setDecks(updated);
    localStorage.setItem('kartu_decks', JSON.stringify(updated));
    return deck;
  };

  const updateDeck = async (deck: DeckItem): Promise<void> => {
    const updated = decks.map((d) => (d.id === deck.id ? deck : d));
    setDecks(updated);
    localStorage.setItem('kartu_decks', JSON.stringify(updated));
  };

  const deleteDeck = async (id: string): Promise<void> => {
    const updated = decks.filter((d) => d.id !== id);
    setDecks(updated);
    localStorage.setItem('kartu_decks', JSON.stringify(updated));
    try {
      await fetch(`/api/decks?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  const login = (userData: { email: string; name?: string; username?: string; avatar?: string }) => {
    setIsLoggedIn(true);
    setUserEmail(userData.email);
    localStorage.setItem('kartu_logged_in', 'true');
    localStorage.setItem('kartu_user_email', userData.email);

    const newName =
      userData.name && userData.name.trim()
        ? userData.name.trim()
        : profile.name && profile.name !== defaultProfile.name
        ? profile.name
        : userData.email.split('@')[0];
    const newUsername =
      userData.username ||
      newName.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30);

    const profileUpdates: Partial<UserProfile> = {
      name: newName,
      username: newUsername,
    };
    if (userData.avatar) {
      profileUpdates.avatar = userData.avatar;
    }

    updateProfile(profileUpdates);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('kartu_logged_in');
    localStorage.removeItem('kartu_user_email');
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        themes,
        cards,
        decks,
        addDeck,
        updateDeck,
        deleteDeck,
        addCard,
        deleteCard,
        updateCard,
        addTheme,
        deleteTheme,
        isLoggedIn,
        userEmail,
        login,
        logout,
        profile,
        updateProfile,
        uploadAvatarPhoto,
        settings,
        updateSettings,
        favoriteCardIds,
        toggleFavoriteCard,
        resetAllData,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        isMounted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
