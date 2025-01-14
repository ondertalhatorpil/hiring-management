import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const YurtIlanForm = () => {
    const [ilanData, setIlanData] = useState({
        user_id: '',
        job_id: Math.floor(Math.random() * 1000000).toString(), 
        ilan_basligi: '',
        firma_adi: '',
        ilan_tarihi: '',
        is_tipi: '',
        sehir: '',
        detaylar: '',
        maas: 'Belirtilmedi' // Maaş alanını ekleyin
    });

   const handleChange = (e) => {
       const { name, value } = e.target;
       setIlanData({
           ...ilanData,
           [name]: value
       });
   };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // İstek öncesi log
        console.log('Gönderilen veri:', {
            ...ilanData,
            user_id: 1,
            ilan_tipi: 'yurt'
        });

        const response = await axios.post(`${API_URL}/api/yurt-ilanlar`, {
            ...ilanData,
            user_id: 1,
            ilan_tipi: 'yurt'
        });

        console.log('Sunucu yanıtı:', response.data);
        alert('İlan başarıyla oluşturuldu!');

        // Formu sıfırla
        setIlanData({
            user_id: '',
            job_id: Math.floor(Math.random() * 1000000).toString(),
            ilan_basligi: '',
            firma_adi: '',
            ilan_tarihi: '',
            is_tipi: '',
            sehir: '',
            detaylar: '',
            maas: 'Belirtilmedi'
        });

    } catch (error) {
        console.error('Hata detayı:', error.response?.data || error.message);
        alert(`İlan oluşturulurken bir hata oluştu: ${error.response?.data?.error || error.message}`);
    }
};

   return (
       <div className="merkez-form-container">
           <h1 className="merkez-form-title">ÖNDER Yurt Genel Müdürlüğü İş İlanı Oluştur</h1>
           <form onSubmit={handleSubmit}>
               <div className="merkez-form-group">
                   <label>İlan Numarası: {ilanData.job_id}</label>
               </div>
               <div className="merkez-form-group">
                   <label htmlFor="ilan_basligi">İlan Başlığı:</label>
                   <input 
                       type="text" 
                       name="ilan_basligi" 
                       value={ilanData.ilan_basligi} 
                       onChange={handleChange} 
                       required 
                   />
               </div>
               <div className="merkez-form-group">
                   <label htmlFor="firma_adi">Firma Adı:</label>
                   <input 
                       type="text" 
                       name="firma_adi" 
                       value={ilanData.firma_adi} 
                       onChange={handleChange} 
                       required 
                   />
               </div>
               <div className="merkez-form-group">
                   <label htmlFor="ilan_tarihi">İlan Tarihi:</label>
                   <input 
                       type="date" 
                       name="ilan_tarihi" 
                       value={ilanData.ilan_tarihi} 
                       onChange={handleChange} 
                       required 
                   />
               </div>
               <div className="merkez-form-group">
                   <label htmlFor="is_tipi">İş Tipi:</label>
                   <select
                       name="is_tipi"
                       value={ilanData.is_tipi}
                       onChange={handleChange}
                       required
                   >
                       <option value="">İş Tipi Seçiniz</option>
                       <option value="Tam Zamanlı">Tam Zamanlı</option>
                       <option value="Yarı Zamanlı">Yarı Zamanlı</option>
                       <option value="Uzaktan">Uzaktan</option>
                       <option value="Staj">Staj</option>
                   </select>
               </div>
               <div className="merkez-form-group">
                   <label htmlFor="sehir">Şehir:</label>
                   <input 
                       type="text" 
                       name="sehir" 
                       value={ilanData.sehir} 
                       onChange={handleChange} 
                       required 
                   />
               </div>
               <div className="merkez-form-group">
                   <label htmlFor="detaylar">Detaylar:</label>
                   <textarea 
                       name="detaylar" 
                       value={ilanData.detaylar} 
                       onChange={handleChange} 
                       required
                       placeholder="İş tanımı, aranan nitelikler, sorumluluklar vb."
                   ></textarea>
               </div>
               <button type="submit" className="merkez-form-button">İlanı Aç</button>
           </form>
            <style jsx>{`
       .merkez-form-container {
    font-family: 'Arial', sans-serif;
    background-color: #f9fafb;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    width: 100%;
    font-family: "Outfit", sans-serif;
    margin: auto;
}

.merkez-form-title {
    text-align: center;
    margin-bottom: 30px;
    color: #fff;
    font-size: 34px;
    padding: 80px 0;
    background-color: #D12A2C;
}

.merkez-form-group {
    margin-bottom: 20px;
}

.merkez-form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
    color: #34495e;
}

.merkez-form-group input,
.merkez-form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    color: #2c3e50;
}

.merkez-form-group input:focus,
.merkez-form-group textarea:focus {
    border-color: #2980b9;
    outline: none;
}

.merkez-form-group textarea {
    height: 100px;
    resize: vertical;
}

.merkez-form-button {
    width: 20%;
    padding: 12px;
    background-color: #D12A2C;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    margin-top: 20px;
}

.merkez-form-button:hover {
    background-color: #3498db;
}

.merkez-form-button:active {
    background-color: #1f6c9c;
}

@media (max-width: 600px) {
    .merkez-form-container {
        padding: 20px;
    }

    .merkez-form-title {
        font-size: 20px;
    }
}
      `}</style>
        </div>
    );
};

export default YurtIlanForm;
