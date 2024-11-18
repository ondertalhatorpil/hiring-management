import React,{useEffect, useState,useCallback} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PiNotebookFill } from "react-icons/pi";
import { GiWhiteBook } from "react-icons/gi";
import './detay.css'

const API_URL = process.env.REACT_APP_API_URL;

const BasvuruDetay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { applicantData } = location.state || {};
  const [photoUrl, setPhotoUrl] = useState(applicantData?.photoUrl);




  // fetchPhoto fonksiyonunu useCallback ile tanımla
  const fetchPhoto = useCallback(async () => {
    if (!applicantData?.user_id) return; // user_id yoksa fonksiyondan çık
    
    try {
      const response = await fetch(`${API_URL}/api/photo/${applicantData.user_id}`);
      if (response.ok) {
        const blob = await response.blob();
        setPhotoUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
    }
  }, [applicantData?.user_id]); // applicantData.user_id'yi bağımlılıklara ekle

  // Tek bir useEffect kullan
  useEffect(() => {
    if (applicantData && !photoUrl) {
      fetchPhoto();
    }
  }, [applicantData, photoUrl, fetchPhoto]);

  if (!applicantData) {
    return <div>Başvuru bilgisi bulunamadı.</div>;
  }

  const handleCVDownload = async () => {
    if (applicantData.cv && applicantData.cv.file_path) {
      try {
        const response = await fetch(`${API_URL}/api/download-cv/${applicantData.cv.id}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // Dosya adını CV'nin orijinal adıyla veya varsayılan bir adla ayarla
        a.download = applicantData.cv.original_filename || 'cv.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('CV indirme hatası:', error);
        alert('CV indirirken bir hata oluştu.');
      }
    } else {
      alert('Bu başvuru için yüklenmiş bir CV bulunmamaktadır.');
    }
  };

  const generatePDF = async () => {
    // Türkçe karakter desteği için özel PDF oluşturma
    const doc = new jsPDF('p', 'pt', 'a4', true);
    
    // Türkçe karakter dönüşüm fonksiyonu
    const turkishToASCII = (text) => {
      const turkishChars = {'ç':'c', 'Ç':'C', 'ğ':'g', 'Ğ':'G', 'ı':'i', 'İ':'I', 
                           'ö':'o', 'Ö':'O', 'ş':'s', 'Ş':'S', 'ü':'u', 'Ü':'U'};
      return text.replace(/[çÇğĞıİöÖşŞüÜ]/g, letter => turkishChars[letter] || letter);
    };

    // Sayfa boyutları ve marjlar
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;
    let yPos = margin;

    // Başlangıç ayarları
    doc.setFont("helvetica");
    
    // Profil fotoğrafını ekle
    if (photoUrl) {
      try {
        const imgWidth = 100;
        const imgHeight = 100;
        const imgX = pageWidth - margin - imgWidth;
        
        // Base64'e çevir
        const img = new Image();
        img.src = photoUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        // Canvas kullanarak resmi base64'e çevir
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const base64Image = canvas.toDataURL('image/jpeg');
        
        // PDF'e ekle
        doc.addImage(base64Image, 'JPEG', imgX, yPos, imgWidth, imgHeight);
      } catch (error) {
        console.error('Fotoğraf eklenirken hata:', error);
      }
    }
    
    // Başlık
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    const headerText = turkishToASCII(`${applicantData.ad} ${applicantData.soyad}`);
    doc.text(headerText, margin, yPos + 30);
    yPos += 60;

    // İletişim bilgileri
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    const contactInfo = turkishToASCII(
      `E-posta: ${applicantData.email} | Tel: ${applicantData.cep_telefonu}`
    );
    doc.text(contactInfo, margin, yPos);
    yPos += 15;
    
    // Adres
    const addressText = turkishToASCII(`Adres: ${applicantData.ev_adresi}`);
    doc.text(addressText, margin, yPos);
    yPos += 30;

    // Kişisel Bilgiler
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text(turkishToASCII('Kişisel Bilgiler'), margin, yPos);
    yPos += 10;

    const personalInfoData = [
      ['Dogum Tarihi', new Date(applicantData.dogum_tarihi).toLocaleDateString()],
      ['Askerlik Durumu', turkishToASCII(applicantData.askerlik_durumu)],
      ['Surucu Belgesi', turkishToASCII(applicantData.surucu_belgesi)],
      ['Medeni Durum', turkishToASCII(applicantData.medeni_durum)],
      ['Cinsiyet', turkishToASCII(applicantData.cinsiyet)]
    ];

    doc.autoTable({
      startY: yPos,
      head: [],
      body: personalInfoData,
      theme: 'plain',
      styles: { 
        font: "helvetica",
        fontSize: 10, 
        cellPadding: 5 
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 150 },
        1: { cellWidth: 250 }
      }
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // Eğitim Bilgileri
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text(turkishToASCII('Egitim Bilgileri'), margin, yPos);
    yPos += 10;

    const educationData = applicantData.egitim_bilgileri.map(edu => [
      turkishToASCII(edu.okul_adi),
      turkishToASCII(edu.bolum),
      `${new Date(edu.baslangic_tarihi).toLocaleDateString()} - ${new Date(edu.bitis_tarihi).toLocaleDateString()}`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Okul', 'Bolum', 'Tarih']],
      body: educationData,
      theme: 'striped',
      headStyles: { 
        fillColor: [41, 128, 185],
        font: "helvetica",
        halign: 'center'
      },
      styles: { 
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5
      }
    });

    // İş Deneyimleri
    yPos = doc.lastAutoTable.finalY + 20;

    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text(turkishToASCII('Is Deneyimleri'), margin, yPos);
    yPos += 10;

    const experienceData = applicantData.is_deneyimleri.map(exp => [
      turkishToASCII(exp.firma_adi),
      turkishToASCII(exp.pozisyon),
      `${new Date(exp.baslangic_tarihi).toLocaleDateString()} - ${new Date(exp.bitis_tarihi).toLocaleDateString()}`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Firma', 'Pozisyon', 'Tarih']],
      body: experienceData,
      theme: 'striped',
      headStyles: { 
        fillColor: [41, 128, 185],
        font: "helvetica",
        halign: 'center'
      },
      styles: { 
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5
      }
    });

    // İlgi Alanları
    const remainingSpaceAfterExp = pageHeight - doc.lastAutoTable.finalY;
    const estimatedSpaceForInt = 60; // İlgi alanları için tahmini alan

    if (remainingSpaceAfterExp < estimatedSpaceForInt) {
      doc.addPage();
      yPos = margin;
    } else {
      yPos = doc.lastAutoTable.finalY + 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text(turkishToASCII('Ilgi Alanlari'), margin, yPos);
    yPos += 10;

    const interestsData = applicantData.ilgi_alanlari.map(interest => [
      turkishToASCII(interest.ilgi_alani)
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Ilgi Alani']],
      body: interestsData,
      theme: 'striped',
      headStyles: { 
        fillColor: [41, 128, 185],
        font: "helvetica",
        halign: 'center'
      },
      styles: { 
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5
      }
    });

    // Sertifikalar
    const remainingSpaceAfterInt = pageHeight - doc.lastAutoTable.finalY;
    const estimatedSpaceForCert = (applicantData.sertifikalar.length + 4) * 30;

    if (remainingSpaceAfterInt < estimatedSpaceForCert) {
      doc.addPage();
      yPos = margin;
    } else {
      yPos = doc.lastAutoTable.finalY + 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text(turkishToASCII('Sertifikalar'), margin, yPos);
    yPos += 10;

    const certificateData = applicantData.sertifikalar.map(cert => [
      turkishToASCII(cert.sertifika_adi),
      new Date(cert.alindi_tarihi).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Sertifika', 'Alinma Tarihi']],
      body: certificateData,
      theme: 'striped',
      headStyles: { 
        fillColor: [41, 128, 185],
        font: "helvetica",
        halign: 'center'
      },
      styles: { 
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5
      }
    });

    // Yabancı Diller
    const remainingSpaceAfterCert = pageHeight - doc.lastAutoTable.finalY;
    const estimatedSpaceForLang = (applicantData.yabanci_diller.length + 4) * 30;

    if (remainingSpaceAfterCert < estimatedSpaceForLang) {
      doc.addPage();
      yPos = margin;
    } else {
      yPos = doc.lastAutoTable.finalY + 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text(turkishToASCII('Yabanci Diller'), margin, yPos);
    yPos += 10;

    const languageData = applicantData.yabanci_diller.map(lang => [
      turkishToASCII(lang.dil_adi),
      `${lang.seviye}/5`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Dil', 'Seviye']],
      body: languageData,
      theme: 'striped',
      headStyles: { 
        fillColor: [41, 128, 185],
        font: "helvetica",
        halign: 'center'
      },
      styles: { 
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5
      }
    });

    // Referanslar
    const remainingSpaceAfterLang = pageHeight - doc.lastAutoTable.finalY;
    const estimatedSpaceForRef = (applicantData.referanslar.length + 4) * 30;

    if (remainingSpaceAfterLang < estimatedSpaceForRef) {
      doc.addPage();
      yPos = margin;
    } else {
      yPos = doc.lastAutoTable.finalY + 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text(turkishToASCII('Referanslar'), margin, yPos);
    yPos += 10;

    const referenceData = applicantData.referanslar.map(ref => [
      turkishToASCII(ref.referans_adi),
      turkishToASCII(ref.referans_iletisim)
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Isim', 'Iletisim']],
      body: referenceData,
      theme: 'striped',
      headStyles: { 
        fillColor: [41, 128, 185],
        font: "helvetica",
        halign: 'center'
      },
      styles: { 
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5
      }
    });

    // PDF'i indir
    doc.save(`${turkishToASCII(applicantData.ad)}_${turkishToASCII(applicantData.soyad)}_CV.pdf`);
  };

  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="button-group">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Geri Dön
          </button>
          <button className="pdf-button back-button" onClick={generatePDF}>
            <PiNotebookFill />
            CV İndir
          </button>
          <button className="cv-button back-button" onClick={handleCVDownload}>
            <GiWhiteBook />
            Dosya İndir
          </button>
        </div>

        <div className="main-info">
        <div className="profile-info">
            <h1>{applicantData.ad} {applicantData.soyad}</h1>
            <div className="badges">
              <span className="badge">{applicantData.mezuniyet}</span>
              <span className="badge">{applicantData.medeni_durum}</span>
              <span className="badge">{applicantData.cinsiyet}</span>
            </div>
          </div>
          {photoUrl && (
            <div className="profile-photo">
              <img src={photoUrl} alt={`${applicantData.ad} ${applicantData.soyad}`} />
            </div>
          )}
          
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <h2>Kişisel Bilgiler</h2>
            <div className="info-group">
              <p><strong>Email:</strong> {applicantData.email}</p>
              <p><strong>Telefon:</strong> {applicantData.cep_telefonu}</p>
              <p><strong>Adres:</strong> {applicantData.ev_adresi}</p>
              <p><strong>Doğum Tarihi:</strong> {new Date(applicantData.dogum_tarihi).toLocaleDateString('tr-TR')}</p>
              <p><strong>Askerlik Durumu:</strong> {applicantData.askerlik_durumu}</p>
              <p><strong>Sürücü Belgesi:</strong> {applicantData.surucu_belgesi}</p>
            </div>
          </div>

          <div className="detail-card">
            <h2>Eğitim Bilgileri</h2>
            {applicantData.egitim_bilgileri.map((edu, index) => (
              <div key={index} className="info-item">
                <h3>{edu.okul_adi}</h3>
                <p>{edu.bolum}</p>
                <p className="date-range">
                  {new Date(edu.baslangic_tarihi).toLocaleDateString('tr-TR')} - 
                  {new Date(edu.bitis_tarihi).toLocaleDateString('tr-TR')}
                </p>
              </div>
            ))}
          </div>

          <div className="detail-card">
            <h2>İş Deneyimleri</h2>
            {applicantData.is_deneyimleri.map((exp, index) => (
              <div key={index} className="info-item">
                <h3>{exp.firma_adi}</h3>
                <p>{exp.pozisyon}</p>
                <p className="date-range">
                  {new Date(exp.baslangic_tarihi).toLocaleDateString('tr-TR')} - 
                  {new Date(exp.bitis_tarihi).toLocaleDateString('tr-TR')}
                </p>
              </div>
            ))}
          </div>

          <div className="detail-card">
            <h2>İlgi Alanları</h2>
            <div className="info-group">
              {applicantData.ilgi_alanlari.map((interest, index) => (
                <div key={index} className="info-item">
                  <p>{interest.ilgi_alani}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-card">
            <h2>Sertifikalar</h2>
            {applicantData.sertifikalar.map((cert, index) => (
              <div key={index} className="info-item">
                <h3>{cert.sertifika_adi}</h3>
                <p>Alınma Tarihi: {new Date(cert.alindi_tarihi).toLocaleDateString('tr-TR')}</p>
              </div>
            ))}
          </div>

          <div className="detail-card">
            <h2>Yabancı Diller</h2>
            {applicantData.yabanci_diller.map((lang, index) => (
              <div key={index} className="info-item">
                <h3>{lang.dil_adi}</h3>
                <p>Seviye: {lang.seviye}/5</p>
              </div>
            ))}
          </div>

          <div className="detail-card">
            <h2>Referanslar</h2>
            {applicantData.referanslar.map((ref, index) => (
              <div key={index} className="info-item">
                <h3>{ref.referans_adi}</h3>
                <p>İletişim: {ref.referans_iletisim}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasvuruDetay;