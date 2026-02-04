# 🚀 Vercel'ga Deploy qilish qo'llanmasi

## 📋 Deploy qilishdan oldin

### 1. GitHub'ga push qiling

```bash
cd Nasiya_bot
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. `.env` fayllar ignore qilinganligini tekshiring

```bash
git status
# .env ko'rinmasligi kerak!
```

---

## 🔧 Vercel Dashboard sozlamalari

### 1. New Project yarating

1. Vercel Dashboard'ga kiring: https://vercel.com
2. **Add New** → **Project**
3. GitHub repository'ni tanlang: `Nasiya_bot`
4. **Import** bosing

### 2. Build & Development Settings

**Framework Preset:** Vite

**Build Command:**
```bash
pnpm install && pnpm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
pnpm install
```

### 3. Environment Variables

**Settings** → **Environment Variables** → **Add**

Quyidagi variables'larni qo'shing:

```env
VITE_API_URL=https://your-backend.onrender.com/api/bot
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_BOT_USERNAME=@your_bot_username
VITE_APP_NAME=Manager Bot
VITE_APP_VERSION=1.0.0
VITE_ENABLE_LOCAL_LOGIN=false
USE_MOCK_AUTH=false
```

**Environment:** Production, Preview, Development (barcha uchun)

### 4. Deploy qiling

**Deploy** tugmasini bosing va kutib turing.

---

## 🐛 Agar xatolik bo'lsa

### Xatolik: "Ignored build scripts: esbuild"

**Yechim 1:** `.npmrc` faylini tekshiring

Fayl mavjud va quyidagi qatorlar bor:
```
enable-pre-post-scripts=true
auto-install-peers=true
strict-peer-dependencies=false
```

**Yechim 2:** Vercel Settings'da

1. **Settings** → **General**
2. **Build & Development Settings**
3. **Install Command** ni o'zgartiring:
```bash
pnpm config set enable-pre-post-scripts true && pnpm install
```

**Yechim 3:** `package.json` da build script

Build script oddiy bo'lishi kerak:
```json
"build": "vite build"
```

TypeScript check kerak bo'lsa:
```json
"build:tsc": "tsc -b && vite build"
```

### Xatolik: "Module not found"

**Yechim:** Dependencies'ni tekshiring

```bash
# Local'da test qiling
pnpm install
pnpm run build
```

Agar local'da ishlasa, Vercel'da ham ishlashi kerak.

### Xatolik: Environment variables not found

**Yechim:** Vercel Dashboard'da

1. **Settings** → **Environment Variables**
2. Barcha kerakli variables'lar qo'shilganligini tekshiring
3. **Redeploy** qiling

---

## ✅ Deploy muvaffaqiyatli bo'lgandan keyin

### 1. Domain'ni oling

Vercel sizga domain beradi:
```
https://nasiya-bot-xxxxx.vercel.app
```

### 2. Backend'da URL'ni yangilang

Render Dashboard → Environment Variables:

```env
BOT_WEB_APP_URL=https://nasiya-bot-xxxxx.vercel.app
```

### 3. Telegram Bot'da Mini App URL'ini sozlang

@BotFather'ga yozing:

1. `/mybots`
2. Botingizni tanlang
3. **Bot Settings** → **Menu Button** → **Configure Menu Button**
4. URL kiriting:
```
https://nasiya-bot-xxxxx.vercel.app
```

### 4. Webhook'ni yangilang

Browser'da oching:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-backend.onrender.com/telegram-webhook
```

### 5. Test qiling

1. Telegram bot'ga `/start` yuboring
2. Menu button (pastki chap) bosing
3. Mini App ochilishi kerak
4. Telefon raqamni tasdiqlang
5. Dashboard ochilishi kerak

---

## 🔄 Yangilanishlar deploy qilish

### Automatic Deployment (tavsiya etiladi)

Vercel avtomatik ravishda GitHub'dagi har bir push'ni deploy qiladi:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel avtomatik deploy qiladi
```

### Manual Deployment

Vercel Dashboard:
1. **Deployments** tabiga o'ting
2. **Redeploy** tugmasini bosing

---

## 📊 Monitoring

### Deployment Logs

1. Vercel Dashboard → **Deployments**
2. Oxirgi deployment'ni bosing
3. **Building** → **View Function Logs**

### Runtime Logs

1. **Deployments** → **Functions**
2. Real-time logs ko'ring

### Analytics

1. **Analytics** tabiga o'ting
2. Traffic, performance ko'ring

---

## 🔐 Xavfsizlik

### Environment Variables

- ❌ HECH QACHON `.env` faylni GitHub'ga yuklaMASLIK
- ✅ Barcha secret'lar Vercel Dashboard'da
- ✅ Production va Development uchun alohida values

### Domain Security

1. **Settings** → **Domains**
2. Custom domain qo'shing (optional)
3. HTTPS avtomatik yoqilgan

---

## 💡 Tips

1. **Preview Deployments:** Har bir branch uchun alohida preview URL
2. **Rollback:** Eski deployment'ga qaytish mumkin
3. **Environment:** Production, Preview, Development uchun alohida variables
4. **Custom Domain:** O'z domain'ingizni ulang (optional)

---

## 📞 Yordam

Agar muammo bo'lsa:

1. Vercel Logs'ni tekshiring
2. Browser Console'ni tekshiring (F12)
3. Backend Render Logs'ni tekshiring
4. Telegram Bot webhook status'ni tekshiring

---

## 🎯 Checklist

Deploy qilishdan oldin:

- [ ] `.env` fayllar `.gitignore`da
- [ ] `.npmrc` fayli mavjud
- [ ] `vercel.json` to'g'ri sozlangan
- [ ] GitHub'ga push qilingan
- [ ] Environment variables Vercel'da sozlangan
- [ ] Backend URL to'g'ri
- [ ] Bot username to'g'ri

Deploy qilgandan keyin:

- [ ] Deployment muvaffaqiyatli
- [ ] Domain olingan
- [ ] Backend'da BOT_WEB_APP_URL yangilangan
- [ ] Telegram Bot'da Menu Button sozlangan
- [ ] Webhook yangilangan
- [ ] Test qilingan va ishlayapti
