-- ==============================================================================
-- KataSiapa Production Database Schema & Seed for Supabase (PostgreSQL)
-- ==============================================================================
-- Generated automatically for Supabase SQL Editor and direct PostgreSQL connections.
-- Includes full DDL, RLS policies, performance indexes, and complete initial data.
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(60) UNIQUE NOT NULL,
  avatar TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  favorite_vibe VARCHAR(100) DEFAULT 'Romantic & Deep Talk',
  total_cards_drawn INT DEFAULT 42,
  total_sessions_played INT DEFAULT 8,
  day_streak INT DEFAULT 4,
  joined_date VARCHAR(60) DEFAULT 'November 2026',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. THEMES TABLE
CREATE TABLE IF NOT EXISTS themes (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(80) UNIQUE NOT NULL,
  title_en VARCHAR(100),
  title_id VARCHAR(100),
  subtitle_en VARCHAR(150),
  subtitle_id VARCHAR(150),
  description TEXT,
  color VARCHAR(40),
  icon VARCHAR(40),
  gradient VARCHAR(120),
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  card_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CARDS TABLE
CREATE TABLE IF NOT EXISTS cards (
  id VARCHAR(64) PRIMARY KEY,
  theme_slug VARCHAR(80) NOT NULL,
  text_id TEXT NOT NULL,
  text_en TEXT,
  category VARCHAR(60) DEFAULT 'Umum',
  level VARCHAR(30) DEFAULT 'light',
  is_deep BOOLEAN DEFAULT false,
  is_icebreaker BOOLEAN DEFAULT true,
  is_locked BOOLEAN DEFAULT false,
  password_hash TEXT,
  deck_id VARCHAR(64),
  deck_title VARCHAR(120),
  creator_name VARCHAR(120),
  creator_username VARCHAR(60),
  number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all columns exist for existing database upgrades
ALTER TABLE cards ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS deck_id VARCHAR(64);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS deck_title VARCHAR(120);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS creator_name VARCHAR(120);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS creator_username VARCHAR(60);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS number VARCHAR(20);

-- 4. DECKS / COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS decks (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT,
  theme_slug VARCHAR(80) NOT NULL,
  card_count INT DEFAULT 0,
  card_ids JSONB DEFAULT '[]'::jsonb,
  is_locked BOOLEAN DEFAULT false,
  password_hash TEXT,
  creator_name VARCHAR(120),
  creator_username VARCHAR(60),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE decks ADD COLUMN IF NOT EXISTS creator_name VARCHAR(120);
ALTER TABLE decks ADD COLUMN IF NOT EXISTS creator_username VARCHAR(60);
ALTER TABLE decks ADD COLUMN IF NOT EXISTS card_ids JSONB DEFAULT '[]'::jsonb;

-- 5. GAME SESSIONS TABLE
CREATE TABLE IF NOT EXISTS game_sessions (
  id VARCHAR(64) PRIMARY KEY,
  theme_slug VARCHAR(80),
  cards_drawn INT DEFAULT 0,
  mode VARCHAR(40) DEFAULT 'solo',
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  card_id VARCHAR(64) REFERENCES cards(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, card_id)
);

-- INDEXES FOR MAXIMUM QUERY SPEED
CREATE INDEX IF NOT EXISTS idx_cards_theme ON cards(theme_slug);
CREATE INDEX IF NOT EXISTS idx_cards_deck ON cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_decks_theme ON decks(theme_slug);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) FOR SUPABASE
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to allow re-running cleanly
DROP POLICY IF EXISTS "Public profiles read" ON profiles;
DROP POLICY IF EXISTS "Public profiles update" ON profiles;
DROP POLICY IF EXISTS "Public profiles insert" ON profiles;
DROP POLICY IF EXISTS "Public themes read" ON themes;
DROP POLICY IF EXISTS "Public cards read" ON cards;
DROP POLICY IF EXISTS "Public cards insert" ON cards;
DROP POLICY IF EXISTS "Public cards update" ON cards;
DROP POLICY IF EXISTS "Public cards delete" ON cards;
DROP POLICY IF EXISTS "Public decks read" ON decks;
DROP POLICY IF EXISTS "Public decks insert" ON decks;
DROP POLICY IF EXISTS "Public decks update" ON decks;
DROP POLICY IF EXISTS "Public decks delete" ON decks;
DROP POLICY IF EXISTS "Public sessions insert" ON game_sessions;
DROP POLICY IF EXISTS "Public favorites all" ON favorites;

-- Allow public access for game functionality
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public profiles update" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Public profiles insert" ON profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Public themes read" ON themes FOR SELECT USING (true);

CREATE POLICY "Public cards read" ON cards FOR SELECT USING (true);
CREATE POLICY "Public cards insert" ON cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Public cards update" ON cards FOR UPDATE USING (true);
CREATE POLICY "Public cards delete" ON cards FOR DELETE USING (true);

CREATE POLICY "Public decks read" ON decks FOR SELECT USING (true);
CREATE POLICY "Public decks insert" ON decks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public decks update" ON decks FOR UPDATE USING (true);
CREATE POLICY "Public decks delete" ON decks FOR DELETE USING (true);

CREATE POLICY "Public sessions insert" ON game_sessions FOR ALL USING (true);
CREATE POLICY "Public favorites all" ON favorites FOR ALL USING (true);

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- 1. Seed Default Profile
INSERT INTO profiles (id, name, username, avatar, bio, favorite_vibe, total_cards_drawn, total_sessions_played, day_streak, joined_date)
VALUES (
  'user_default',
  'Bintang Nongkee',
  'bintang_talks',
  '',
  'Suka obrolan deep talk jam 2 pagi dan ketawa lepas bareng teman.',
  'Romantic & Deep Talk',
  42,
  8,
  4,
  'November 2026'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  username = EXCLUDED.username,
  bio = EXCLUDED.bio;

-- 2. Seed 8 Official Themes
INSERT INTO themes (id, name, slug, title_en, title_id, subtitle_en, subtitle_id, description, color, gradient, is_popular, is_new, card_count) VALUES
('family', 'Family', 'family', 'Family', 'Family', 'Family Stories', 'Cerita Keluarga', 'Cerita Keluarga', '#D9500B', 'from-[#D9500B] to-[#A8330A]', true, false, 6),
('gratitude', 'Gratitude', 'gratitude', 'Gratitude', 'Gratitude', 'Grateful Hearts', 'Rasa Syukur', 'Rasa Syukur', '#0E7BC4', 'from-[#0E7BC4] to-[#0B4F9C]', true, false, 6),
('friendship', 'Friendship', 'friendship', 'Friendship', 'Friendship', 'True Friends', 'Teman Sejati', 'Teman Sejati', '#0B8A5F', 'from-[#0B8A5F] to-[#0A5E55]', true, false, 6),
('dreams', 'Dreams', 'dreams', 'Dreams', 'Dreams', 'Hopes & Wishes', 'Mimpi & Harapan', 'Mimpi & Harapan', '#6D5AE6', 'from-[#6D5AE6] to-[#35258F]', true, false, 6),
('love', 'Love', 'love', 'Love', 'Love', 'Love Stories', 'Cerita Cinta', 'Cerita Cinta', '#D63B78', 'from-[#D63B78] to-[#9E1F5A]', true, false, 6),
('passion', 'Passion', 'passion', 'Passion', 'Passion', 'Fire & Drive', 'Api Semangat', 'Api Semangat', '#C8102E', 'from-[#C8102E] to-[#6E0A1E]', true, false, 6),
('kids', 'Kids', 'kids', 'Kids', 'Kids', 'Fun Talks for Little Ones', 'Ngobrol Seru Bareng Anak', 'Ngobrol Seru Bareng Anak', '#2DD4C4', 'from-[#2DD4C4] to-[#0E9AA7]', true, false, 6),
('custom', 'Custom', 'custom', 'Custom', 'Custom', 'Make Your Own Deck', 'Buat Dekmu Sendiri', 'Buat Dekmu Sendiri', '#FFC83D', 'from-[#FFC83D] to-[#E8870E]', true, false, 6)
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_id = EXCLUDED.title_id,
  subtitle_en = EXCLUDED.subtitle_en,
  subtitle_id = EXCLUDED.subtitle_id,
  color = EXCLUDED.color,
  gradient = EXCLUDED.gradient;

-- 3. Seed Decks
INSERT INTO decks (id, title, description, theme_slug, card_count, is_locked, password_hash, created_at) VALUES
('deck-pasangan-01', 'Deep Talk & Rahasia Pasangan', 'Kumpulan pertanyaan intim dan jujur khusus untuk dibicarakan berdua dengan pasangan.', 'pasangan', 6, true, 'b7a87d72e2c93e31aff0fcab6d6c05a6c83d40cfe771ab95835d3b6dc86dbf7a', '2026-11-01T00:00:00Z'),
('deck-nongkee-01', 'Keseruan Nongkrong Santai', 'Cairkan suasana tongkrongan dengan topik seru, lucu, dan gak ada matinya.', 'friendship', 6, false, NULL, '2026-11-02T00:00:00Z'),
('deck-kids-01', 'Dunia Imajinasi Si Kecil', 'Momen berharga untuk mendengarkan isi hati, impian, dan imajinasi anak-anak.', 'kids', 8, false, NULL, '2026-11-03T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_locked = EXCLUDED.is_locked;

-- 4. Seed Cards (44 Cards)
INSERT INTO cards (id, theme_slug, text_id, text_en, category, level, is_deep, is_icebreaker, is_locked, password_hash, deck_id, deck_title, creator_name, creator_username, number) VALUES
('fam-01', 'family', 'Kenangan masa kecil bersama keluarga apa yang paling kamu rindukan?', 'What childhood memory with your family do you miss the most?', 'Kenangan', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '01'),
('fam-02', 'family', 'Nasihat orang tua apa yang dulu kamu sepelekan, tapi sekarang baru terasa sangat benar?', 'What parental advice did you ignore before, that now feels completely true?', 'Nasihat', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '02'),
('fam-03', 'family', 'Tradisi atau kebiasaan keluarga apa yang ingin tetap kamu jaga sampai nanti?', 'What family habit or tradition would you love to keep for your future children?', 'Tradisi', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '03'),
('fam-04', 'family', 'Kapan momen terakhir kali kamu ngerasa paling bangga jadi bagian dari keluarga ini?', 'When was the last time you felt truly proud to be a part of this family?', 'Kebanggaan', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '04'),
('fam-05', 'family', 'Hal apa yang paling ingin kamu ucapkan ke orang tua tapi selalu terasa canggung?', 'What is something you always wanted to say to your parents, but felt too awkward?', 'Kejujuran', 'brave', false, false, false, NULL, NULL, NULL, NULL, NULL, '05'),
('lov-01', 'love', 'Kapan terakhir kali kamu merasa benar-benar dicintai?', 'When was the last time you felt truly loved?', 'Apresiasi', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '01'),
('lov-02', 'love', 'Momen apa yang pertama kali bikin kamu sadar kalau kamu jatuh cinta sama dia?', 'When did you first realize you were falling in love with your partner?', 'Pertama Kali', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '02'),
('lov-03', 'love', 'Tindakan kecil apa dari pasangan yang paling bikin kamu ngerasa dihargai dan aman?', 'What small gesture from your partner makes you feel most cherished and safe?', 'Keamanan', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '03'),
('lov-04', 'love', 'Apa ketakutan terbesar kamu tentang komitmen masa depan yang jarang kamu ceritakan?', 'What is your biggest unspoken fear regarding relationship and the future?', 'Komitmen', 'brave', false, false, false, NULL, NULL, NULL, NULL, NULL, '04'),
('lov-05', 'love', 'Kalau kita punya liburan impian tanpa batas budget, tempat mana yang ingin kamu tuju berdua?', 'If budget was unlimited, where is the dream vacation destination for just the two of you?', 'Impian', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '05'),
('pas-01', 'passion', 'Apa yang bisa membuatmu lupa waktu saat kamu melakukannya?', 'What is something that makes you lose track of time when doing it?', 'Api Semangat', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '01'),
('pas-02', 'passion', 'Pekerjaan atau karya apa yang rela kamu kerjakan berjam-jam tanpa merasa lelah?', 'What craft or project could you work on for hours without feeling drained?', 'Karya', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '02'),
('pas-03', 'passion', 'Ambisi apa yang belum berani kamu ceritakan ke siapa pun?', 'What ambition have you not dared to share with anyone yet?', 'Ambisi', 'brave', false, false, false, NULL, NULL, NULL, NULL, NULL, '03'),
('pas-04', 'passion', 'Apa pengorbanan terberat yang pernah kamu ambil demi mengejar impianmu?', 'What was the toughest sacrifice you made to pursue your dreams?', 'Pengorbanan', 'brave', false, false, false, NULL, NULL, NULL, NULL, NULL, '04'),
('fri-01', 'friendship', 'Siapa orang yang selalu ada saat kamu sedang tidak baik-baik saja?', 'Who is always there for you when you are not okay?', 'Teman Sejati', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '01'),
('fri-02', 'friendship', 'Hal paling konyol apa yang pernah kita lakuin bareng dan gak bakal pernah kamu lupain?', 'What is the most ridiculous memory we shared that you will never forget?', 'Nostalgia', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '02'),
('fri-03', 'friendship', 'Menurutmu, sifat apa dariku yang paling ngeselin tapi justru bikin kamu gak bisa benci?', 'What trait of mine is the most annoying, yet makes you unable to stay mad at me?', 'Kejujuran', 'brave', false, false, false, NULL, NULL, NULL, NULL, NULL, '03'),
('fri-04', 'friendship', 'Apa satu pesan atau doa tulus yang ingin kamu sampaikan ke sahabat terbaikmu saat ini?', 'What sincere wish or prayer do you have for your best friend right now?', 'Doa Sahabat', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '04'),
('drm-01', 'dreams', 'Jika tidak ada yang mustahil, mimpi apa yang akan kamu kejar?', 'If nothing is impossible, what dream would you chase?', 'Mimpi & Harapan', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '01'),
('drm-02', 'dreams', 'Di mana kamu melihat dirimu 5 tahun dari sekarang kalau semua rencanamu berjalan mulus?', 'Where do you see yourself 5 years from now if everything goes according to plan?', 'Masa Depan', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '02'),
('drm-03', 'dreams', 'Apa hal baru di luar zona nyamanmu yang paling ingin kamu coba tahun ini?', 'What new thing outside your comfort zone do you most want to try this year?', 'Eksplorasi', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '03'),
('grt-01', 'gratitude', 'Hal kecil apa hari ini yang membuatmu merasa bersyukur?', 'What small thing today made you feel grateful?', 'Rasa Syukur', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '01'),
('grt-02', 'gratitude', 'Siapa orang yang paling ingin kamu ucapkan terima kasih minggu ini dan kenapa?', 'Who do you most want to thank this week and why?', 'Apresiasi', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '02'),
('grt-03', 'gratitude', 'Pelajaran hidup berharga apa yang kamu dapatkan dari pengalaman paling sulit dalam hidupmu?', 'What valuable life lesson did you gain from your toughest trial?', 'Pelajaran Hidup', 'brave', false, false, false, NULL, NULL, NULL, NULL, NULL, '03'),
('cust-01', 'custom', 'Apa pencapaian terbaik yang pernah kamu raih dalam setahun terakhir ini?', 'What is the best accomplishment you achieved over the past year?', 'Pencapaian', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '01'),
('cust-02', 'custom', 'Kalau hidupmu dibikin film, siapa aktor yang paling cocok memerankan karaktermu?', 'If your life was a movie, who would play you?', 'Imajinasi', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '02'),
('cust-03', 'custom', 'Satu rahasia kecil apa yang belum pernah kamu ceritakan ke siapapun di ruangan ini?', 'What small secret have you never told anyone in this room?', 'Rahasia Kecil', 'brave', false, false, false, NULL, NULL, NULL, NULL, NULL, '03'),
('kids-01', 'kids', 'Apa hal paling membahagiakan atau seru yang terjadi pada hari ini?', 'What was the happiest or most exciting thing that happened today?', 'Keceriaan', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '01'),
('kids-02', 'kids', 'Kalau kamu punya kekuatan super untuk melakukan apa saja hari ini, kekuatan apa yang akan kamu pilih dan kenapa?', 'If you had a superpower to do anything today, what would you choose and why?', 'Imajinasi', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '02'),
('kids-03', 'kids', 'Kapan terakhir kali kamu merasa sangat bangga pada diri sendiri?', 'When was the last time you felt truly proud of yourself?', 'Percaya Diri', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '03'),
('kids-04', 'kids', 'Ada hal atau sesuatu yang sedang membuatmu merasa khawatir, takut, atau sedih akhir-akhir ini?', 'Is there anything making you feel worried, scared, or sad lately?', 'Hati ke Hati', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '04'),
('kids-05', 'kids', 'Kalau kamu bisa mengubah satu aturan di rumah/sekolah, aturan apa yang ingin kamu ubah?', 'If you could change one rule at home or school, what rule would you change?', 'Aturan', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '05'),
('kids-06', 'kids', 'Bagian mana dari harimu yang paling membuatmu merasa bosan atau lelah?', 'Which part of your day makes you feel most bored or tired?', 'Perasaan', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '06'),
('kids-07', 'kids', 'Menurutmu, apa arti menjadi teman yang baik itu?', 'In your opinion, what does it mean to be a good friend?', 'Pertemanan', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '07'),
('kids-08', 'kids', 'Kapan terakhir kali kamu merasa paling disayangi atau diperhatikan oleh orang-orang di sekitarmu?', 'When was the last time you felt most loved or cared for by those around you?', 'Rasa Sayang', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '08'),
('kids-09', 'kids', 'Kalau kamu bisa pergi ke tempat ajaib mana pun sekarang bersama seseorang yang kamu sayang, mau ke mana kamu?', 'If you could go to any magical place right now with someone you love, where would you go?', 'Petualangan', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '09'),
('kids-10', 'kids', 'Apa cita-cita atau hal yang paling ingin kamu wujudkan saat kamu besar nanti?', 'What dream or goal do you most want to achieve when you grow up?', 'Cita-Cita', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '10'),
('kids-11', 'kids', 'Kalau perasaanmu sedang digambarkan seperti cuaca hari ini (misalnya: cerah, mendung, badai, hujan), cuaca apa yang sedang kamu rasakan di dalam hatimu?', 'If your feelings were described like the weather today (sunny, cloudy, stormy, rainy), what weather is in your heart?', 'Emosi & Cuaca', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '11'),
('kids-12', 'kids', 'Apa hal kecil yang orang lain lakukan untukmu yang paling membuatmu senang?', 'What small thing that someone did for you made you the happiest?', 'Apresiasi', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '12'),
('kids-13', 'kids', 'Adakah hal yang ingin kamu ceritakan atau tanyakan padaku, tapi selama ini kamu ragu-ragu untuk mengatakannya?', 'Is there anything you wanted to tell or ask me, but hesitated until now?', 'Keterbukaan', 'brave', false, false, false, NULL, NULL, NULL, NULL, NULL, '13'),
('kids-14', 'kids', 'Bagaimana cara terbaik yang bisa aku lakukan untuk membantumu saat kamu sedang merasa sedih atau marah?', 'What is the best way I can help or comfort you when you feel sad or upset?', 'Dukungan', 'deep', true, false, false, NULL, NULL, NULL, NULL, NULL, '14'),
('kids-15', 'kids', 'Apa hal favorit yang paling kamu suka dari dirimu sendiri?', 'What is your favorite thing that you love most about yourself?', 'Cinta Diri', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '15'),
('kids-16', 'kids', 'Kalau kamu bisa jadi hewan apa saja di dunia, kamu mau jadi apa? Kenapa?', 'If you could be any animal in the world, what would you be and why?', 'Imajinasi', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '16'),
('card-1793901853971', 'custom', 'Kenapa Bumi Itu Bulat', '', 'Normal', 'light', false, true, false, NULL, NULL, NULL, NULL, NULL, '04')
ON CONFLICT (id) DO UPDATE SET
  text_id = EXCLUDED.text_id,
  text_en = EXCLUDED.text_en,
  theme_slug = EXCLUDED.theme_slug,
  category = EXCLUDED.category,
  level = EXCLUDED.level;

