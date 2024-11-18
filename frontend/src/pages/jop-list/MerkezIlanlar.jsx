import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API_URL = process.env.REACT_APP_API_URL;



const MerkezIlanlar = () => {
    const [merkezIlanlar, setMerkezIlanlar] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchMerkezIlanlar = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/merkez-ilanlar`);
            console.log('Merkez ilanları başarıyla alındı:', response.data);
            setMerkezIlanlar(response.data);
        } catch (err) {
            console.error('Merkez ilanları alınırken hata:', err);
            setError('Merkez ilanları alınırken bir hata oluştu.');
        }
    };

    useEffect(() => {
        fetchMerkezIlanlar();
    }, []);


    const handleApply = (id) => { // jobId yerine id kullandık
        console.log('Başvuru yapılacak iş ilanı ID:', id);
        navigate(`/merkez-ilanlar/${id}`); // id'yi URL'ye ekliyoruz
    };

    return (
        <div>
            <h1>Merkez İlanlar</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {merkezIlanlar.map((ilan) => (
                    <li key={ilan.job_id}>
                        <h3>{ilan.ilan_basligi} - {ilan.firma_adi}</h3>
                        <p>İş Tipi: {ilan.is_tipi}</p>
                        <p>Şehir: {ilan.sehir}</p>
                        <p>Detaylar: {ilan.detaylar}</p>
                        <p>Maaş: {ilan.maas}</p>
                        <p>İlan ID: {ilan.job_id}</p>
                        <p>İlan Tarihi: {ilan.ilan_tarihi}</p>
                        <button onClick={() => handleApply(ilan.id)}>Başvur</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MerkezIlanlar;
