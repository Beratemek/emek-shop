# 🎄 EmekShop

<div align="center">

![EmekShop Banner](https://via.placeholder.com/800x200/0b1120/fbbf24?text=EmekShop+E-Commerce+Platform)

**Modern, Hızlı ve Güvenilir Yılbaşı Alışveriş Platformu**

[Özellikler](#-özellikler) • [Teknolojiler](#-teknolojiler) • [Kurulum](#-kurulum) • [İletişim](#-iletişim)

</div>

## 📖 Hakkında

EmekShop, kullanıcılarına lüks ve kaliteli bir alışveriş deneyimi sunan, modern web teknolojileri ile geliştirilmiş bir E-Ticaret platformudur. Yılbaşı temasıyla süslenmiş arayüzü, gelişmiş yönetici paneli ve kullanıcı dostu özellikleri ile öne çıkar.

## ✨ Özellikler

*   **🛒 Gelişmiş Sepet Sistemi:** Ürün ekleme, miktar güncelleme ve anlık tutar hesaplama.
*   **🔐 Güvenli Kimlik Doğrulama:** JWT tabanlı güvenli giriş ve kayıt sistemi.
*   **🛠️ Yönetici Paneli (Admin):**
    *   Ürün Ekleme/Düzenleme/Silme
    *   Kullanıcı Yönetimi
    *   Sipariş Takibi
    *   Gelen Kutusu ve Mesaj Yönetimi
*   **🌍 Çoklu Dil Desteği:** Türkçe ve İngilizce dil seçenekleri.
*   **📱 Tam Duyarlı Tasarım:** Mobil, tablet ve masaüstü cihazlarla %100 uyumlu.
*   **✨ Özel Efektler:** Yılbaşına özel kar efekti ve cam (glassmorphism) tasarımlar.
*   **📨 İletişim Formu:** Ziyaretçilerin doğrudan admin ile iletişime geçebileceği entegre form.

## 💻 Teknolojiler

Bu proje, güçlü ve ölçeklenebilir MERN (MongoDB, Express, React, Node.js) yığını kullanılarak geliştirilmiştir.

| Alan | Teknolojiler |
| --- | --- |
| **Frontend** | React, TypeScript, Vite, CSS3 (Glassmorphism), Lucide React (Icons) |
| **Backend** | Node.js, Express.js |
| **Veritabanı** | MongoDB, Mongoose |
| **Durum Yönetimi** | React Context API |

## 🚀 Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### Ön Gereksinimler

*   Node.js (v14 veya üzeri)
*   MongoDB (Yerel veya Atlas URL)

### Adım 1: Repoyu Kopyalayın

```bash
git clone https://github.com/Beratemek/emek-shop.git
cd emek-shop
```

### Adım 2: Bağımlılıkları Yükleyin

Hem sunucu hem de istemci için gerekli paketleri yükleyin.

**Server (Backend):**
```bash
cd server
npm install
```

**Client (Frontend):**
```bash
cd ../client
npm install
```

### Adım 3: Çevresel Değişkenleri Ayarlayın (.env)

`server` klasörü içinde `.env` dosyası oluşturun ve aşağıdaki ayarları ekleyin:

```env
CONNECTION_URL=mongodb+srv://<kullanici-adi>:<sifre>@cluster0.mongodb.net/emekshop
PORT=5000
SECRET=gizli_anahtar_kelimeniz
```

### Adım 4: Uygulamayı Başlatın

**Backend'i Başlat:**
```bash
cd server
npm start
```

**Frontend'i Başlat:**
```bash
cd client
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı görüntüleyebilirsiniz.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

<div align="center">
  <sub>Developed by Berat Emek with ❤️</sub>
</div>
