export interface CardItem {
  id: string;
  themeSlug: string;
  level: 'light' | 'deep' | 'brave';
  contentEn: string;
  contentId: string;
  number: string;
  category: string;
  isLocked?: boolean;
  passwordHash?: string;
  deckId?: string;
  deckTitle?: string;
  creatorName?: string;
  creatorUsername?: string;
}

export interface DeckItem {
  id: string;
  title: string;
  description?: string;
  themeSlug: string;
  cardCount: number;
  cardIds?: string[];
  cards?: CardItem[];
  isLocked: boolean;
  passwordHash?: string;
  createdAt: string;
  creatorName?: string;
  creatorUsername?: string;
}

export const initialDecks: DeckItem[] = [
  {
    id: 'deck-pasangan-01',
    title: 'Deep Talk & Rahasia Pasangan',
    description: 'Kumpulan pertanyaan intim dan jujur khusus untuk dibicarakan berdua dengan pasangan.',
    themeSlug: 'pasangan',
    cardCount: 6,
    cardIds: ['lov-01', 'lov-02', 'lov-03', 'lov-04', 'lov-05', 'lov-06'],
    isLocked: true,
    passwordHash: 'b7a87d72e2c93e31aff0fcab6d6c05a6c83d40cfe771ab95835d3b6dc86dbf7a', // Password default: katasiapa
    createdAt: '2026-11-01T00:00:00Z',
  },
  {
    id: 'deck-nongkee-01',
    title: 'Keseruan Nongkrong Santai',
    description: 'Cairkan suasana tongkrongan dengan topik seru, lucu, dan gak ada matinya.',
    themeSlug: 'friendship',
    cardCount: 6,
    cardIds: ['fri-01', 'fri-02', 'fri-03', 'fri-04', 'fri-05', 'fri-06'],
    isLocked: false,
    createdAt: '2026-11-02T00:00:00Z',
  },
  {
    id: 'deck-kids-01',
    title: 'Dunia Imajinasi Si Kecil',
    description: 'Momen berharga untuk mendengarkan isi hati, impian, dan imajinasi anak-anak.',
    themeSlug: 'kids',
    cardCount: 8,
    cardIds: ['kids-01', 'kids-02', 'kids-03', 'kids-04', 'kids-05', 'kids-06', 'kids-07', 'kids-08'],
    isLocked: false,
    createdAt: '2026-11-03T00:00:00Z',
  },
];

export type EditionType = 'normal' | 'casual' | 'love' | 'event' | string;

export interface ThemeItem {
  slug: string;
  titleEn: string;
  titleId: string;
  subtitleEn: string;
  subtitleId: string;
  color: string;
  gradient: string;
  iconName: string;
  emoji: string;
  edition?: EditionType;
  editionLabel?: string;
  bgImage?: string;
  tag?: string;
  isEvent?: boolean;
  eventBadge?: string;
}

