import React, { useState } from 'react';
import axios from 'axios';



const API_URL = process.env.REACT_APP_API_URL;



const MerkezİlanForm = () => {
    const [ilanData, setIlanData] = useState({
        user_id: '', 
        job_id: Math.floor(Math.random() * 1000000).toString(), // Rastgele bir job_id oluştur
        ilan_basligi: '', 
        firma_adi: '', 
        ilan_tarihi: '', 
        is_tipi: '', 
        sehir: '', 
        detaylar: '', 
        maas: '' 
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
            const response = await axios.post(`${API_URL}/api/merkez-ilanlar`, {
                ...ilanData,
                job_id: ilanData.job_id,
                user_id: null, // user_id'yi null olarak gönder
                ilan_tipi: 'merkez'
            });
            
            console.log('İlan başarıyla oluşturuldu:', response.data);
            alert('İlan başarıyla oluşturuldu!');
            
            // Form reset
            setIlanData({
                user_id: '',
                job_id: Math.floor(Math.random() * 1000000).toString(),
                ilan_basligi: '',
                firma_adi: '',
                ilan_tarihi: '',
                is_tipi: '',
                sehir: '',
                detaylar: '',
                maas: ''
            });
        } catch (error) {
            console.error('Hata detayı:', error.response?.data || error.message);
            alert(`İlan oluşturulurken bir hata oluştu: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="merkez-form-container">
            <h1 className="merkez-form-title">ÖNDER Genel Merkez İş İlanı Oluştur</h1>
            <form onSubmit={handleSubmit}>
                <div className="merkez-form-group">
                    <label>İlan Numarası: {ilanData.job_id}</label>
                </div>
                <div className="merkez-form-group">
                    <label htmlFor="ilan_basligi">İlan Başlığı:</label>
                    <input type="text" name="ilan_basligi" value={ilanData.ilan_basligi} onChange={handleChange} required />
                </div>
                <div className="merkez-form-group">
                    <label htmlFor="firma_adi">Firma Adı:</label>
                    <input type="text" name="firma_adi" value={ilanData.firma_adi} onChange={handleChange} required />
                </div>
                <div className="merkez-form-group">
                    <label htmlFor="ilan_tarihi">İlan Tarihi:</label>
                    <input type="date" name="ilan_tarihi" value={ilanData.ilan_tarihi} onChange={handleChange} required />
                </div>
                <div className="merkez-form-group">
                    <label htmlFor="is_tipi">İş Tipi:</label>
                    <input type="text" name="is_tipi" value={ilanData.is_tipi} onChange={handleChange} required />
                </div>
                <div className="merkez-form-group">
                    <label htmlFor="sehir">Şehir:</label>
                    <input type="text" name="sehir" value={ilanData.sehir} onChange={handleChange} required />
                </div>
                <div className="merkez-form-group">
                    <label htmlFor="detaylar">Detaylar:</label>
                    <textarea name="detaylar" value={ilanData.detaylar} onChange={handleChange} required></textarea>
                </div>
                <div className="merkez-form-group">
                    <label htmlFor="maas">Maaş:</label>
                    <input type="text" name="maas" value="Görüşmede Belirlenicek" onChange={handleChange} required />
                </div>
                
                <button type="submit" className="merkez-form-button">İlanı Aç</button>
            </form>
            <style jsx>{`
  .merkez-form-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(209, 42, 44, 0.1);
    font-family: "Outfit", sans-serif;
  }

  .merkez-form-title {
    background: linear-gradient(135deg, #D12A2C 0%, #ff4444 100%);
    color: white;
    padding: 40px 20px;
    margin: -30px -30px 40px;
    border-radius: 20px 20px 0 0;
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    box-shadow: 0 4px 15px rgba(209, 42, 44, 0.2);
  }

  .merkez-form-group {
    margin-bottom: 28px;
    position: relative;
  }

  .merkez-form-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: #2c3e50;
    font-size: 16px;
    transition: color 0.3s ease;
  }

  .merkez-form-group input,
  .merkez-form-group select,
  .merkez-form-group textarea {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    font-size: 15px;
    color: #334155;
    transition: all 0.3s ease;
    background-color: #f8f9fa;
  }

  .merkez-form-group input:hover,
  .merkez-form-group select:hover,
  .merkez-form-group textarea:hover {
    border-color: #D12A2C;
  }

  .merkez-form-group input:focus,
  .merkez-form-group select:focus,
  .merkez-form-group textarea:focus {
    outline: none;
    border-color: #D12A2C;
    box-shadow: 0 0 0 4px rgba(209, 42, 44, 0.1);
    background-color: #ffffff;
  }

  .merkez-form-group select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23D12A2C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 15px center;
    background-size: 18px;
    padding-right: 45px;
  }

  .merkez-form-group textarea {
    min-height: 160px;
    resize: vertical;
    line-height: 1.5;
  }

  .merkez-form-group:first-of-type label {
    background-color: #f8f9fa;
    padding: 12px 18px;
    border-radius: 12px;
    color: #64748b;
    font-size: 15px;
    border: 2px solid #e9ecef;
    font-weight: normal;
  }

  .merkez-form-button {
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, #D12A2C 0%, #ff4444 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 30px;
    box-shadow: 0 4px 15px rgba(209, 42, 44, 0.2);
  }

  .merkez-form-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(209, 42, 44, 0.3);
  }

  .merkez-form-button:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(209, 42, 44, 0.2);
  }

  input::placeholder,
  textarea::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    .merkez-form-container {
      margin: 20px;
      padding: 20px;
      border-radius: 16px;
    }

    .merkez-form-title {
      font-size: 22px;
      padding: 30px 15px;
      margin: -20px -20px 30px;
      border-radius: 16px 16px 0 0;
    }

    .merkez-form-group input,
    .merkez-form-group select,
    .merkez-form-group textarea {
      padding: 12px 16px;
      font-size: 14px;
    }

    .merkez-form-button {
      padding: 14px 20px;
      font-size: 16px;
    }
  }
`}</style>
        </div>
    );
};

export default MerkezİlanForm;
