# Español — kişisel İspanyolca öğrenme uygulaması

Türkçe arayüzlü, Türkçe → İspanyolca (İspanya İspanyolcası) öğrenme uygulaması.
Canlı: **https://ispanyolca.egementuncer.dev** · Plan ve fazlar: [`PLAN.md`](PLAN.md)

- Vite + React + TypeScript + Tailwind CSS 4 + React Router
- Spaced repetition: ts-fsrs · Veri: tarayıcıda IndexedDB (Dexie), `src/lib/storage/` repository katmanı üzerinden
- Backend yok, ses yok. Veri yedeği: Ayarlar → Verimi dışa aktar / İçe aktar

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest
npm run build    # tip kontrolü + üretim derlemesi → dist/
```

## Deploy (Cloudflare Workers, static assets)

`wrangler.jsonc` hazır: `dist/` klasörü yayınlanır, bilinmeyen yollar `index.html`'e düşer (SPA), alan adı `ispanyolca.egementuncer.dev` olarak bağlanır (DNS kaydını Cloudflare kendisi oluşturur).

```bash
npx wrangler login   # bir kez
npm run deploy       # build + wrangler deploy
```

## Klasör yapısı

```
src/
  app/          router, düzen, ayarlar ve tema
  components/   ortak arayüz parçaları
  features/     sayfa bazlı modüller
  content/      öğrenme içeriği (veri dosyaları)
  lib/          mantık: storage, time, srs, quiz, xp…
  types/        veri modelleri
```