export const initialThemes: ThemeItem[] = [
  // ── EDISI NORMAL / CLASSIC ──
  {
    slug: 'family',
    titleEn: 'Family',
    titleId: 'Family',
    subtitleEn: 'Family Stories',
    subtitleId: 'Cerita Keluarga',
    color: '#D9500B',
    gradient: 'from-[#D9500B] to-[#A8330A]',
    iconName: 'Home',
    emoji: '',
    edition: 'normal',
    editionLabel: 'Normal / Classic',
    bgImage: '/family_card_bg.jpg',
    tag: 'Classic',
  },
  {
    slug: 'gratitude',
    titleEn: 'Gratitude',
    titleId: 'Gratitude',
    subtitleEn: 'Grateful Hearts',
    subtitleId: 'Rasa Syukur',
    color: '#0E7BC4',
    gradient: 'from-[#0E7BC4] to-[#0B4F9C]',
    iconName: 'Star',
    emoji: '',
    edition: 'normal',
    editionLabel: 'Normal / Classic',
    bgImage: '/gratitude_card_bg.jpg',
    tag: 'Mindfulness',
  },

  // ── EDISI CASUAL ──
  {
    slug: 'friendship',
    titleEn: 'Friendship',
    titleId: 'Friendship',
    subtitleEn: 'True Friends',
    subtitleId: 'Teman Sejati',
    color: '#0B8A5F',
    gradient: 'from-[#0B8A5F] to-[#0A5E55]',
    iconName: 'Users',
    emoji: '',
    edition: 'casual',
    editionLabel: 'Casual',
    bgImage: '/friendship_card_bg.jpg',
    tag: 'Nongkrong',
  },
  {
    slug: 'dreams',
    titleEn: 'Dreams',
    titleId: 'Dreams',
    subtitleEn: 'Hopes & Wishes',
    subtitleId: 'Mimpi & Harapan',
    color: '#6D5AE6',
    gradient: 'from-[#6D5AE6] to-[#35258F]',
    iconName: 'Sun',
    emoji: '',
    edition: 'casual',
    editionLabel: 'Casual',
    bgImage: '/dreams_card_bg.jpg',
    tag: 'Chill & Vibe',
  },

  // ── EDISI LOVE ──
  {
    slug: 'love',
    titleEn: 'Love',
    titleId: 'Love',
    subtitleEn: 'Love Stories',
    subtitleId: 'Cerita Cinta',
    color: '#D63B78',
    gradient: 'from-[#D63B78] to-[#9E1F5A]',
    iconName: 'Heart',
    emoji: '',
    edition: 'love',
    editionLabel: 'Love',
    bgImage: '/love_card_bg.jpg',
    tag: 'Romance',
  },
  {
    slug: 'passion',
    titleEn: 'Passion',
    titleId: 'Passion',
    subtitleEn: 'Fire & Drive',
    subtitleId: 'Api Semangat',
    color: '#C8102E',
    gradient: 'from-[#C8102E] to-[#6E0A1E]',
    iconName: 'Flame',
    emoji: '',
    edition: 'love',
    editionLabel: 'Love',
    bgImage: '/passion_card_bg.jpg',
    tag: 'Deep Chemistry',
  },

  // ── EDISI DUNIA SI KECIL (KIDS & PARENT BONDING) ──
  {
    slug: 'kids',
    titleEn: 'Kids',
    titleId: 'Kids',
    subtitleEn: 'Fun Talks for Little Ones',
    subtitleId: 'Ngobrol Seru Bareng Anak',
    color: '#2DD4C4',
    gradient: 'from-[#2DD4C4] to-[#0E9AA7]',
    iconName: 'Baby',
    emoji: '',
    edition: 'kids',
    editionLabel: 'Kids & Family',
    tag: 'Parent-Child Bonding',
    eventBadge: 'Kids Special',
  },

  // ── EDISI PERTANYAAN KUSTOM ──
  {
    slug: 'custom',
    titleEn: 'Custom',
    titleId: 'Custom',
    subtitleEn: 'Make Your Own Deck',
    subtitleId: 'Buat Dekmu Sendiri',
    color: '#FFC83D',
    gradient: 'from-[#FFC83D] to-[#E8870E]',
    iconName: 'PenSquare',
    emoji: '',
    edition: 'custom',
    editionLabel: 'Custom',
    tag: 'Custom Cards',
    eventBadge: 'Custom',
  },
];

