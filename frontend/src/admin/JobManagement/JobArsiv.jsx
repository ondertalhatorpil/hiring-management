import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JopArsiv.css';

const API_URL = process.env.REACT_APP_API_URL;

const JobArsiv = () => {
    const [activeTab, setActiveTab] = useState('yurt');
    const [ilanlar, setIlanlar] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchIlanlar = async (type) => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = type === 'yurt' ? '/api/yurt-ilanlar' : '/api/merkez-ilanlar';
            // URL oluşturma düzeltildi
            const response = await axios.get(`${API_URL}${endpoint}`);
            setIlanlar(response.data);
        } catch (error) {
            console.error('İlanlar yüklenirken hata:', error);
            setError('İlanlar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIlanlar(activeTab);
    }, [activeTab]);

    const handleArsivle = async (ilanId) => {
        try {
            const endpoint = activeTab === 'yurt'
                ? `/api/arsiv/yurt-ilan/${ilanId}`
                : `/api/arsiv/merkez-ilan/${ilanId}`;
            
            // URL oluşturma düzeltildi
            const response = await axios.post(`${API_URL}${endpoint}`);

            if (response.data.success) {
                fetchIlanlar(activeTab);
                alert('İlan başarıyla arşivlendi');
            }
        } catch (error) {
            console.error('Arşivleme hatası:', error);
            alert('İlan arşivlenirken bir hata oluştu: ' + 
                (error.response?.data?.message || error.message));
        }
    };

    // Debug için API URL'i kontrol et
    useEffect(() => {
        console.log('API URL:', API_URL);
    }, []);

    return (
        <div className="archive-container">
            <h1 className="page-title">İş İlanları Arşivleme</h1>
            
            <div className="tab-container">
                <button
                    className={`tab-button ${activeTab === 'yurt' ? 'active' : ''}`}
                    onClick={() => setActiveTab('yurt')}
                >
                    Yurt İlanları
                </button>
                <button
                    className={`tab-button ${activeTab === 'merkez' ? 'active' : ''}`}
                    onClick={() => setActiveTab('merkez')}
                >
                    Genel Merkez İlanları
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading">Yükleniyor...</div>
            ) : (
                <div className="jobs-list">
                    {ilanlar && ilanlar.length > 0 ? (
                        ilanlar.map((ilan) => (
                            <div key={ilan.id} className="job-card">
                                <div className="job-info">
                                    <h3>{ilan.ilan_basligi}</h3>
                                    <p className="job-location">{ilan.sehir}</p>
                                </div>
                                <button
                                    onClick={() => handleArsivle(ilan.id)}
                                    className="archive-button"
                                >
                                    Arşive Al
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="no-jobs">İlan bulunamadı</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobArsiv;