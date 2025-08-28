# 📰 Portal Berita Neo-Brutalism

Website berita modern dengan desain neo-brutalism yang unik, dibangun menggunakan Django (backend) dan ReactJS (frontend).

## 🎨 Fitur Utama

### 👥 Sistem User
- **Admin**: Akses penuh untuk mengelola berita, kategori, dan user
- **User**: Dapat registrasi, login, membuat/edit berita, dan mengelola profil

### 📰 Manajemen Berita
- CRUD berita lengkap (judul, isi, gambar, kategori)
- Upload gambar untuk berita
- Publikasi/draft berita
- Pencarian dan filter kategori

### 🛠️ Dashboard Admin
- Statistik website (jumlah berita, user, kategori)
- Manajemen user (activate/deactivate, promote/demote admin)
- Manajemen kategori berita
- Overview berita terbaru

### 🎨 Desain Neo-Brutalism
- Warna-warna bold dan kontras tinggi
- Border tebal dan shadow yang mencolok
- Typography yang kuat dan tegas
- Animasi interaktif (hover, shake, bounce)

## 🔧 Teknologi yang Digunakan

### Backend
- **Django 5.2.5** - Web framework
- **Django REST Framework** - API backend
- **Django CORS Headers** - CORS handling
- **Pillow** - Image processing
- **JWT Authentication** - Token-based auth
- **SQLite** - Database (default)

### Frontend
- **ReactJS** - Frontend framework
- **React Router** - Navigation
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **React Bootstrap** - React components

- ## 🚀 Instalasi dan Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm atau yarn

### Login untuk Admin 
Username : aldo
Password : Alfredo123

### Login untuk User 
Username : aldo
Password : Alfredo123

### 1. Clone Repository
```bash
git clone https://github.com/your-username/news-website.git
cd news-website

###2. Setup Backend
# Masuk ke folder backend
cd backend

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Jalankan migrasi database
python manage.py makemigrations
python manage.py migrate

# Buat superuser (admin)
python manage.py createsuperuser

# Jalankan development server
python manage.py runserver

Backend akan berjalan di: http://localhost:8000


###3. Setup Frontend
Buka terminal baru:

bash

Copy
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm start

Frontend akan berjalan di: http://localhost:3000