export const initialCards: CardItem[] = [
  // 1. Family (Cerita Keluarga)
  {
    id: 'fam-01',
    themeSlug: 'family',
    level: 'light',
    number: '01',
    category: 'Kenangan',
    contentEn: 'What childhood memory with your family do you miss the most?',
    contentId: 'Kenangan masa kecil bersama keluarga apa yang paling kamu rindukan?'
  },
  {
    id: 'fam-02',
    themeSlug: 'family',
    level: 'deep',
    number: '02',
    category: 'Nasihat',
    contentEn: 'What parental advice did you ignore before, that now feels completely true?',
    contentId: 'Nasihat orang tua apa yang dulu kamu sepelekan, tapi sekarang baru terasa sangat benar?'
  },
  {
    id: 'fam-03',
    themeSlug: 'family',
    level: 'light',
    number: '03',
    category: 'Tradisi',
    contentEn: 'What family habit or tradition would you love to keep for your future children?',
    contentId: 'Tradisi atau kebiasaan keluarga apa yang ingin tetap kamu jaga sampai nanti?'
  },
  {
    id: 'fam-04',
    themeSlug: 'family',
    level: 'deep',
    number: '04',
    category: 'Kebanggaan',
    contentEn: 'When was the last time you felt truly proud to be a part of this family?',
    contentId: 'Kapan momen terakhir kali kamu ngerasa paling bangga jadi bagian dari keluarga ini?'
  },
  {
    id: 'fam-05',
    themeSlug: 'family',
    level: 'brave',
    number: '05',
    category: 'Kejujuran',
    contentEn: 'What is something you always wanted to say to your parents, but felt too awkward?',
    contentId: 'Hal apa yang paling ingin kamu ucapkan ke orang tua tapi selalu terasa canggung?'
  },

  // 2. Love (Cerita Cinta & Pasangan)
  {
    id: 'lov-01',
    themeSlug: 'love',
    level: 'light',
    number: '01',
    category: 'Apresiasi',
    contentEn: 'When was the last time you felt truly loved?',
    contentId: 'Kapan terakhir kali kamu merasa benar-benar dicintai?'
  },
  {
    id: 'lov-02',
    themeSlug: 'love',
    level: 'light',
    number: '02',
    category: 'Pertama Kali',
    contentEn: 'When did you first realize you were falling in love with your partner?',
    contentId: 'Momen apa yang pertama kali bikin kamu sadar kalau kamu jatuh cinta sama dia?'
  },
  {
    id: 'lov-03',
    themeSlug: 'love',
    level: 'deep',
    number: '03',
    category: 'Keamanan',
    contentEn: 'What small gesture from your partner makes you feel most cherished and safe?',
    contentId: 'Tindakan kecil apa dari pasangan yang paling bikin kamu ngerasa dihargai dan aman?'
  },
  {
    id: 'lov-04',
    themeSlug: 'love',
    level: 'brave',
    number: '04',
    category: 'Komitmen',
    contentEn: 'What is your biggest unspoken fear regarding relationship and the future?',
    contentId: 'Apa ketakutan terbesar kamu tentang komitmen masa depan yang jarang kamu ceritakan?'
  },
  {
    id: 'lov-05',
    themeSlug: 'love',
    level: 'light',
    number: '05',
    category: 'Impian',
    contentEn: 'If budget was unlimited, where is the dream vacation destination for just the two of you?',
    contentId: 'Kalau kita punya liburan impian tanpa batas budget, tempat mana yang ingin kamu tuju berdua?'
  },

  // 3. Passion (Api Semangat & Karier)
  {
    id: 'pas-01',
    themeSlug: 'passion',
    level: 'light',
    number: '01',
    category: 'Api Semangat',
    contentEn: 'What is something that makes you lose track of time when doing it?',
    contentId: 'Apa yang bisa membuatmu lupa waktu saat kamu melakukannya?'
  },
  {
    id: 'pas-02',
    themeSlug: 'passion',
    level: 'light',
    number: '02',
    category: 'Karya',
    contentEn: 'What craft or project could you work on for hours without feeling drained?',
    contentId: 'Pekerjaan atau karya apa yang rela kamu kerjakan berjam-jam tanpa merasa lelah?'
  },
  {
    id: 'pas-03',
    themeSlug: 'passion',
    level: 'brave',
    number: '03',
    category: 'Ambisi',
    contentEn: 'What ambition have you not dared to share with anyone yet?',
    contentId: 'Ambisi apa yang belum berani kamu ceritakan ke siapa pun?'
  },
  {
    id: 'pas-04',
    themeSlug: 'passion',
    level: 'brave',
    number: '04',
    category: 'Pengorbanan',
    contentEn: 'What was the toughest sacrifice you made to pursue your dreams?',
    contentId: 'Apa pengorbanan terberat yang pernah kamu ambil demi mengejar impianmu?'
  },

  // 4. Friendship (Teman Sejati & Nongkrong)
  {
    id: 'fri-01',
    themeSlug: 'friendship',
    level: 'deep',
    number: '01',
    category: 'Teman Sejati',
    contentEn: 'Who is always there for you when you are not okay?',
    contentId: 'Siapa orang yang selalu ada saat kamu sedang tidak baik-baik saja?'
  },
  {
    id: 'fri-02',
    themeSlug: 'friendship',
    level: 'light',
    number: '02',
    category: 'Nostalgia',
    contentEn: 'What is the most ridiculous memory we shared that you will never forget?',
    contentId: 'Hal paling konyol apa yang pernah kita lakuin bareng dan gak bakal pernah kamu lupain?'
  },
  {
    id: 'fri-03',
    themeSlug: 'friendship',
    level: 'brave',
    number: '03',
    category: 'Kejujuran',
    contentEn: 'What trait of mine is the most annoying, yet makes you unable to stay mad at me?',
    contentId: 'Menurutmu, sifat apa dariku yang paling ngeselin tapi justru bikin kamu gak bisa benci?'
  },
  {
    id: 'fri-04',
    themeSlug: 'friendship',
    level: 'deep',
    number: '04',
    category: 'Doa Sahabat',
    contentEn: 'What sincere wish or prayer do you have for your best friend right now?',
    contentId: 'Apa satu pesan atau doa tulus yang ingin kamu sampaikan ke sahabat terbaikmu saat ini?'
  },

  // 5. Dreams (Mimpi & Harapan)
  {
    id: 'drm-01',
    themeSlug: 'dreams',
    level: 'light',
    number: '01',
    category: 'Mimpi & Harapan',
    contentEn: 'If nothing is impossible, what dream would you chase?',
    contentId: 'Jika tidak ada yang mustahil, mimpi apa yang akan kamu kejar?'
  },
  {
    id: 'drm-02',
    themeSlug: 'dreams',
    level: 'deep',
    number: '02',
    category: 'Masa Depan',
    contentEn: 'Where do you see yourself 5 years from now if everything goes according to plan?',
    contentId: 'Di mana kamu melihat dirimu 5 tahun dari sekarang kalau semua rencanamu berjalan mulus?'
  },
  {
    id: 'drm-03',
    themeSlug: 'dreams',
    level: 'light',
    number: '03',
    category: 'Eksplorasi',
    contentEn: 'What new thing outside your comfort zone do you most want to try this year?',
    contentId: 'Apa hal baru di luar zona nyamanmu yang paling ingin kamu coba tahun ini?'
  },

  // 6. Gratitude (Rasa Syukur)
  {
    id: 'grt-01',
    themeSlug: 'gratitude',
    level: 'deep',
    number: '01',
    category: 'Rasa Syukur',
    contentEn: 'What small thing today made you feel grateful?',
    contentId: 'Hal kecil apa hari ini yang membuatmu merasa bersyukur?'
  },
  {
    id: 'grt-02',
    themeSlug: 'gratitude',
    level: 'deep',
    number: '02',
    category: 'Apresiasi',
    contentEn: 'Who do you most want to thank this week and why?',
    contentId: 'Siapa orang yang paling ingin kamu ucapkan terima kasih minggu ini dan kenapa?'
  },
  {
    id: 'grt-03',
    themeSlug: 'gratitude',
    level: 'brave',
    number: '03',
    category: 'Pelajaran Hidup',
    contentEn: 'What valuable life lesson did you gain from your toughest trial?',
    contentId: 'Pelajaran hidup berharga apa yang kamu dapatkan dari pengalaman paling sulit dalam hidupmu?'
  },

  // 7. Pertanyaan Kustom
  {
    id: 'cust-01',
    themeSlug: 'custom',
    level: 'light',
    number: '01',
    category: 'Pencapaian',
    contentEn: 'What is the best accomplishment you achieved over the past year?',
    contentId: 'Apa pencapaian terbaik yang pernah kamu raih dalam setahun terakhir ini?'
  },
  {
    id: 'cust-02',
    themeSlug: 'custom',
    level: 'light',
    number: '02',
    category: 'Imajinasi',
    contentEn: 'If your life was a movie, who would play you?',
    contentId: 'Kalau hidupmu dibikin film, siapa aktor yang paling cocok memerankan karaktermu?'
  },
  {
    id: 'cust-03',
    themeSlug: 'custom',
    level: 'brave',
    number: '03',
    category: 'Rahasia Kecil',
    contentEn: 'What small secret have you never told anyone in this room?',
    contentId: 'Satu rahasia kecil apa yang belum pernah kamu ceritakan ke siapapun di ruangan ini?'
  },

  // 7. Dunia Si Kecil (Kids & Parent Bonding)
  {
    id: 'kids-01',
    themeSlug: 'kids',
    level: 'light',
    number: '01',
    category: 'Keceriaan',
    contentEn: 'What was the happiest or most exciting thing that happened today?',
    contentId: 'Apa hal paling membahagiakan atau seru yang terjadi pada hari ini?'
  },
  {
    id: 'kids-02',
    themeSlug: 'kids',
    level: 'light',
    number: '02',
    category: 'Imajinasi',
    contentEn: 'If you had a superpower to do anything today, what would you choose and why?',
    contentId: 'Kalau kamu punya kekuatan super untuk melakukan apa saja hari ini, kekuatan apa yang akan kamu pilih dan kenapa?'
  },
  {
    id: 'kids-03',
    themeSlug: 'kids',
    level: 'deep',
    number: '03',
    category: 'Percaya Diri',
    contentEn: 'When was the last time you felt truly proud of yourself?',
    contentId: 'Kapan terakhir kali kamu merasa sangat bangga pada diri sendiri?'
  },
  {
    id: 'kids-04',
    themeSlug: 'kids',
    level: 'deep',
    number: '04',
    category: 'Hati ke Hati',
    contentEn: 'Is there anything making you feel worried, scared, or sad lately?',
    contentId: 'Ada hal atau sesuatu yang sedang membuatmu merasa khawatir, takut, atau sedih akhir-akhir ini?'
  },
  {
    id: 'kids-05',
    themeSlug: 'kids',
    level: 'light',
    number: '05',
    category: 'Aturan',
    contentEn: 'If you could change one rule at home or school, what rule would you change?',
    contentId: 'Kalau kamu bisa mengubah satu aturan di rumah/sekolah, aturan apa yang ingin kamu ubah?'
  },
  {
    id: 'kids-06',
    themeSlug: 'kids',
    level: 'deep',
    number: '06',
    category: 'Perasaan',
    contentEn: 'Which part of your day makes you feel most bored or tired?',
    contentId: 'Bagian mana dari harimu yang paling membuatmu merasa bosan atau lelah?'
  },
  {
    id: 'kids-07',
    themeSlug: 'kids',
    level: 'light',
    number: '07',
    category: 'Pertemanan',
    contentEn: 'In your opinion, what does it mean to be a good friend?',
    contentId: 'Menurutmu, apa arti menjadi teman yang baik itu?'
  },
  {
    id: 'kids-08',
    themeSlug: 'kids',
    level: 'deep',
    number: '08',
    category: 'Rasa Sayang',
    contentEn: 'When was the last time you felt most loved or cared for by those around you?',
    contentId: 'Kapan terakhir kali kamu merasa paling disayangi atau diperhatikan oleh orang-orang di sekitarmu?'
  },
  {
    id: 'kids-09',
    themeSlug: 'kids',
    level: 'light',
    number: '09',
    category: 'Petualangan',
    contentEn: 'If you could go to any magical place right now with someone you love, where would you go?',
    contentId: 'Kalau kamu bisa pergi ke tempat ajaib mana pun sekarang bersama seseorang yang kamu sayang, mau ke mana kamu?'
  },
  {
    id: 'kids-10',
    themeSlug: 'kids',
    level: 'light',
    number: '10',
    category: 'Cita-Cita',
    contentEn: 'What dream or goal do you most want to achieve when you grow up?',
    contentId: 'Apa cita-cita atau hal yang paling ingin kamu wujudkan saat kamu besar nanti?'
  },
  {
    id: 'kids-11',
    themeSlug: 'kids',
    level: 'deep',
    number: '11',
    category: 'Emosi & Cuaca',
    contentEn: 'If your feelings were described like the weather today (sunny, cloudy, stormy, rainy), what weather is in your heart?',
    contentId: 'Kalau perasaanmu sedang digambarkan seperti cuaca hari ini (misalnya: cerah, mendung, badai, hujan), cuaca apa yang sedang kamu rasakan di dalam hatimu?'
  },
  {
    id: 'kids-12',
    themeSlug: 'kids',
    level: 'light',
    number: '12',
    category: 'Apresiasi',
    contentEn: 'What small thing that someone did for you made you the happiest?',
    contentId: 'Apa hal kecil yang orang lain lakukan untukmu yang paling membuatmu senang?'
  },
  {
    id: 'kids-13',
    themeSlug: 'kids',
    level: 'brave',
    number: '13',
    category: 'Keterbukaan',
    contentEn: 'Is there anything you wanted to tell or ask me, but hesitated until now?',
    contentId: 'Adakah hal yang ingin kamu ceritakan atau tanyakan padaku, tapi selama ini kamu ragu-ragu untuk mengatakannya?'
  },
  {
    id: 'kids-14',
    themeSlug: 'kids',
    level: 'deep',
    number: '14',
    category: 'Dukungan',
    contentEn: 'What is the best way I can help or comfort you when you feel sad or upset?',
    contentId: 'Bagaimana cara terbaik yang bisa aku lakukan untuk membantumu saat kamu sedang merasa sedih atau marah?'
  },
  {
    id: 'kids-15',
    themeSlug: 'kids',
    level: 'light',
    number: '15',
    category: 'Cinta Diri',
    contentEn: 'What is your favorite thing that you love most about yourself?',
    contentId: 'Apa hal favorit yang paling kamu suka dari dirimu sendiri?'
  },
  {
    id: 'kids-16',
    themeSlug: 'kids',
    level: 'light',
    number: '16',
    category: 'Imajinasi',
    contentEn: 'If you could be any animal in the world, what would you be and why?',
    contentId: 'Kalau kamu bisa jadi hewan apa saja di dunia, kamu mau jadi apa? Kenapa?'
  }
];
