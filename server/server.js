const express = require('express');
const mysql = require("mysql2");
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();
const port = 8082;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost' || db,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1453Abdullah*',
    database: process.env.DB_NAME || 'onder',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error("Veri Tabanına Bağlanırken Hata Oluştu", err);
        return;
    }
    console.log("Veritabanına Başarıyla Bağlanıldı.");
});

app.get('/api/users/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.get('/api/egitim/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.query('SELECT * FROM egitim WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.post('/api/users', (req, res) => {
    const { 
        ad, 
        soyad,
        email, 
        cinsiyet, 
        mezuniyet, 
        medeni_durum,
        askerlik_durumu, 
        surucu_belgesi, 
        dogum_tarihi, 
        ev_adresi, 
        cep_telefonu, 
        ikinci_cep_telefonu,
        job_id
    } = req.body;

    // job_id kontrolü ekleyelim
    const jobIdValue = job_id ? job_id : null;

    db.query(
        'INSERT INTO users (ad, soyad, email, cinsiyet, mezuniyet, medeni_durum, askerlik_durumu, surucu_belgesi, dogum_tarihi, ev_adresi, cep_telefonu, ikinci_cep_telefonu, job_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [ad, soyad, email, cinsiyet, mezuniyet, medeni_durum, askerlik_durumu, surucu_belgesi, dogum_tarihi, ev_adresi, cep_telefonu, ikinci_cep_telefonu, jobIdValue],
        (err, results) => {
            if (err) {
                console.error('Kullanıcı kayıt hatası:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ 
                message: 'Kullanıcı başarıyla kaydedildi',
                user_id: results.insertId 
            });
        }
    );
});


