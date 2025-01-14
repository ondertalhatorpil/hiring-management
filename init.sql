-- Create database
CREATE DATABASE IF NOT EXISTS onder DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE onder;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(50) NOT NULL,
    soyad VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cinsiyet ENUM('Erkek', 'Kadın', 'Diğer'),
    mezuniyet VARCHAR(100),
    medeni_durum VARCHAR(20),
    askerlik_durumu VARCHAR(50),
    surucu_belgesi VARCHAR(20),
    dogum_tarihi DATE,
    ev_adresi TEXT,
    cep_telefonu VARCHAR(20),
    ikinci_cep_telefonu VARCHAR(20),
    job_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (ad, soyad, email) values ('admin','admin','admin@onder.org');

-- Education information table
CREATE TABLE egitim (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    okul_adi VARCHAR(100) NOT NULL,
    bolum VARCHAR(100),
    baslangic_tarihi DATE,
    bitis_tarihi DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Areas of interest table
CREATE TABLE ilgi_alanlari (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ilgi_alani VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Work experience table
CREATE TABLE is_deneyimi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    firma_adi VARCHAR(100) NOT NULL,
    pozisyon VARCHAR(100) NOT NULL,
    baslangic_tarihi DATE,
    bitis_tarihi DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Certificates table
CREATE TABLE sertifika (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sertifika_adi VARCHAR(100) NOT NULL,
    alindi_tarihi DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Foreign language proficiency table
CREATE TABLE yabanci_dil (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dil_adi VARCHAR(50) NOT NULL,
    seviye VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- References table
CREATE TABLE referanslar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    referans_adi VARCHAR(100) NOT NULL,
    referans_iletisim VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Job listings for international positions
CREATE TABLE yurt_ilanlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    job_id INT,
    ilan_basligi VARCHAR(200) NOT NULL,
    firma_adi VARCHAR(100) NOT NULL,
    ilan_tarihi DATE NOT NULL,
    is_tipi VARCHAR(50),
    sehir VARCHAR(100),
    detaylar TEXT,
    maas VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Job listings for domestic positions
CREATE TABLE merkez_ilanlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    job_id INT,
    ilan_basligi VARCHAR(200) NOT NULL,
    firma_adi VARCHAR(100) NOT NULL,
    ilan_tarihi DATE NOT NULL,
    is_tipi VARCHAR(50),
    sehir VARCHAR(100),
    detaylar TEXT,
    maas VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Job applications table
CREATE TABLE basvurular (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ilan_id INT NOT NULL,
    ilan_type VARCHAR(10),
    basvuru_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- CV documents table
CREATE TABLE cv (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- User photos table
CREATE TABLE user_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Archived international job listings
CREATE TABLE arsiv_yurt_ilanlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    job_id INT,
    ilan_basligi VARCHAR(200) NOT NULL,
    firma_adi VARCHAR(100) NOT NULL,
    ilan_tarihi DATE NOT NULL,
    is_tipi VARCHAR(50),
    sehir VARCHAR(100),
    detaylar TEXT,
    maas VARCHAR(100),
    arsiv_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP
);

-- Archived domestic job listings
CREATE TABLE arsiv_merkez_ilanlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    job_id INT,
    ilan_basligi VARCHAR(200) NOT NULL,
    firma_adi VARCHAR(100) NOT NULL,
    ilan_tarihi DATE NOT NULL,
    is_tipi VARCHAR(50),
    sehir VARCHAR(100),
    detaylar TEXT,
    maas VARCHAR(100),
    arsiv_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP
);

-- Sliders table for website carousel
CREATE TABLE sliders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_basvurular_ilan ON basvurular(ilan_id);
CREATE INDEX idx_basvurular_user ON basvurular(user_id);
CREATE INDEX idx_yurt_ilanlar_tarih ON yurt_ilanlar(ilan_tarihi);
CREATE INDEX idx_merkez_ilanlar_tarih ON merkez_ilanlar(ilan_tarihi);