export type Language = 'en' | 'id';

export interface Translation {
  navMain: string;
  navThemes: string;
  navAdmin: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  startPlaying: string;
  exploreThemes: string;
  themesSectionTitle: string;
  themesSectionSubtitle: string;
  howToPlayTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  levelsTitle: string;
  levelLight: string;
  levelLightDesc: string;
  levelDeep: string;
  levelDeepDesc: string;
  levelBrave: string;
  levelBraveDesc: string;
  footerText: string;
  cardsCount: string;
  themeTitle: string;
  level: string;
  shuffle: string;
  spin: string;
  nextCard: string;
  prevCard: string;
  favorite: string;
  share: string;
  backToHome: string;
  setupTitle: string;
  selectTheme: string;
  selectLevel: string;
  playersCount: string;
  startSession: string;
  adminTitle: string;
  adminSubtitle: string;
  manageThemes: string;
  manageCards: string;
  bulkAdd: string;
  addNewCard: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  themeName: string;
  cardContent: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    navMain: "Play",
    navThemes: "Themes",
    navAdmin: "Admin CMS",
    heroBadge: "6 Tema · 300+ Kartu",
    heroTitle1: "Shuffle Cards.",
    heroTitle2: "Start Conversation.",
    heroSubtitle: "Deepen connections, spark laughter, and discover new stories with friends, couples, and family.",
    startPlaying: "Start Playing",
    exploreThemes: "Explore Themes",
    themesSectionTitle: "Choose Your Vibe",
    themesSectionSubtitle: "Curated conversation decks for every occasion and relationship.",
    howToPlayTitle: "How to Play",
    step1Title: "1. Pick a Theme",
    step1Desc: "Choose from Family, Love, Passion, Friendship, Dreams, or Gratitude.",
    step2Title: "2. Shuffle or Spin",
    step2Desc: "Let fate decide your prompt or shuffle through cards interactively.",
    step3Title: "3. Start Chatting",
    step3Desc: "Read the prompt aloud and share open, honest, and fun answers.",
    levelsTitle: "Intimacy Levels",
    levelLight: "Light & Fun",
    levelLightDesc: "Icebreakers, casual stories, and playful laughs.",
    levelDeep: "Deep & Meaningful",
    levelDeepDesc: "Vulnerability, personal reflections, and core values.",
    levelBrave: "Brave & Passionate",
    levelBraveDesc: "Bold questions, romantic sparks, and intense desires.",
    footerText: "© 2026 Kata Siapa. Built for unforgettable moments.",
    cardsCount: "Cards",
    themeTitle: "Theme",
    level: "Level",
    shuffle: "Shuffle Deck",
    spin: "Spin Wheel",
    nextCard: "Next Card",
    prevCard: "Previous Card",
    favorite: "Favorite",
    share: "Share Card",
    backToHome: "Back to Home",
    setupTitle: "Game Setup",
    selectTheme: "Select Theme",
    selectLevel: "Select Level",
    playersCount: "Players / Mode",
    startSession: "Start Game Session",
    adminTitle: "Admin Dashboard",
    adminSubtitle: "Manage themes, cards, and content seamlessly without coding.",
    manageThemes: "Themes Management",
    manageCards: "Cards CRUD",
    bulkAdd: "Bulk Add Cards",
    addNewCard: "Add New Card",
    save: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    themeName: "Theme Name",
    cardContent: "Card Prompt / Question"
  },
  id: {
    navMain: "Main",
    navThemes: "Tema",
    navAdmin: "Admin CMS",
    heroBadge: "6 Tema · 300+ Kartu",
    heroTitle1: "Kocok Kartu.",
    heroTitle2: "Mulai Obrolan.",
    heroSubtitle: "Pererat hubungan, ciptakan tawa, dan temukan cerita baru bersama teman, pasangan, dan keluarga.",
    startPlaying: "Mulai Main",
    exploreThemes: "Lihat Tema",
    themesSectionTitle: "Pilih Vibe Kamu",
    themesSectionSubtitle: "Dek kartu percakapan pilihan untuk setiap suasana dan hubungan.",
    howToPlayTitle: "Cara Bermain",
    step1Title: "1. Pilih Tema",
    step1Desc: "Pilih dari Family, Love, Passion, Friendship, Dreams, atau Gratitude.",
    step2Title: "2. Kocok atau Spin",
    step2Desc: "Biarkan takdir memilih atau telusuri kartu secara interaktif.",
    step3Title: "3. Mulai Ngobrol",
    step3Desc: "Baca pertanyaan dengan lantang dan bagikan cerita yang jujur serta seru.",
    levelsTitle: "Level Kedalaman",
    levelLight: "Ringan & Seru",
    levelLightDesc: "Pencair suasana, cerita kasual, dan tawa ceria.",
    levelDeep: "Dalam & Bermakna",
    levelDeepDesc: "Kerentanan, refleksi diri, dan nilai-nilai hidup.",
    levelBrave: "Berani & Penuh Gairah",
    levelBraveDesc: "Pertanyaan menantang, percikan romantis, dan hasrat mendalam.",
    footerText: "© 2026 Kata Siapa. Dibuat untuk momen tak terlupakan.",
    cardsCount: "Kartu",
    themeTitle: "Tema",
    level: "Level",
    shuffle: "Kocok Kartu",
    spin: "Putar Spin",
    nextCard: "Kartu Berikutnya",
    prevCard: "Kartu Sebelumnya",
    favorite: "Favorit",
    share: "Bagikan Kartu",
    backToHome: "Kembali ke Beranda",
    setupTitle: "Pengaturan Game",
    selectTheme: "Pilih Tema",
    selectLevel: "Pilih Level",
    playersCount: "Mode / Pemain",
    startSession: "Mulai Sesi Game",
    adminTitle: "Dashboard Admin",
    adminSubtitle: "Kelola tema, kartu, dan konten dengan mudah tanpa coding.",
    manageThemes: "Kelola Tema",
    manageCards: "Kelola Kartu",
    bulkAdd: "Tambah Massal",
    addNewCard: "Tambah Kartu Baru",
    save: "Simpan Perubahan",
    cancel: "Batal",
    delete: "Hapus",
    edit: "Edit",
    themeName: "Nama Tema",
    cardContent: "Pertanyaan Kartu"
  }
};
