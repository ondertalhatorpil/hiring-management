import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API_URL = process.env.REACT_APP_API_URL;


const YurtIlanlar = () => {
    const [yurtIlanlar, setYurtIlanlar] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchYurtIlanlar = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/yurt-ilanlar`);
            console.log('Yurt ilanları başarıyla alındı:', response.data);
            setYurtIlanlar(response.data);
        } catch (err) {
            console.error('Yurt ilanları alınırken hata:', err);
            setError('Yurt ilanları alınırken bir hata oluştu.');
        }
    };

    useEffect(() => {
        fetchYurtIlanlar();
    }, []);

    const handleApply = (id) => {
        console.log('Başvuru yapılacak iş ilanı ID:', id);
        navigate(`/yurt-ilanlar/${id}`);
    };

    return (
        <div>
            <h1>Yurt İlanlar</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {yurtIlanlar.map((ilan) => (
                    <li key={ilan.job_id}>
                        <h3>{ilan.ilan_basligi} - {ilan.firma_adi}</h3>
                        <p>İş Tipi: {ilan.is_tipi}</p>
                        <p>Şehir: {ilan.sehir}</p>
                        <p>Detaylar: {ilan.detaylar}</p>
                        <p>Maaş: {ilan.maas}</p>
                        <p>İlan ID: {ilan.id}</p>
                        <p>İlan Tarihi: {ilan.ilan_tarihi}</p>
                        <button onClick={() => handleApply(ilan.id)}>Başvur</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default YurtIlanlar;
