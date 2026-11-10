-- ==========================================
-- KataSiapa Initial Seed Data (PostgreSQL)
-- ==========================================

-- Seed Default Profile
INSERT INTO profiles (id, name, username, avatar, bio, favorite_vibe, total_cards_drawn, total_sessions_played, day_streak, joined_date)
VALUES (
  'user_default',
  'Bintang Nongkee',
  'bintang_talks',
  '😎',
  'Suka obrolan deep talk jam 2 pagi dan ketawa lepas bareng teman.',
  'Romantic & Deep Talk',
  42,
  8,
  4,
  'November 2026'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bio = EXCLUDED.bio;

-- Seed Themes
INSERT INTO themes (id, name, slug, description, color, icon, gradient, is_popular, is_new, card_count) VALUES
('custom', 'Pertanyaan Kustom', 'custom', 'Buat dan mainkan dek pertanyaanmu sendiri.', '#8b5cf6', '✨', 'from-purple-600 to-indigo-600', false, true, 5),
('nongkee', 'Kartu Nongkee', 'nongkee', 'Kartu obrolan seru untuk berbagai suasana dan teman kumpul.', '#3b82f6', '🃏', 'from-blue-600 to-cyan-600', true, false, 8),
('pasangan', 'Pasangan', 'pasangan', 'Bangun kedekatan dan kenali pasangan lebih dalam.', '#ec4899', '❤️', 'from-pink-600 to-rose-600', true, false, 7),
('family', 'Keluarga', 'family', 'Hangatkan suasana kumpul bersama orang tua dan saudara.', '#10b981', '🏡', 'from-emerald-600 to-teal-600', false, false, 6),
('passion', 'Passion & Karier', 'passion', 'Gali ambisi, mimpi, dan tujuan hidup masa depanmu.', '#f59e0b', '🔥', 'from-amber-600 to-orange-600', false, false, 6),
('gratitude', 'Rasa Syukur', 'gratitude', 'Refleksi hal-hal kecil bermakna yang sering terlewatkan.', '#06b6d4', '🌿', 'from-cyan-600 to-blue-600', false, false, 6),
('kids', 'Dunia Si Kecil', 'kids', 'Ngobrol Seru Bareng Anak untuk membangun keterbukaan dan kedekatan hangat.', '#2DD4C4', '🧸', 'from-[#2DD4C4] to-[#0E9AA7]', true, true, 11)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Seed Cards
INSERT INTO cards (id, theme_slug, text_id, text_en, category, level, is_deep, is_icebreaker) VALUES
-- Nongkee
('nong-01', 'nongkee', 'Kalau kamu bisa punya kekuatan super untuk 24 jam ke depan, apa yang bakal kamu lakuin?', 'If you had a superpower for the next 24 hours, what would you do?', 'Icebreaker', 'Santai', false, true),
('nong-02', 'nongkee', 'Ceritakan momen paling memalukan yang pernah kamu alami waktu masih sekolah/kuliah!', 'Share the most embarrassing moment from your school or college days!', 'Nostalgia', 'Santai', false, true),
('nong-03', 'nongkee', 'Hal apa yang orang lain anggap biasa, tapi bikin kamu auto ilfeel?', 'What is something normal to others that instantly turns you off?', 'Pendapat', 'Seru', false, true),
('nong-04', 'nongkee', 'Siapa orang di tongkrongan ini yang menurutmu paling gampang panik kalau ada masalah?', 'Who among us panics the easiest during an emergency?', 'Games', 'Seru', false, true),
('nong-05', 'nongkee', 'Apa kebiasaan aneh kamu waktu lagi sendirian di kamar dan gak ada orang lain yang tahu?', 'What strange habit do you have when completely alone?', 'Rahasia', 'Santai', true, false),

-- Pasangan
('pas-01', 'pasangan', 'Momen apa yang pertama kali bikin kamu sadar kalau kamu jatuh cinta sama aku?', 'When did you first realize you were falling for me?', 'Romantis', 'Intim', true, false),
('pas-02', 'pasangan', 'Apa ketakutan terbesar kamu tentang hubungan kita yang belum pernah kamu ceritakan?', 'What is your biggest unspoken fear about our relationship?', 'Deep Talk', 'Mendalam', true, false),
('pas-03', 'pasangan', 'Tindakan kecil apa dariku yang paling bikin kamu ngerasa dihargai dan disayang?', 'What small action of mine makes you feel most loved?', 'Apresiasi', 'Intim', false, true),
('pas-04', 'pasangan', 'Kalau kita punya liburan impian tanpa batas budget, tempat mana yang ingin kamu tuju bareng aku?', 'If budget was unlimited, where would our dream trip be?', 'Impian', 'Santai', false, true),
('pas-05', 'pasangan', 'Bagian mana dari sifatku yang paling kamu sukai sekaligus paling sering bikin kamu geregetan?', 'Which part of my personality do you love yet drives you crazy?', 'Kejujuran', 'Seru', false, true),

-- Custom
('cust-01', 'custom', 'Apa pencapaian terbaik yang pernah kamu raih dalam setahun terakhir ini?', 'What is your best accomplishment over the past year?', 'Kustom', 'Santai', false, true),
('cust-02', 'custom', 'Kalau hidupmu dibikin film, siapa aktor yang paling cocok memerankan karaktermu?', 'If your life was a movie, who should play you?', 'Kustom', 'Seru', false, true),

-- Family
('fam-01', 'family', 'Apa kenangan masa kecil bersama keluarga yang paling membekas hangat di ingatanmu?', 'What childhood family memory brings the warmest feelings?', 'Kenangan', 'Mendalam', true, false),
('fam-02', 'family', 'Nasihat orang tua apa yang dulu kamu sepelekan, tapi sekarang baru terasa sangat benar?', 'What parental advice did you ignore that now rings true?', 'Refleksi', 'Mendalam', true, false),

-- Passion
('pas-k-01', 'passion', 'Pekerjaan atau karya apa yang rela kamu kerjakan berjam-jam tanpa merasa lelah?', 'What project could you work on for hours without feeling tired?', 'Karier', 'Reflektif', true, false),
('pas-k-02', 'passion', 'Kalau kegagalan bukan sebuah kemungkinan, apa proyek ambisius terbesar yang ingin kamu bangun?', 'If you could not fail, what big dream would you start tomorrow?', 'Ambisi', 'Mendalam', true, false),

-- Gratitude
('grat-01', 'gratitude', 'Siapa orang yang paling ingin kamu ucapkan terima kasih minggu ini dan kenapa?', 'Who do you most want to thank this week and why?', 'Syukur', 'Mendalam', true, false),
('grat-02', 'gratitude', 'Pelajaran hidup berharga apa yang kamu dapatkan dari pengalaman paling sulit dalam hidupmu?', 'What valuable life lesson did you gain from your toughest trial?', 'Refleksi', 'Mendalam', true, false),

-- Dunia Si Kecil (Kids)
('kids-01', 'kids', 'Apa hal paling membahagiakan atau seru yang terjadi pada hari ini?', 'What was the happiest or most exciting thing that happened today?', 'Keceriaan', 'Santai', false, true),
('kids-02', 'kids', 'Kalau kamu punya kekuatan super untuk melakukan apa saja hari ini, kekuatan apa yang akan kamu pilih dan kenapa?', 'If you had a superpower to do anything today, what would you choose and why?', 'Imajinasi', 'Santai', false, true),
('kids-03', 'kids', 'Kapan terakhir kali kamu merasa sangat bangga pada diri sendiri?', 'When was the last time you felt truly proud of yourself?', 'Percaya Diri', 'Mendalam', true, false),
('kids-04', 'kids', 'Ada hal atau sesuatu yang sedang membuatmu merasa khawatir, takut, atau sedih akhir-akhir ini?', 'Is there anything making you feel worried, scared, or sad lately?', 'Hati ke Hati', 'Mendalam', true, false),
('kids-05', 'kids', 'Kalau kamu bisa mengubah satu aturan di rumah/sekolah, aturan apa yang ingin kamu ubah?', 'If you could change one rule at home or school, what rule would you change?', 'Aturan', 'Santai', false, true),
('kids-06', 'kids', 'Bagian mana dari harimu yang paling membuatmu merasa bosan atau lelah?', 'Which part of your day makes you feel most bored or tired?', 'Perasaan', 'Mendalam', true, false),
('kids-07', 'kids', 'Menurutmu, apa arti menjadi teman yang baik itu?', 'In your opinion, what does it mean to be a good friend?', 'Pertemanan', 'Santai', false, true),
('kids-08', 'kids', 'Kapan terakhir kali kamu merasa paling disayangi atau diperhatikan oleh orang-orang di sekitarmu?', 'When was the last time you felt most loved or cared for by those around you?', 'Rasa Sayang', 'Mendalam', true, false),
('kids-09', 'kids', 'Kalau kamu bisa pergi ke tempat ajaib mana pun sekarang bersama seseorang yang kamu sayang, mau ke mana kamu?', 'If you could go to any magical place right now with someone you love, where would you go?', 'Petualangan', 'Santai', false, true),
('kids-10', 'kids', 'Apa cita-cita atau hal yang paling ingin kamu wujudkan saat kamu besar nanti?', 'What dream or goal do you most want to achieve when you grow up?', 'Cita-Cita', 'Santai', false, true),
('kids-11', 'kids', 'Kalau perasaanmu sedang digambarkan seperti cuaca hari ini (misalnya: cerah, mendung, badai, hujan), cuaca apa yang sedang kamu rasakan di dalam hatimu?', 'If your feelings were described like the weather today (sunny, cloudy, stormy, rainy), what weather is in your heart?', 'Emosi & Cuaca', 'Mendalam', true, false),
('kids-12', 'kids', 'Apa hal kecil yang orang lain lakukan untukmu yang paling membuatmu senang?', 'What small thing that someone did for you made you the happiest?', 'Apresiasi', 'Santai', false, true),
('kids-13', 'kids', 'Adakah hal yang ingin kamu ceritakan atau tanyakan padaku, tapi selama ini kamu ragu-ragu untuk mengatakannya?', 'Is there anything you wanted to tell or ask me, but hesitated until now?', 'Keterbukaan', 'Hati ke Hati', true, false),
('kids-14', 'kids', 'Bagaimana cara terbaik yang bisa aku lakukan untuk membantumu saat kamu sedang merasa sedih atau marah?', 'What is the best way I can help or comfort you when you feel sad or upset?', 'Dukungan', 'Mendalam', true, false),
('kids-15', 'kids', 'Apa hal favorit yang paling kamu suka dari dirimu sendiri?', 'What is your favorite thing that you love most about yourself?', 'Cinta Diri', 'Santai', false, true),
('kids-16', 'kids', 'Kalau kamu bisa jadi hewan apa saja di dunia, kamu mau jadi apa? Kenapa?', 'If you could be any animal in the world, what would you be and why?', 'Imajinasi', 'Santai', false, true)
ON CONFLICT (id) DO UPDATE SET
  text_id = EXCLUDED.text_id,
  text_en = EXCLUDED.text_en;

