import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './joplist.css';

import { MdWork } from "react-icons/md";
import { MdOutlineLocationCity } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { LuArrowRight } from "react-icons/lu";

const API_URL = process.env.REACT_APP_API_URL;



const JobList = () => {
    const [activeTab, setActiveTab] = useState('merkez');
    const [ilanlar, setIlanlar] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchIlanlar = async (type) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/tum-basvurular/${type}`);
            const data = await response.json();
            setIlanlar(data.ilanlar);
        } catch (error) {
            console.error('İlanlar yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIlanlar(activeTab);
    }, [activeTab]);

    const handleApply = (ilan) => {
        const path = activeTab === 'yurt'
            ? `/yurt-ilanlar/${ilan.ilan_detay.id}`
            : `/merkez-ilanlar/${ilan.ilan_detay.id}`;
        navigate(path);
    };

    return (
        <div className="job-list-container">
            <div className="button-container">
                
                <button
                    onClick={() => setActiveTab('merkez')}
                    className={`tab-button ${activeTab === 'merkez' ? 'active' : ''}`}
                >
                    Genel Merkez Personel İlanları
                </button>
                <button
                    onClick={() => setActiveTab('yurt')}
                    className={`tab-button ${activeTab === 'yurt' ? 'active' : ''}`}
                >
                    Yurt Personel İlanları
                </button>
            </div>

            <div className="jobs-list">
                {loading ? (
                    <div className="loading-message">Yükleniyor...</div>
                ) : ilanlar.length > 0 ? (
                    ilanlar.map((ilan) => (
                        <div key={ilan.ilan_detay.id} className="job-card">
                            <div className='jop-card-desc-contain'>
                                <h3 className="job-title">
                                    {ilan.ilan_detay.ilan_basligi || 'İlan Başlığı'}
                                </h3>
                                <div className='jop-card-bottom-desc'>
                                    <div className="bottom-desc-text">
                                        <MdWork className='jop-list-icon' />
                                        <p> {ilan.ilan_detay.is_tipi || 'İlan açıklaması'}</p>                                    
                                    </div>
                                    <div className="bottom-desc-text">
                                       <MdOutlineLocationCity className='jop-list-icon' />
                                       <p>{ilan.ilan_detay.sehir || 'İlan açıklaması'}</p>
                                    </div>
                                    <div className='bottom-desc-text'>
                                    <MdDateRange className='jop-list-icon' />
                                    <p>Son Başvuru: {new Date(ilan.ilan_detay.ilan_tarihi).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleApply(ilan)}
                                className="apply-button"
                            >
                                Hemen Başvur
                                <LuArrowRight className='LuArrowRight' />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-message">
                        Henüz ilan bulunmamaktadır.
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobList;