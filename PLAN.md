# PLAN — ispanyolca.egementuncer.dev

Kişisel İspanyolca (İspanya İspanyolcası) öğrenme uygulaması. Türkçe arayüz, ses yok, backend yok.

---

## 0. İnceleme bulguları

| Konu | Durum |
|---|---|
| Mevcut repo (`~/Desktop/portfolyo-site`) | Portfolyo. Vanilla JS + esbuild ile kendi build betiği, React/TS yok. **Uygulama buraya kurulmayacak, bu repoya dokunulmayacak.** |
| Diğer projeler | Nöbetçi, Sedefli Diş, Mürver, Daisy: hepsi ayrı klasör + ayrı repo + ayrı subdomain. Aynı kalıbı izliyoruz. |
| Yeni klasör | `~/IspanyolcaApp` (ayrı git repo; GitHub: `egementuncerdev/ispanyolca`, özel ya da açık sen seçersin) |
| Subdomain | `ispanyolca.egementuncer.dev` boş (DNS kaydı yok). |
| Cloudflare | Bu hesapta bütün subdomain'ler **Workers (static assets)** olarak çalışıyor, Pages değil. Wrangler bu makinede giriş yapmış durumda. |
| Araçlar | Node 26.7, npm 11.19 |

### Deploy kararı (onay gerekiyor)
Brief Cloudflare Pages + `_redirects` diyor. Önerim, diğer subdomain'lerle aynı olsun diye **Workers static assets**:
- `wrangler.jsonc` → `assets.directory: ./dist`, `not_found_handling: "single-page-application"` (SPA fallback; `_redirects` gerekmez)
- `routes: [{ pattern: "ispanyolca.egementuncer.dev", custom_domain: true }]` → DNS kaydını Cloudflare kendisi açar, panelde senin bir şey yapman gerekmez
- Deploy: `npm run deploy` (build + `wrangler deploy`)
- İstersen Pages da olur; README'ye iki yolu da yazarım.

---

## 1. Teknik kararlar

- **Stack:** Vite 8 + React 19 + TypeScript + Tailwind CSS 4 (dark: `class`) + React Router + ts-fsrs 5 + Dexie 4 (IndexedDB) + Vitest + lucide-react. Grafikler **elle SVG** (Recharts eklemiyorum; 4 basit grafik ve ısı haritası için 100 KB'lık kütüphaneye gerek yok).
  - TypeScript 7 (yeni Go tabanlı derleyici) Vite eklentileriyle sorun çıkarırsa 5.x'e sabitlerim.
- **Font:** Inter, `@fontsource-variable/inter` ile kendi sunucumuzdan (Google Fonts yok).
- **Storage:** `src/lib/storage/` içinde arayüzler (`CardRepo`, `ReviewRepo`, `SessionRepo`, `ProgressRepo`, `SettingsRepo`…) + Dexie uygulaması. Bileşenler Dexie'yi hiç görmez. Supabase'e geçiş = yeni bir uygulama sınıfı.
- **XP ve istatistik olay günlüğünden türetilir:** her eylem (`review`, `quiz_answer`, `grammar_done`, `reading_done`, `game_played`…) bir `ActivityEvent` olarak kaydedilir. XP, streak, günlük hedef, başarım ve istatistikler bu günlükten hesaplanır. Böylece Faz 2'de yaptığın tekrarlar Faz 7'de XP olarak sayılır, hiçbir şey kaybolmaz.
- **"Gün":** Ayarlardaki gün başlangıç saati (varsayılan 04:00) ve Europe/Istanbul'a göre. Tek bir `dayKey()` fonksiyonu, testli.
- **İçerik doğruluğu:**
  - İspanya İspanyolcası; vosotros; IPA Kastilya telaffuzuyla (c/z → θ). LatAm farkı yalnızca `latamNote` ile.
  - Her ismin artikeli ve cinsiyeti, her fiilin presente çekimi otomatik testle kontrol edilir (6 kişi dolu mu, düzenli fiiller kurala uyuyor mu, düzensizler listeyle eşleşiyor mu).
  - Emin olmadığım bir şey olursa koymam. Faz 2 sonunda içerik dosyalarını kontrol etmen için ayrı bir liste veririm.
- **Ses:** hiçbir yerde yok. Telaffuz yalnız IPA.

---

## 2. Klasör yapısı

```
src/
  app/              # router, layout, tema, sağlayıcılar
  components/       # Button, Card, EmptyState, Popover, ProgressBar, Kbd…
  features/         # dashboard, course, words, flashcards, grammar, quiz, games, reading, dictionary, stats, achievements, settings, palette
  content/          # vocabulary/, verbs/, grammar/, readings/, course/, achievements.ts
  lib/              # srs/, xp/, streak/, goals/, session/, quiz/, storage/, text/, time/, recommend/
  types/            # veri modelleri
tests/ (lib yanında *.test.ts)
```
İçerik asla bileşen içinde değil; yeni kelime/konu/okuma = `content/` altına veri.

---

## 3. Fazlar

Her faz sonunda: `npm run build` + `npm test` temiz → nasıl test edeceğini yazarım → commit → durur, sana sorarım.

### Faz 1 — İskelet
**Dosyalar:** proje kurulumu, `app/` (router, layout, tema), `components/` temel parçalar, `lib/storage/` (arayüz + Dexie), `lib/time/dayKey`, `features/settings/`, `types/`.
**Kabul:**
- Desktop sol sidebar, tablette yalnız ikon, mobilde alt menü (Ana Sayfa, Kelimeler, Grammar, Oyunlar, İstatistik) + "Diğer".
- 11 menü sayfası açılıyor; henüz yapılmayanlar düzgün bir "yakında" boş durumu gösteriyor.
- Tema: açık / koyu (slate) / sistem; yenilemede korunuyor.
- Ayarlar: tema, günlük yeni kelime, günlük hedef süresi, seviye, gün başlangıç saati, saat dilimi; kaydediliyor.
- Dışa aktar (JSON) ve içe aktar çalışıyor; içe aktarılan dosya doğrulanıyor.
- Testler: `dayKey` (03:59 bir önceki gün sayılır), dışa/içe aktarma gidiş-dönüş.

### Faz 2 — Kelimeler + Spaced Repetition
**İçerik:** ~300 A1 kelime (12 konu), ~40 sık fiilin presente çekimi (ser, estar, tener, ir, hacer, poder, querer, venir, decir, salir, poner, saber, conocer, dar, ver… düzensizler doğru).
**Dosyalar:** `content/vocabulary/*.ts`, `content/verbs/*.ts`, `lib/srs/` (ts-fsrs sarmalayıcı, durum türetme, "sonraki tekrar" metni), `lib/text/` (normalizasyon, aksan uyarısı), `features/words/`, `features/flashcards/`.
**Kabul:**
- Kelime kartı: ES, TR, IPA, tür, artikel, cinsiyet, çoğul, örnek + çevirisi, eş/zıt/ilişkili, seviye, ⭐ favori.
- Kelimeler sayfası: liste/grid, arama, filtre (seviye, konu, durum), Favoriler ve Zorlandıklarım sekmeleri.
- Flashcard: çevirme animasyonu, swipe (sol Unuttum, sağ Hatırladım), 4 buton, klavye (Space, 1–4), odak modu.
- 5 kart tipi (+ emoji tipi somut isimler için); her tip ayrı SRS kartı. Günlük yeni kart limiti ayardan.
- Yazmalı cevapta büyük/küçük harf ve boşluk önemsiz; eksik aksanda "Doğru, ama aksan: *está*" (katı mod ayarı).
- Durumlar: Yeni → Öğreniliyor → Biliniyor → Ustalaşıldı; kullanıcı yalnız "Sonraki tekrar: 3 gün sonra" görür.
- Testler: SRS planlama, durum türetme, normalizasyon, içerik bütünlüğü (artikel/cinsiyet/çekim).

### Faz 3 — Grammar
**İçerik:** 23 A1 konu, her biri ayrı dosya (kişi zamirleri … ir a + mastar); konu başına tablo, 2–3 örnek, kullanım maddeleri, 2–3 mini test, 8–12 alıştırma.
**Dosyalar:** `content/grammar/*.ts`, `features/grammar/`, `lib/quiz/` içinde soru tiplerinin cevap kontrolü (Faz 4'teki motorun çekirdeği burada başlar).
**Kabul:** konu listesi (seviye alanıyla, A2+ eklemeye hazır), kart kart konu sayfası, 6 alıştırma tipi (boşluk, seçmeli, cümle düzelt, kelime sıralama tıkla/sürükle, TR→ES, ES→TR), anında geri bildirim + açıklama, konu başarı oranı kaydı.

### Faz 4 — Quiz motoru + 7 oyun
**Dosyalar:** `lib/quiz/` (soru üretimi kelime verisinden + grammar sorularından, karıştırma, puanlama), `features/quiz/`, `features/games/*`.
**Kabul:** kategorili quiz, sonuç ekranı (8/10 — %80, yanlış listesi, "Yanlışları tekrar et" → SRS'te Unuttum). Oyunlar: Word Match, Scramble, Hangman, Memory, Speed Quiz (en iyi skor), Translation Challenge (alternatif cevaplar veride), Fill the Gap. Havuz öncelikle öğrenilen/öğreniliyor kelimeler.

### Faz 5 — Okuma + Sözlük
**İçerik:** ~10 A1 metin + 2–3 mini hikâye, yalnız A1 yapıları, glossary kelime id'leriyle.
**Kabul:** seviye/konu filtresi; her kelime tıklanınca popover (anlam, IPA, örnek, Kartlarıma ekle); metin altı kelime listesi; sonda quiz motoruyla sorular. Sözlük: ES veya TR anlık arama, fiilse çekim tablosu, Kartlarıma ekle.

### Faz 6 — A1 Kursu (8 ünite)
**Dosyalar:** `content/course/` (yalnız id referansları, kopya yok), `features/course/`.
**Kabul:** Ders → Kelimeler → Alıştırma → Quiz → Okuma → Ünite testi (%70) sırayla açılıyor; ilerleme yüzdesi; "¡Unidad completada! 🎉" + XP olayı.

### Faz 7 — Oyunlaştırma + Dashboard
**Dosyalar:** `lib/xp/config.ts` (bütün değerler), `lib/xp/`, `lib/streak/` (Streak Freeze'e hazır model), `lib/goals/`, `lib/session/` (bugünkü akış, kaldığı yerden devam), `lib/recommend/`, `content/achievements.ts`, `features/dashboard/`, `features/achievements/`.
**Kabul:** ¡Hola, Egemen!; ▶️ Bugünkü Çalışma (bekleyen → yeni → grammar → quiz → okuma, yarıda kalınca devam); ⚡ 5 dakikalık çalışma; günlük hedef + tahmini süre + bar; 🔥 streak, ⭐ XP/seviye, dil seviyesi; kural tabanlı öneri; 12 başarım kilitli/açık + ilerleme. Testler: XP, seviye eşikleri, streak (gün başlangıç saati dahil), hedef üretimi.

### Faz 8 — İstatistikler + ⌘K
**Kabul:** öğrenilen kelime, günlük grafik, quiz/grammar başarı, çalışma süresi, XP/streak geçmişi, en zor 10 kelime, güçlü/zayıf konular, son 30 gün kartı, 6–12 aylık ısı haritası (SVG). ⌘K/Ctrl+K: kelime/konu/okuma/fiil arama + komutlar, tamamen klavyeyle.

### Faz 9 — Cila + deploy
**Kabul:** bütün boş durumlar; klavye, görünür focus, kontrast, label'lar (axe taraması temiz); route bazlı lazy loading; 375 / 768 / 1280 px kontrolü; `prefers-reduced-motion`; deploy + README (adım adım deploy, "Gelecek" bölümü: ses, AI, admin, hesap/backend, PWA, CSV/Anki hangi katmana eklenir).

---

## 4. Onay bekleyenler
1. Deploy: **Workers static assets (önerim)** mı, Pages mi?
2. GitHub reposu: özel mi, açık mı?
3. Planın geri kalanı uygun mu? Onaylarsan Faz 1'den başlarım.
