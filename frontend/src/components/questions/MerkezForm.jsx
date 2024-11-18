import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { FiArrowLeft } from "react-icons/fi";
import './css/MerkezForm.css'



const API_URL = process.env.REACT_APP_API_URL;


const MerkezForm = () => {


    const { id } = useParams();
    const navigate = useNavigate(); // useHistory yerine useNavigate kullanıyoruz

    const [merkezIlanlar, setMerkezIlanlar] = useState(null); // null ile başlatın
    const [loading, setLoading] = useState(true); // loading state ekleyin
    const [error] = useState(null);
    //const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [kvkkConsent, setKvkkConsent] = useState(false);


    const [user, setUser] = useState({
        ad: '',
        soyad: '',
        cinsiyet: '',
        mezuniyet: '',
        medeni_durum: '',
        surucu_belgesi: '',
        dogum_tarihi: '',
        email: '',
        ev_adresi: '',
        askerlik_durumu: '',
        job_id: '',
        cep_telefonu: '',
        ikinci_cep_telefonu: '',
        egitim: [{ okul_adi: '', bolum: '', baslangic_tarihi: '', bitis_tarihi: '' }],
        sertifika: [{ sertifika_adi: '', alindi_tarihi: '' }],
        is_deneyimi: [{ firma_adi: '', pozisyon: '', baslangic_tarihi: '', bitis_tarihi: '' }],
        yabanci_dil: [{ dil_adi: '', seviye: '' }],
        referans: [{ referans_adi: '', referans_iletisim: '' }],
        ilgi_alanlari: [{ ilgi_alani: '' }],
        cv: null,
        photo: null

    });

    const [photoPreview, setPhotoPreview] = useState(null);

    // Fotoğraf değişikliği için handler
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Dosya boyutu kontrolü (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
                return;
            }

            // Dosya tipi kontrolü
            if (!file.type.startsWith('image/')) {
                alert('Lütfen geçerli bir resim dosyası seçin');
                return;
            }

            // Önizleme oluştur
            const reader = new FileReader();
            reader.onload = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            setUser({ ...user, photo: file });
        }
    };



    useEffect(() => {
        // Component mount olduğunda
        console.log('Component mounted, id:', id);
        console.log('Current URL:', window.location.href);

        const fetchJobDetails = async () => {
            if (!id) {
                console.log('ID bulunamadı!');
                return;
            }
            console.log('Fetch işlemi başlatılıyor, id:', id);

            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/api/merkez-ilanlar/${id}`);
                console.log('API yanıtı:', response.data);
                setMerkezIlanlar(response.data)
            } catch (err) {
                console.error('API hatası:', err);

            }
        };

        fetchJobDetails();
    }, [id]);


    const handleFileChange = (e) => {
        setUser({ ...user, cv: e.target.files[0] });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleArrayChange = (e, index, field) => {
        const { name, value } = e.target;
        const newArray = [...user[field]];
        newArray[index][name] = value;
        setUser({ ...user, [field]: newArray });
    };

    const addToArray = (field) => {
        const newEntry = {};
        switch (field) {
            case 'egitim':
                newEntry.okul_adi = '';
                newEntry.bolum = '';
                newEntry.baslangic_tarihi = '';
                newEntry.bitis_tarihi = '';
                break;
            case 'is_deneyimi':
                newEntry.firma_adi = '';
                newEntry.pozisyon = '';
                newEntry.baslangic_tarihi = '';
                newEntry.bitis_tarihi = '';
                break;
            case 'sertifika':
                newEntry.sertifika_adi = '';
                newEntry.alindi_tarihi = '';
                break;
            case 'yabanci_dil':
                newEntry.dil_adi = '';
                newEntry.seviye = '';
                break;
            case 'referans':
                newEntry.referans_adi = '';
                newEntry.referans_iletisim = '';
                break;
            case 'ilgi_alanlari':
                newEntry.ilgi_alani = '';
                break;
            default:
                break;
        }
        setUser({ ...user, [field]: [...user[field], newEntry] });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!kvkkConsent) {
            alert('Lütfen KVKK metnini onaylayınız.');
            return;
        }

        try {
            const userData = {
                ad: user.ad,
                soyad: user.soyad,
                cinsiyet: user.cinsiyet,
                mezuniyet: user.mezuniyet,
                email: user.email,
                medeni_durum: user.medeni_durum,
                surucu_belgesi: user.surucu_belgesi,
                askerlik_durumu: user.askerlik_durumu,
                dogum_tarihi: user.dogum_tarihi,
                ev_adresi: user.ev_adresi,
                cep_telefonu: user.cep_telefonu,
                ikinci_cep_telefonu: user.ikinci_cep_telefonu,
                job_id: user.job_id
            };

            console.log('Gönderilecek kullanıcı verileri:', userData);

            const userResponse = await axios.post(`${API_URL}/api/users`, userData);
            const userId = userResponse.data.user_id;

            if (user.photo) {
                const photoFormData = new FormData();
                photoFormData.append('photo', user.photo);
                photoFormData.append('userId', userId);

                await axios.post(`${API_URL}/api/upload-photo`, photoFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            // CV yükleme
            if (user.cv) {
                const formData = new FormData();
                formData.append('cv', user.cv);
                formData.append('userId', userId);
                console.log('CV yükleme isteği gönderiliyor');
                console.log('formData:', formData);
                const response = await axios.post(`${API_URL}/api/upload-cv`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('CV yükleme yanıtı:', response);
            }

            const basvuruResponse = await axios.post(`${API_URL}/api/basvurular`, {
                userId: userId,
                ilanId: id,
                ilantype: "merkez"
            });

            if (!basvuruResponse.data.id) {
                throw new Error('Başvuru kaydedilemedi');
            }

            // Diğer bilgileri paralel olarak gönder
            await Promise.all([
                axios.post(`${API_URL}/api/egitim`, {
                    egitimBilgileri: user.egitim,
                    userId: userId
                }),
                axios.post(`${API_URL}/api/is_deneyimi`, {
                    isDeneyimiBilgileri: user.is_deneyimi,
                    userId: userId
                }),
                axios.post(`${API_URL}/api/sertifika`, {
                    sertifikaBilgileri: user.sertifika,
                    userId: userId
                }),
                axios.post(`${API_URL}/api/yabanci_dil`, {
                    yabanciDilBilgileri: user.yabanci_dil,
                    userId: userId
                }),
                axios.post(`${API_URL}/api/referanslar`, {
                    referansBilgileri: user.referans,
                    userId: userId
                }),
                axios.post(`${API_URL}/api/ilgi_alanlari`, {
                    ilgiAlanlari: user.ilgi_alanlari,
                    userId: userId
                })
            ]);

            // Form başarıyla gönderildikten sonra state'i sıfırla
            setUser({
                ad: '',
                soyad: '',
                cinsiyet: '',
                mezuniyet: '',
                medeni_durum: '',
                email: '',
                surucu_belgesi: '',
                dogum_tarihi: '',
                askerlik_durumu: '',
                ev_adresi: '',
                cep_telefonu: '',
                job_id: '',
                ikinci_cep_telefonu: '',
                egitim: [{ okul_adi: '', bolum: '', baslangic_tarihi: '', bitis_tarihi: '' }],
                sertifika: [{ sertifika_adi: '', alindi_tarihi: '' }],
                is_deneyimi: [{ firma_adi: '', pozisyon: '', baslangic_tarihi: '', bitis_tarihi: '' }],
                yabanci_dil: [{ dil_adi: '', seviye: '' }],
                referans: [{ referans_adi: '', referans_iletisim: '' }],
                ilgi_alanlari: [{ ilgi_alani: '' }],
                cv: null,
                photo: null
            });
            setPhotoPreview(null);

            navigate('/success');

        } catch (error) {
            console.error('Hata:', error);
            alert('Form gönderilirken bir hata oluştu: ' + error.message);
            //setShowErrorPopup(true);
        }
    };

    // const closeErrorPopup = () => {
    //     setShowErrorPopup(false);
    // };


    return (
        <div>
            <Header />
            <div className='MerkezFormRadio'>
                <div className='ilan-detayları'>
                    <div className='ilanDetaylarıRadio'>
                        {loading && ""}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {merkezIlanlar && (
                            <div className="ilan-detay">
                                <div className='ilanDetayPosition'>
                                    <div className='backİcon'>
                                        <Link to="/"><FiArrowLeft /></Link>
                                        <p className='ilanTitle'>Pozisyon Başlığı: <span>{merkezIlanlar.ilan_basligi}</span></p>
                                    </div>
                                    <div className='ilan-descs-banner'>
                                        <p className='ilanŞirketAdı'>Kurum Adı: <br /> <span>{merkezIlanlar.firma_adi}</span></p>
                                        <p className='İlanMaaş'>Önerilen Maaş: <br /> <span>{merkezIlanlar.maas}</span></p>
                                        <p className='İlanÇalışmaTürü'>Çalışma Türü: <br /> <span>{merkezIlanlar.is_tipi}</span></p>
                                        <p className='İlanTarih'>Yayınlanma Tarihi: <br /> <span>{new Date(merkezIlanlar.ilan_tarihi).toLocaleDateString()}</span></p>
                                        <p className='İlanNo'>İlan Numarası: <br /><span>{merkezIlanlar.job_id}</span></p>
                                    </div>
                                </div>
                                <div className='ilanDetayDesc'>
                                    <p>Pozisyon Detayları:</p>
                                    <p className='İlanDetay'>
                                        {merkezIlanlar.detaylar}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <img className='ilan-desc-logo' src="https://www.onder.org.tr/build/assets/search-bg-842c8fc7.svg" alt="Onder Logo" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='formUsersSetion'>
                    <div className='formPhoto'>
                                <div className="photo-upload-container">
                                    <div className="photo-upload-preview">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Önizleme" className="photo-preview" />
                                        ) : (
                                            <div className="photo-placeholder">
                                                Fotoğraf Yükleyin
                                            </div>
                                        )}
                                    </div>
                                    <label htmlFor="photo-upload" className="photo-upload-label">
                                        Fotoğraf Seç
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="photo-input"
                                        />
                                    </label>
                                </div>
                            </div>
                        <div className='formUserOneSection'>
                            <div className='formNameSurname'>
                                <label>Adınızı Giriniz: </label>
                                <input name="ad" placeholder="Ad" value={user.ad} onChange={handleChange} required />
                            </div>
                            <div className='formNameSurname'>
                                <label>Soyadınızı Giriniz: </label>
                                <input name="soyad" placeholder="Soyad" value={user.soyad} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className='formNameSurnameMail'>
                            <label>Mail Adresinizi Giriniz: </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="E-posta Adresi"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='formCinsiyetDogum'>
                            <div className='FCD'>
                                <label>Cinsiyetiniz Nedir: </label>
                                <select
                                    name="cinsiyet"
                                    placeholder="Cinsiyet"
                                    value={user.cinsiyet}
                                    onChange={handleChange} required
                                >
                                    <option value="">Cinsiyet Seçiniz</option>
                                    <option value="Erkek">Erkek</option>
                                    <option value="Kadın">Kadın</option>
                                </select>
                            </div>
                            <div className='FCD'>
                                <label>Doğum Tarihi: </label>
                                <input name="dogum_tarihi" placeholder="Doğum Tarihi" type="date" value={user.dogum_tarihi} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className='FormAdress'>
                            <label> Ev Adresi Giriniz:</label>
                            <input className='formAdress' name="ev_adresi" placeholder="Ev Adresi" value={user.ev_adresi} onChange={handleChange} required />
                        </div>

                        <div>
                            <div className='formTel'>
                                <div className='FTForm'>
                                    <label>Cep Telefon Numaranızı Giriniz:</label>
                                    <input name="cep_telefonu" placeholder="Cep Telefonu" value={user.cep_telefonu} onChange={handleChange} required />
                                </div>
                                <div className='FTForm'>
                                    <label>Yedek Numara Giriniz:</label>
                                    <input name="ikinci_cep_telefonu" placeholder="İkinci Cep Telefonu" value={user.ikinci_cep_telefonu} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className='MMASForm'>
                            <div className='MMForm'>
                                <label>Mezuniyet Durumu:</label>
                                <select
                                    name="mezuniyet"
                                    placeholder="Mezuniyet"
                                    value={user.mezuniyet}
                                    onChange={handleChange} required
                                >
                                    <option value="">Mezuniyet Durumunuz</option>
                                    <option value="İlkokul">İlkokul</option>
                                    <option value="Ortaokul">Ortaokul</option>
                                    <option value="Lise">Lise</option>
                                    <option value="üniversite">Üniversite</option>
                                </select>
                            </div>
                            <div className='MMForm'>
                                <label>Medeni Hâl:</label>
                                <select
                                    name="medeni_durum"
                                    placeholder="Medeni Durum"
                                    value={user.medeni_durum}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Medeni Durumu Seçiniz</option>
                                    <option value="Evli">Evli</option>
                                    <option value="Bekâr">Bekâr</option>
                                </select>
                            </div>
                        </div>


                        <div className='ASForm'>
                            <div className='ASFormTekil'>
                                <label>Askerlik Durumu:</label>
                                <select
                                    name="askerlik_durumu"
                                    value={user.askerlik_durumu}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Askerlik Durumu Seçiniz</option>
                                    <option value="Yapıldı">Yapıldı</option>
                                    <option value="Muaf">Muaf</option>
                                    <option value="Tecilli">Tecilli</option>
                                    <option value="Yapılmadı">Yapılmadı</option>
                                </select>
                            </div>

                            <div className='ASFormTekil'>
                                <label>Sürücü Belgesi:</label>
                                <select
                                    name="surucu_belgesi"
                                    placeholder="Sürücü Belgesi"
                                    value={user.surucu_belgesi}
                                    onChange={handleChange} required
                                >
                                    <option value="">Sürücü Belgesi</option>
                                    <option value="A Sınıfı">A Sınıfı</option>
                                    <option value="B Sınıfı">B Sınıfı</option>
                                    <option value="C Sınıfı">C Sınıfı</option>
                                    <option value="D Sınıfı">D Sınıfı</option>
                                </select>
                            </div>
                        </div>


                        <h3 className='TTitle'>Eğitim Bilgileri</h3>
                        {user.egitim.map((item, index) => (
                            <div className="merkez-desc-bot-ilan" key={index}>
                                <input name="okul_adi" placeholder="Okul Adı" value={item.okul_adi} onChange={(e) => handleArrayChange(e, index, 'egitim')} required />
                                <input name="bolum" placeholder="Bölüm" value={item.bolum} onChange={(e) => handleArrayChange(e, index, 'egitim')} required />
                                <div className='input-data'>
                                    <input name="baslangic_tarihi" placeholder="Başlangıç Tarihi" type="date" value={item.baslangic_tarihi} onChange={(e) => handleArrayChange(e, index, 'egitim')} required />
                                    <input name="bitis_tarihi" placeholder="Bitiş Tarihi" type="date" value={item.bitis_tarihi} onChange={(e) => handleArrayChange(e, index, 'egitim')} required />
                                </div>
                            </div>
                        ))}
                        <button className='TButton' type="button" onClick={() => addToArray('egitim')}>Eğitim Bilgisi Ekle</button>

                        <h3 className='TTitle'>İş Deneyimi Bilgileri</h3>
                        {user.is_deneyimi.map((item, index) => (
                            <div className="merkez-desc-bot-ilan" key={index}>
                                <input name="firma_adi" placeholder="Firma Adı" value={item.firma_adi} onChange={(e) => handleArrayChange(e, index, 'is_deneyimi')} required />
                                <input name="pozisyon" placeholder="Pozisyon" value={item.pozisyon} onChange={(e) => handleArrayChange(e, index, 'is_deneyimi')} required />
                                <div className='input-data'>
                                    <input name="baslangic_tarihi" placeholder="Başlangıç Tarihi" type="date" value={item.baslangic_tarihi} onChange={(e) => handleArrayChange(e, index, 'is_deneyimi')} required />
                                    <input name="bitis_tarihi" placeholder="Bitiş Tarihi" type="date" value={item.bitis_tarihi} onChange={(e) => handleArrayChange(e, index, 'is_deneyimi')} required />
                                </div>
                            </div>
                        ))}
                        <button className='TButton' type="button" onClick={() => addToArray('is_deneyimi')}>İş Deneyimi Ekle</button>

                        <h3 className='TTitle'>Sertifika Bilgileri</h3>
                        {user.sertifika.map((item, index) => (
                            <div className="merkez-desc-bot-ilan" key={index}>
                                <input name="sertifika_adi" placeholder="Sertifika Adı" value={item.sertifika_adi} onChange={(e) => handleArrayChange(e, index, 'sertifika')} required />
                                <input name="alindi_tarihi" placeholder="Alındığı Tarih" type="date" value={item.alindi_tarihi} onChange={(e) => handleArrayChange(e, index, 'sertifika')} required />
                            </div>
                        ))}
                        <button className='TButton' type="button" onClick={() => addToArray('sertifika')}>Sertifika Ekle</button>

                        <h3 className='TTitle'>Yabancı Dil Bilgileri</h3>
                        {user.yabanci_dil.map((item, index) => (
                            <div className="merkez-desc-bot-ilan" key={index}>
                                <input
                                    name="dil_adi"
                                    placeholder="Dil Adı"
                                    value={item.dil_adi}
                                    onChange={(e) => handleArrayChange(e, index, 'yabanci_dil')}
                                    required
                                />
                                <select
                                    name="seviye"
                                    value={item.seviye}
                                    onChange={(e) => handleArrayChange(e, index, 'yabanci_dil')}
                                    required
                                    className="language-level-select"
                                >
                                    <option value="">Seviye Seçiniz</option>
                                    <option value="Başlangıç (Elementary)">Başlangıç (Elementary)</option>
                                    <option value="Orta (Intermediate)">Orta (Intermediate)</option>
                                    <option value="İyi (Upper Intermediate)">İyi (Upper Intermediate)</option>
                                    <option value="Mükemmel (Advanced)">Mükemmel (Advanced)</option>
                                </select>
                            </div>
                        ))}
                        <button className='TButton' type="button" onClick={() => addToArray('yabanci_dil')}>Yabancı Dil Ekle</button>

                        <h3 className='TTitle'>Referans Bilgileri</h3>
                        {user.referans.map((item, index) => (
                            <div className="merkez-desc-bot-ilan" key={index}>
                                <input name="referans_adi" placeholder="Referans Adı" value={item.referans_adi} onChange={(e) => handleArrayChange(e, index, 'referans')} required />
                                <input name="referans_iletisim" placeholder="Referans İletişim" value={item.referans_iletisim} onChange={(e) => handleArrayChange(e, index, 'referans')} required />
                            </div>
                        ))}
                        <button className='TButton' type="button" onClick={() => addToArray('referans')}>Referans Ekle</button>

                        <h3 className='TTitle'>İlgi Alanları</h3>
                        {user.ilgi_alanlari.map((item, index) => (
                            <div className="merkez-desc-bot-ilan" key={index}>
                                <input
                                    name="ilgi_alani"
                                    placeholder="İlgi Alanı"
                                    value={item.ilgi_alani}
                                    onChange={(e) => handleArrayChange(e, index, 'ilgi_alanlari')}
                                    required
                                />
                            </div>
                        ))}
                        <button className='TButton' type="button" onClick={() => addToArray('ilgi_alanlari')}>İlgi Alanı Ekle</button>

                        <div className='formCVUpload'>
                            <label htmlFor="cv-upload">Sertifika, portföy veya başvuru belgelerinizi yükleyin:</label>
                            <input
                                className='file-input'
                                type="file"
                                id="cv-upload"
                                name="cv"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                            />
                            {user.cv && <span className="file-selected">{user.cv.name}</span>}
                        </div>

                        <div className='kvkk-consent'>
                            <label className='kvkk-label'>
                                <input
                                    type="checkbox"
                                    checked={kvkkConsent}
                                    onChange={(e) => setKvkkConsent(e.target.checked)}
                                    required
                                />
                                <span className='kvkk-text'>
                                    Kişisel verilerimin işlenmesine ilişkin aydınlatma metnini okudum ve anladım.
                                    Kişisel verilerimin belirtilen kapsamda işlenmesini onaylıyorum.
                                </span>
                            </label>
                        </div>
                    </div>
                    <button className='SubmitButton' type="submit">Formu Gönder</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default MerkezForm;