// Eğitim bilgileri için GET ve POST API'leri
app.get('/api/egitim/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.query('SELECT * FROM egitim WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.post('/api/egitim', async (req, res) => {
    const { egitimBilgileri, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID gereklidir' });
    }

    try {
        for (const egitim of egitimBilgileri) {
            await new Promise((resolve, reject) => {
                db.query(
                    'INSERT INTO egitim (user_id, okul_adi, bolum, baslangic_tarihi, bitis_tarihi) VALUES (?, ?, ?, ?, ?)',
                    [userId, egitim.okul_adi, egitim.bolum, egitim.baslangic_tarihi, egitim.bitis_tarihi],
                    (err, result) => {
                        if (err) {
                            console.error('Eğitim kaydı hatası:', err);
                            return reject(err);
                        }
                        resolve(result);
                    }
                );
            });
        }
        res.status(201).json({ message: 'Eğitim bilgileri başarıyla kaydedildi' });
    } catch (error) {
        console.error('Eğitim kayıt hatası:', error);
        res.status(500).json({ error: error.message || 'Eğitim bilgileri kaydedilirken bir hata oluştu' });
    }
});


// İlgi alanları için GET API
app.get('/api/ilgi-alanlari/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.query('SELECT * FROM ilgi_alanlari WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// İlgi alanları için POST API
app.post('/api/ilgi_alanlari', async (req, res) => {
    const { ilgiAlanlari, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID gereklidir' });
    }

    try {
        for (const ilgi of ilgiAlanlari) {
            await new Promise((resolve, reject) => {
                db.query(
                    'INSERT INTO ilgi_alanlari (user_id, ilgi_alani) VALUES (?, ?)',
                    [userId, ilgi.ilgi_alani],
                    (err, result) => {
                        if (err) {
                            console.error('İlgi alanı kaydı hatası:', err);
                            return reject(err);
                        }
                        resolve(result);
                    }
                );
            });
        }
        res.status(201).json({ message: 'İlgi alanları başarıyla kaydedildi' });
    } catch (error) {
        console.error('İlgi alanları kayıt hatası:', error);
        res.status(500).json({ error: error.message || 'İlgi alanları kaydedilirken bir hata oluştu' });
    }
});



// İş deneyimi için GET ve POST API'leri
app.get('/api/is-deneyimi/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.query('SELECT * FROM is_deneyimi WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.post('/api/is_deneyimi', async (req, res) => {
    const { isDeneyimiBilgileri, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID gereklidir' });
    }

    try {
        for (const deneyim of isDeneyimiBilgileri) {
            await new Promise((resolve, reject) => {
                db.query(
                    'INSERT INTO is_deneyimi (user_id, firma_adi, pozisyon, baslangic_tarihi, bitis_tarihi) VALUES (?, ?, ?, ?, ?)',
                    [userId, deneyim.firma_adi, deneyim.pozisyon, deneyim.baslangic_tarihi, deneyim.bitis_tarihi],
                    (err, result) => {
                        if (err) {
                            console.error('İş deneyimi kaydı hatası:', err);
                            return reject(err);
                        }
                        resolve(result);
                    }
                );
            });
        }
        res.status(201).json({ message: 'İş deneyimi bilgileri başarıyla kaydedildi' });
    } catch (error) {
        console.error('İş deneyimi kayıt hatası:', error);
        res.status(500).json({ error: error.message || 'İş deneyimi bilgileri kaydedilirken bir hata oluştu' });
    }
});


// Sertifika için GET ve POST API'leri
app.get('/api/sertifika/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.query('SELECT * FROM sertifika WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.post('/api/sertifika', async (req, res) => {
    const { sertifikaBilgileri, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID gereklidir' });
    }

    try {
        for (const sertifika of sertifikaBilgileri) {
            await new Promise((resolve, reject) => {
                db.query(
                    'INSERT INTO sertifika (user_id, sertifika_adi, alindi_tarihi) VALUES (?, ?, ?)',
                    [userId, sertifika.sertifika_adi, sertifika.alindi_tarihi],
                    (err, result) => {
                        if (err) {
                            console.error('Sertifika kaydı hatası:', err);
                            return reject(err);
                        }
                        resolve(result);
                    }
                );
            });
        }
        res.status(201).json({ message: 'Sertifika bilgileri başarıyla kaydedildi' });
    } catch (error) {
        console.error('Sertifika kayıt hatası:', error);
        res.status(500).json({ error: error.message || 'Sertifika bilgileri kaydedilirken bir hata oluştu' });
    }
});


// Yabancı dil için GET ve POST API'leri
app.get('/api/yabanci-dil/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.query('SELECT * FROM yabanci_dil WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.post('/api/yabanci_dil', async (req, res) => {
    const { yabanciDilBilgileri, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID gereklidir' });
    }

    try {
        for (const dil of yabanciDilBilgileri) {
            await new Promise((resolve, reject) => {
                db.query(
                    'INSERT INTO yabanci_dil (user_id, dil_adi, seviye) VALUES (?, ?, ?)',
                    [userId, dil.dil_adi, dil.seviye],
                    (err, result) => {
                        if (err) {
                            console.error('Yabancı dil kaydı hatası:', err);
                            return reject(err);
                        }
                        resolve(result);
                    }
                );
            });
        }
        res.status(201).json({ message: 'Yabancı dil bilgileri başarıyla kaydedildi' });
    } catch (error) {
        console.error('Yabancı dil kayıt hatası:', error);
        res.status(500).json({ error: error.message || 'Yabancı dil bilgileri kaydedilirken bir hata oluştu' });
    }
});


// Referans bilgileri için GET API
app.get('/api/referanslar/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.query('SELECT * FROM referanslar WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.post('/api/referanslar', async (req, res) => {
    const { referansBilgileri, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID gereklidir' });
    }

    try {
        for (const referans of referansBilgileri) {
            await new Promise((resolve, reject) => {
                db.query(
                    'INSERT INTO referanslar (user_id, referans_adi, referans_iletisim) VALUES (?, ?, ?)',
                    [userId, referans.referans_adi, referans.referans_iletisim],
                    (err, result) => {
                        if (err) {
                            console.error('Referans kaydı hatası:', err);
                            return reject(err);
                        }
                        resolve(result);
                    }
                );
            });
        }
        res.status(201).json({ message: 'Referans bilgileri başarıyla kaydedildi' });
    } catch (error) {
        console.error('Referans kayıt hatası:', error);
        res.status(500).json({ error: error.message || 'Referans bilgileri kaydedilirken bir hata oluştu' });
    }
});





// yurt_ilanlar için GET endpoint
app.get('/api/yurt-ilanlar', (req, res) => {
    db.query('SELECT * FROM yurt_ilanlar', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// yurt_ilanlar için GET endpoint (belirli bir id ile)
app.get('/api/yurt-ilanlar/:id', (req, res) => {
    const ilanId = req.params.id;  // :id parametresini al
    db.query('SELECT * FROM yurt_ilanlar WHERE id = ?', [ilanId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Eğer sonuç boşsa (ilan bulunamadıysa) 404 dönebiliriz
        if (results.length === 0) {
            return res.status(404).json({ message: 'İlan bulunamadı.' });
        }

        // Sonucu döndür
        res.json(results[0]); // Tek bir ilan döneceği için ilk elemanı döndür
    });
});



app.post('/api/yurt-ilanlar', (req, res) => {
    const ilan = {
        user_id: req.body.user_id, // Kullanıcı ID
        job_id: req.body.job_id,
        ilan_basligi: req.body.ilan_basligi, // İlan başlığı
        firma_adi: req.body.firma_adi, // Firma adı
        ilan_tarihi: req.body.ilan_tarihi, // İlan tarihi
        is_tipi: req.body.is_tipi, // İş tipi
        sehir: req.body.sehir, // Şehir
        detaylar: req.body.detaylar, // Detaylar
        maas: req.body.maas, // Maaş
    };

    db.query('INSERT INTO yurt_ilanlar SET ?', ilan, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, ...ilan });
    });
});




// merkez_ilanlar için GET endpoint
app.get('/api/merkez-ilanlar', (req, res) => {
    db.query('SELECT * FROM merkez_ilanlar', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// merkez_ilanlar için GET endpoint (belirli bir id ile)
app.get('/api/merkez-ilanlar/:id', (req, res) => {
    const ilanId = req.params.id;  // :id parametresini al
    db.query('SELECT * FROM merkez_ilanlar WHERE id = ?', [ilanId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Eğer sonuç boşsa (ilan bulunamadıysa) 404 dönebiliriz
        if (results.length === 0) {
            return res.status(404).json({ message: 'İlan bulunamadı.' });
        }

        // Sonucu döndür
        res.json(results[0]); // Tek bir ilan döneceği için ilk elemanı döndür
    });
});


app.post('/api/merkez-ilanlar', (req, res) => {
    const ilan = {
        user_id: req.body.user_id, // Kullanıcı ID
        job_id: req.body.job_id,
        ilan_basligi: req.body.ilan_basligi, // İlan başlığı
        firma_adi: req.body.firma_adi, // Firma adı
        ilan_tarihi: req.body.ilan_tarihi, // İlan tarihi
        is_tipi: req.body.is_tipi, // İş tipi
        sehir: req.body.sehir, // Şehir
        detaylar: req.body.detaylar, // Detaylar
        maas: req.body.maas, // Maaş
    };

    db.query('INSERT INTO merkez_ilanlar SET ?', ilan, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, ...ilan });
    });
});


app.post('/api/basvurular', (req, res) => {
    const { userId, ilanId } = req.body;
    
    // Gelen verileri kontrol et
    if (!userId || !ilanId) {
        return res.status(400).json({ 
            error: "userId ve ilanId zorunludur" 
        });
    }

    const basvuru = {
        user_id: userId,
        ilan_id: ilanId,
        ilan_type: req.body.ilantype == "merkez" ? "merkez": "yurt",
        basvuru_tarihi: new Date() // İsteğe bağlı: başvuru tarihini otomatik ekle
    };

    db.query('INSERT INTO basvurular SET ?', basvuru, (err, result) => {
        if (err) {
            console.error('Başvuru kayıt hatası:', err);
            return res.status(500).json({ 
                error: err.message 
            });
        }
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Başvuru başarıyla kaydedildi',
            ...basvuru 
        });
    });
});


app.get('/api/basvurular/:ilan_id', async (req, res) => {
    const ilanId = req.params.ilan_id;

    try {
        const [basvurular] = await db.promise().query(
            'SELECT user_id FROM basvurular WHERE ilan_id = ?',
            [ilanId]
        );

        if (basvurular.length === 0) {
            return res.status(404).json({ message: 'Bu ilan için başvuru bulunamadı.' });
        }

        const userIds = basvurular.map(basvuru => basvuru.user_id);

        // Tüm tablolardan verileri paralel olarak al
        const [users, egitimler, ilgiAlanlari, sertifikalar, yabanciDiller, referanslar, isDeneyimleri] = 
            await Promise.all([
                db.promise().query('SELECT * FROM users WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM egitim WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM ilgi_alanlari WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM sertifika WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM yabanci_dil WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM referanslar WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM is_deneyimi WHERE user_id IN (?)', [userIds])
            ]);

        // Her kullanıcı için tüm bilgileri birleştir
        const detayliBasvurular = users[0].map(user => {
            return {
                ...user,
                egitim_bilgileri: egitimler[0].filter(egitim => egitim.user_id === user.user_id),
                ilgi_alanlari: ilgiAlanlari[0].filter(ilgi => ilgi.user_id === user.user_id),
                sertifikalar: sertifikalar[0].filter(sertifika => sertifika.user_id === user.user_id),
                yabanci_diller: yabanciDiller[0].filter(dil => dil.user_id === user.user_id),
                referanslar: referanslar[0].filter(referans => referans.user_id === user.user_id),
                is_deneyimleri: isDeneyimleri[0].filter(deneyim => deneyim.user_id === user.user_id)
            };
        });

        res.json(detayliBasvurular);

    } catch (error) {
        console.error('Veri çekme hatası:', error);
        res.status(500).json({ 
            error: 'Veritabanı hatası',
            details: error.message 
        });
    }
});


app.get('/api/tum-basvurular/yurt', async (req, res) => {
    try {
        // Önce tüm yurt ilanlarını al
        const [ilanlar] = await db.promise().query('SELECT * FROM yurt_ilanlar');

        // Her ilan için başvuruları ve detayları al
        const detayliIlanlar = await Promise.all(ilanlar.map(async (ilan) => {
            // İlana ait başvuruları bul
            const [basvurular] = await db.promise().query(
                'SELECT user_id FROM basvurular WHERE ilan_id = ? AND ilan_type="yurt"',
                [ilan.id]
            );

            if (basvurular.length === 0) {
                return {
                    ilan_detay: ilan,
                    basvuranlar: []
                };
            }

            const userIds = basvurular.map(basvuru => basvuru.user_id);

            const [
                users,
                egitimler,
                ilgiAlanlari,
                sertifikalar,
                yabanciDiller,
                referanslar,
                isDeneyimleri,
                photos // Yeni eklenen
            ] = await Promise.all([
                db.promise().query('SELECT * FROM users WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM egitim WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM ilgi_alanlari WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM sertifika WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM yabanci_dil WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM referanslar WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM is_deneyimi WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM user_photos WHERE user_id IN (?)', [userIds]) // Yeni eklenen
            ]);
    

            const detayliBasvuranlar = users[0].map(user => ({
                ...user,
                egitim_bilgileri: egitimler[0].filter(egitim => egitim.user_id === user.user_id),
                ilgi_alanlari: ilgiAlanlari[0].filter(ilgi => ilgi.user_id === user.user_id),
                sertifikalar: sertifikalar[0].filter(sertifika => sertifika.user_id === user.user_id),
                yabanci_diller: yabanciDiller[0].filter(dil => dil.user_id === user.user_id),
                referanslar: referanslar[0].filter(referans => referans.user_id === user.user_id),
                is_deneyimleri: isDeneyimleri[0].filter(deneyim => deneyim.user_id === user.user_id),
                photo: photos[0].find(photo => photo.user_id === user.user_id) || null // Yeni eklenen
            }));


            return {
                ilan_detay: ilan,
                basvuranlar: detayliBasvuranlar,
                basvuru_sayisi: detayliBasvuranlar.length
            };
        }));

        res.json({
            toplam_ilan_sayisi: ilanlar.length,
            ilanlar: detayliIlanlar
        });

    } catch (error) {
        console.error('Veri çekme hatası:', error);
        res.status(500).json({
            error: 'Veritabanı hatası',
            details: error.message
        });
    }
});

app.get('/api/tum-basvurular/merkez', async (req, res) => {
    try {
        // Önce tüm merkez ilanlarını al
        const [ilanlar] = await db.promise().query('SELECT * FROM merkez_ilanlar');

        // Her ilan için başvuruları ve detayları al
        const detayliIlanlar = await Promise.all(ilanlar.map(async (ilan) => {
            // İlana ait başvuruları bul
            const [basvurular] = await db.promise().query(
                'SELECT user_id FROM basvurular WHERE ilan_id = ? AND ilan_type="merkez"',
                [ilan.id]
            );

            if (basvurular.length === 0) {
                return {
                    ilan_detay: ilan,
                    basvuranlar: []
                };
            }

            const userIds = basvurular.map(basvuru => basvuru.user_id);

            // Tüm ilişkili tabloları sorgula (photos eklenmiş hali)
            const [
                users,
                egitimler,
                ilgiAlanlari,
                sertifikalar,
                yabanciDiller,
                referanslar,
                isDeneyimleri,
                cv,
                photos // Yeni eklenen photos sorgusu
            ] = await Promise.all([
                db.promise().query('SELECT * FROM users WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM egitim WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM ilgi_alanlari WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM sertifika WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM yabanci_dil WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM referanslar WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM is_deneyimi WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM cv WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM user_photos WHERE user_id IN (?)', [userIds]) // Yeni eklenen sorgu
            ]);

            // Her başvuran için detaylı bilgileri birleştir (photo eklenmiş hali)
            const detayliBasvuranlar = users[0].map(user => ({
                ...user,
                egitim_bilgileri: egitimler[0].filter(egitim => egitim.user_id === user.user_id),
                ilgi_alanlari: ilgiAlanlari[0].filter(ilgi => ilgi.user_id === user.user_id),
                sertifikalar: sertifikalar[0].filter(sertifika => sertifika.user_id === user.user_id),
                yabanci_diller: yabanciDiller[0].filter(dil => dil.user_id === user.user_id),
                referanslar: referanslar[0].filter(referans => referans.user_id === user.user_id),
                is_deneyimleri: isDeneyimleri[0].filter(deneyim => deneyim.user_id === user.user_id),
                cv: cv[0].filter(cvs => cvs.user_id === user.user_id),
                photo: photos[0].find(photo => photo.user_id === user.user_id) || null // Yeni eklenen alan
            }));

            return {
                ilan_detay: ilan,
                basvuranlar: detayliBasvuranlar,
                basvuru_sayisi: detayliBasvuranlar.length
            };
        }));

        res.json({
            toplam_ilan_sayisi: ilanlar.length,
            ilanlar: detayliIlanlar
        });

    } catch (error) {
        console.error('Veri çekme hatası:', error);
        res.status(500).json({
            error: 'Veritabanı hatası',
            details: error.message
        });
    }
});



// Yurt ilanlarını listeleme endpoint'i
app.get('/api/yurt-ilanlar', (req, res) => {
    db.query('SELECT * FROM yurt_ilanlar ORDER BY ilan_tarihi DESC', (err, results) => {
        if (err) {
            console.error("Yurt ilanları getirme hatası:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Merkez ilanlarını listeleme endpoint'i
app.get('/api/merkez-ilanlar', (req, res) => {
    db.query('SELECT * FROM merkez_ilanlar ORDER BY ilan_tarihi DESC', (err, results) => {
        if (err) {
            console.error("Merkez ilanları getirme hatası:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Yurt ilanını arşive taşıma endpoint'i
app.post('/api/arsiv/yurt-ilan/:id', async (req, res) => {
    const ilanId = req.params.id;
    
    try {
        // İlanı getir
        const [ilan] = await db.promise().query(
            'SELECT * FROM yurt_ilanlar WHERE id = ?', 
            [ilanId]
        );
        
        if (!ilan || ilan.length === 0) {
            return res.status(404).json({ 
                message: 'İlan bulunamadı',
                error: true 
            });
        }

        // İlanı arşive ekle
        await db.promise().query(
            'INSERT INTO arsiv_yurt_ilanlar SET ?', 
            {...ilan[0], arsiv_tarihi: new Date()}
        );
        
        // Orijinal ilanı sil
        await db.promise().query(
            'DELETE FROM yurt_ilanlar WHERE id = ?', 
            [ilanId]
        );
        
        res.json({ 
            message: 'İlan başarıyla arşivlendi',
            success: true
        });
    } catch (error) {
        console.error('Arşivleme hatası:', error);
        res.status(500).json({ 
            error: error.message,
            message: 'İlan arşivlenirken bir hata oluştu'
        });
    }
});


app.post('/api/arsiv/merkez-ilan/:id', async (req, res) => {
    const ilanId = req.params.id;
    
    try {
        // İlanı getir
        const [ilan] = await db.promise().query(
            'SELECT * FROM merkez_ilanlar WHERE id = ?', 
            [ilanId]
        );
        
        if (!ilan || ilan.length === 0) {
            return res.status(404).json({ 
                message: 'İlan bulunamadı',
                error: true 
            });
        }

        // İlanı arşive ekle
        await db.promise().query(
            'INSERT INTO arsiv_merkez_ilanlar SET ?', 
            {...ilan[0], arsiv_tarihi: new Date()}
        );
        
        // Orijinal ilanı sil
        await db.promise().query(
            'DELETE FROM merkez_ilanlar WHERE id = ?', 
            [ilanId]
        );
        
        res.json({ 
            message: 'İlan başarıyla arşivlendi',
            success: true
        });
    } catch (error) {
        console.error('Arşivleme hatası:', error);
        res.status(500).json({ 
            error: error.message,
            message: 'İlan arşivlenirken bir hata oluştu'
        });
    }
});


// Uploads dizinini oluştur
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Routes
app.post('/api/users', async (req, res) => {
    const userData = req.body;
    try {
        const [result] = await db.promise().query('INSERT INTO users SET ?', userData);
        res.status(201).json({ user_id: result.insertId, message: 'Kullanıcı başarıyla oluşturuldu' });
    } catch (error) {
        console.error('Kullanıcı oluşturma hatası:', error);
        res.status(500).json({ error: 'Kullanıcı oluşturulurken bir hata oluştu' });
    }
});

app.post('/api/upload-cv', upload.single('cv'), async (req, res) => {
    console.log('CV yükleme isteği alındı');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);

    if (!req.file) {
        console.log('Dosya yüklenmedi');
        return res.status(400).send('Dosya yüklenmedi');
    }

    const { userId } = req.body;
    console.log('userId:', userId);

    try {
        const query = 'INSERT INTO cv (user_id, file_path) VALUES (?, ?)';
        console.log('SQL sorgusu:', query);
        console.log('Değerler:', [userId, req.file.path]);

        const [result] = await db.promise().query(query, [userId, req.file.path]);
        console.log('Sorgu sonucu:', result);

        res.status(201).json({ message: 'CV başarıyla yüklendi', filePath: req.file.path });
    } catch (error) {
        console.error('CV yükleme hatası:', error);
        res.status(500).json({ error: 'CV yüklenirken bir hata oluştu', details: error.message, stack: error.stack });
    }
});

app.get('/api/cv/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const [cvs] = await db.promise().query('SELECT * FROM cv WHERE user_id = ?', [userId]);
        res.json(cvs);
    } catch (error) {
        console.error('CV getirme hatası:', error);
        res.status(500).json({ error: 'CV ler getirilirken bir hata oluştu', details: error.message });
    }
});


app.get('/api/download-cv/:id', async (req, res) => {
    try {
      const cvId = req.params.id;
      const [cvRows] = await db.promise().query('SELECT * FROM cv WHERE id = ?', [cvId]);
      
      if (cvRows.length === 0) {
        return res.status(404).send('CV bulunamadı');
      }
  
      const cv = cvRows[0];
      const filePath = cv.file_path;
  
      if (!fs.existsSync(filePath)) {
        return res.status(404).send('Dosya bulunamadı');
      }
  
      res.download(filePath, cv.original_filename || 'cv.pdf');
    } catch (error) {
      console.error('CV indirme hatası:', error);
      res.status(500).send('CV indirilirken bir hata oluştu');
    }
  });

  app.get('/api/tum-basvurular/merkez', async (req, res) => {
    try {
        // Önce tüm merkez ilanlarını al
        const [ilanlar] = await db.promise().query('SELECT * FROM merkez_ilanlar');

        // Her ilan için başvuruları ve detayları al
        const detayliIlanlar = await Promise.all(ilanlar.map(async (ilan) => {
            // İlana ait başvuruları bul
            const [basvurular] = await db.promise().query(
                'SELECT user_id FROM basvurular WHERE ilan_id = ?',
                [ilan.id]
            );

            if (basvurular.length === 0) {
                return {
                    ilan_detay: ilan,
                    basvuranlar: []
                };
            }

            const userIds = basvurular.map(basvuru => basvuru.user_id);

            // Tüm ilişkili tabloları sorgula (photos eklenmiş hali)
            const [
                users,
                egitimler,
                ilgiAlanlari,
                sertifikalar,
                yabanciDiller,
                referanslar,
                isDeneyimleri,
                cv,
                photos // Yeni eklenen photos sorgusu
            ] = await Promise.all([
                db.promise().query('SELECT * FROM users WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM egitim WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM ilgi_alanlari WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM sertifika WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM yabanci_dil WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM referanslar WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM is_deneyimi WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM cv WHERE user_id IN (?)', [userIds]),
                db.promise().query('SELECT * FROM user_photos WHERE user_id IN (?)', [userIds]) // Yeni eklenen sorgu
            ]);

            // Her başvuran için detaylı bilgileri birleştir (photo eklenmiş hali)
            const detayliBasvuranlar = users[0].map(user => ({
                ...user,
                egitim_bilgileri: egitimler[0].filter(egitim => egitim.user_id === user.user_id),
                ilgi_alanlari: ilgiAlanlari[0].filter(ilgi => ilgi.user_id === user.user_id),
                sertifikalar: sertifikalar[0].filter(sertifika => sertifika.user_id === user.user_id),
                yabanci_diller: yabanciDiller[0].filter(dil => dil.user_id === user.user_id),
                referanslar: referanslar[0].filter(referans => referans.user_id === user.user_id),
                is_deneyimleri: isDeneyimleri[0].filter(deneyim => deneyim.user_id === user.user_id),
                cv: cv[0].filter(cvs => cvs.user_id === user.user_id),
                photo: photos[0].find(photo => photo.user_id === user.user_id) || null // Yeni eklenen alan
            }));

            return {
                ilan_detay: ilan,
                basvuranlar: detayliBasvuranlar,
                basvuru_sayisi: detayliBasvuranlar.length
            };
        }));

        res.json({
            toplam_ilan_sayisi: ilanlar.length,
            ilanlar: detayliIlanlar
        });

    } catch (error) {
        console.error('Veri çekme hatası:', error);
        res.status(500).json({
            error: 'Veritabanı hatası',
            details: error.message
        });
    }
});


// Fotoğraflar için uploads/photos dizini oluştur
const photoUploadsDir = path.join(__dirname, 'uploads', 'photos');
if (!fs.existsSync(photoUploadsDir)) {
    fs.mkdirSync(photoUploadsDir, { recursive: true });
}

// Fotoğraf yükleme için multer konfigürasyonu
const photoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, photoUploadsDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const photoUpload = multer({
    storage: photoStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Sadece resim dosyalarına izin ver
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
        }
        cb(null, true);
    }
});

// Fotoğraf yükleme endpoint'i
app.post('/api/upload-photo', photoUpload.single('photo'), async (req, res) => {
    console.log('Fotoğraf yükleme isteği alındı');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);

    if (!req.file) {
        console.log('Dosya yüklenmedi');
        return res.status(400).send('Dosya yüklenmedi');
    }

    const { userId } = req.body;
    console.log('userId:', userId);

    try {
        const query = 'INSERT INTO user_photos (user_id, file_path) VALUES (?, ?)';
        console.log('SQL sorgusu:', query);
        console.log('Değerler:', [userId, req.file.path]);

        const [result] = await db.promise().query(query, [userId, req.file.path]);
        console.log('Sorgu sonucu:', result);

        res.status(201).json({ 
            message: 'Fotoğraf başarıyla yüklendi', 
            filePath: req.file.path 
        });
    } catch (error) {
        console.error('Fotoğraf yükleme hatası:', error);
        res.status(500).json({ 
            error: 'Fotoğraf yüklenirken bir hata oluştu', 
            details: error.message 
        });
    }
});

// Fotoğraf getirme endpoint'i
app.get('/api/photo/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const [photos] = await db.promise().query(
            'SELECT * FROM user_photos WHERE user_id = ? ORDER BY id DESC LIMIT 1', 
            [userId]
        );
        
        if (photos.length === 0) {
            return res.status(404).json({ message: 'Fotoğraf bulunamadı' });
        }

        const photo = photos[0];
        if (!fs.existsSync(photo.file_path)) {
            return res.status(404).json({ message: 'Dosya bulunamadı' });
        }

        res.sendFile(photo.file_path);
    } catch (error) {
        console.error('Fotoğraf getirme hatası:', error);
        res.status(500).json({ 
            error: 'Fotoğraf getirilirken bir hata oluştu', 
            details: error.message 
        });
    }
});

// Fotoğraf silme endpoint'i (isteğe bağlı)
app.delete('/api/photo/:photoId', async (req, res) => {
    const photoId = req.params.photoId;

    try {
        // Önce fotoğraf bilgilerini al
        const [photos] = await db.promise().query(
            'SELECT * FROM user_photos WHERE id = ?', 
            [photoId]
        );

        if (photos.length === 0) {
            return res.status(404).json({ message: 'Fotoğraf bulunamadı' });
        }

        // Dosyayı fiziksel olarak sil
        const photo = photos[0];
        if (fs.existsSync(photo.file_path)) {
            fs.unlinkSync(photo.file_path);
        }

        // Veritabanından kaydı sil
        await db.promise().query('DELETE FROM user_photos WHERE id = ?', [photoId]);

        res.json({ message: 'Fotoğraf başarıyla silindi' });
    } catch (error) {
        console.error('Fotoğraf silme hatası:', error);
        res.status(500).json({ 
            error: 'Fotoğraf silinirken bir hata oluştu', 
            details: error.message 
        });
    }
});

// Server.js'e eklenecek endpoint'ler
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [
            activeJobsResult,
            archivedJobsResult,
            totalApplicantsResult,
            recentApplicationsResult,
            applicationsByJobResult
        ] = await Promise.all([
            // Aktif iş ilanları sayısı (merkez ve yurt)
            db.promise().query(`
                SELECT 
                    (SELECT COUNT(*) FROM merkez_ilanlar) as merkez_count,
                    (SELECT COUNT(*) FROM yurt_ilanlar) as yurt_count
            `),
            
            // Arşivlenmiş iş ilanları sayısı
            db.promise().query(`
                SELECT 
                    (SELECT COUNT(*) FROM arsiv_merkez_ilanlar) as merkez_archived,
                    (SELECT COUNT(*) FROM arsiv_yurt_ilanlar) as yurt_archived
            `),
            
            // Toplam başvuran sayısı
            db.promise().query('SELECT COUNT(DISTINCT user_id) as total FROM basvurular'),
            
            // Son 5 başvuru
            db.promise().query(`
                SELECT u.ad, u.soyad, u.email, b.basvuru_tarihi,
                    CASE 
                        WHEN mi.ilan_basligi IS NOT NULL THEN mi.ilan_basligi
                        ELSE yi.ilan_basligi
                    END as ilan_basligi
                FROM basvurular b
                JOIN users u ON b.user_id = u.user_id
                LEFT JOIN merkez_ilanlar mi ON b.ilan_id = mi.id
                LEFT JOIN yurt_ilanlar yi ON b.ilan_id = yi.id
                ORDER BY b.basvuru_tarihi DESC
                LIMIT 5
            `),
            
            // İlanlara göre başvuru dağılımı
            db.promise().query(`
                SELECT 
                    i.ilan_basligi,
                    COUNT(b.user_id) as basvuru_sayisi,
                    i.id,
                    'merkez' as type
                FROM merkez_ilanlar i
                LEFT JOIN basvurular b ON i.id = b.ilan_id
                GROUP BY i.id
                UNION ALL
                SELECT 
                    i.ilan_basligi,
                    COUNT(b.user_id) as basvuru_sayisi,
                    i.id,
                    'yurt' as type
                FROM yurt_ilanlar i
                LEFT JOIN basvurular b ON i.id = b.ilan_id
                GROUP BY i.id
                ORDER BY basvuru_sayisi DESC
            `)
        ]);

        res.json({
            activeJobs: {
                merkez: activeJobsResult[0][0].merkez_count,
                yurt: activeJobsResult[0][0].yurt_count,
                total: activeJobsResult[0][0].merkez_count + activeJobsResult[0][0].yurt_count
            },
            archivedJobs: {
                merkez: archivedJobsResult[0][0].merkez_archived,
                yurt: archivedJobsResult[0][0].yurt_archived,
                total: archivedJobsResult[0][0].merkez_archived + archivedJobsResult[0][0].yurt_archived
            },
            totalApplicants: totalApplicantsResult[0][0].total,
            recentApplications: recentApplicationsResult[0],
            applicationsByJob: applicationsByJobResult[0]
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.get('/api/sliders', async (req, res) => {
    try {
      const [rows] = await db.promise().query(
        'SELECT id, image_url, title, link_url FROM sliders WHERE is_active = 1 ORDER BY sort_order'
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Slider bulunamadı' });
      }
  
      res.json(rows);
    } catch (error) {
      console.error('Slider getirme hatası:', error);
      res.status(500).json({ error: 'Sliderlar getirilirken bir hata oluştu' });
    }
  });


  // Yeni slider ekle
app.post('/api/sliders', (req, res) => {
    const { title, image_url, link_url } = req.body;
  
    // Validasyon
    if (!title || !image_url) {
      return res.status(400).json({ error: 'Başlık ve resim URL\'si gereklidir' });
    }
  
    // Sort order için maksimum değeri al
    db.query('SELECT COALESCE(MAX(sort_order), 0) as maxOrder FROM sliders', (error, results) => {
      if (error) {
        console.error('Sort order hatası:', error);
        return res.status(500).json({ error: 'Slider eklenirken bir hata oluştu' });
      }
  
      const nextSortOrder = results[0].maxOrder + 1;
  
      // Yeni slider'ı ekle
      const query = `
        INSERT INTO sliders 
        (title, image_url, link_url, is_active, sort_order) 
        VALUES (?, ?, ?, 1, ?)
      `;
  
      db.query(
        query,
        [title, image_url, link_url, nextSortOrder],
        (error, results) => {
          if (error) {
            console.error('Slider ekleme hatası:', error);
            return res.status(500).json({ error: 'Slider eklenirken bir hata oluştu' });
          }
  
          res.status(201).json({
            message: 'Slider başarıyla eklendi',
            id: results.insertId
          });
        }
      );
    });
  });
  
  // Slider sil
  app.delete('/api/sliders/:id', (req, res) => {
    const sliderId = req.params.id;
  
    const query = 'DELETE FROM sliders WHERE id = ?';
    
    db.query(query, [sliderId], (error, results) => {
      if (error) {
        console.error('Slider silme hatası:', error);
        return res.status(500).json({ error: 'Slider silinirken bir hata oluştu' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Slider bulunamadı' });
      }
  
      res.json({ message: 'Slider başarıyla silindi' });
    });
  });
  
// Uygulamayı başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
