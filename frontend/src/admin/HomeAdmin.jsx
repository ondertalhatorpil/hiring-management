import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBriefcase, FiArchive, FiUsers } from 'react-icons/fi';
import './css/HomeAdmin.css';

const API_URL = process.env.REACT_APP_API_URL;


const HomeAdmin = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/dashboard/stats`);
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            setError('Veriler yüklenirken bir hata oluştu.');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Yükleniyor...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!stats) return null;

    return (
        <div className="dashboard-container">
            <h1>Yönetim Paneli</h1>
            
            {/* İstatistik Kartları */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiBriefcase />
                    </div>
                    <div className="stat-content">
                        <h3>Aktif İlanlar</h3>
                        <div className="stat-numbers">
                            <p className="main-number">{stats.activeJobs.total}</p>
                            <div className="sub-numbers">
                                <span>Merkez: {stats.activeJobs.merkez}</span>
                                <span>Yurt: {stats.activeJobs.yurt}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FiArchive />
                    </div>
                    <div className="stat-content">
                        <h3>Arşivlenen İlanlar</h3>
                        <div className="stat-numbers">
                            <p className="main-number">{stats.archivedJobs.total}</p>
                            <div className="sub-numbers">
                                <span>Merkez: {stats.archivedJobs.merkez}</span>
                                <span>Yurt: {stats.archivedJobs.yurt}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FiUsers />
                    </div>
                    <div className="stat-content">
                        <h3>Toplam Başvuru</h3>
                        <p className="main-number">{stats.totalApplicants}</p>
                    </div>
                </div>
            </div>

            {/* Son Başvurular Tablosu */}
            <div className="recent-applications">
                <h2>Son Başvurular</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Başvuran</th>
                                <th>E-posta</th>
                                <th>İlan</th>
                                <th>Tarih</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentApplications.map((app, index) => (
                                <tr key={index}>
                                    <td>{app.ad} {app.soyad}</td>
                                    <td>{app.email}</td>
                                    <td>{app.ilan_basligi}</td>
                                    <td>{new Date(app.basvuru_tarihi).toLocaleDateString('tr-TR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* İlan Bazlı Başvuru Grafiği */}
            <div className="applications-by-job">
                <h2>İlan Bazlı Başvurular</h2>
                <div className="job-stats">
                    {stats.applicationsByJob.map((job, index) => (
                        <div key={index} className="job-stat-bar">
                            <div className="job-info">
                                <span className="job-title">{job.ilan_basligi}</span>
                                <span className="job-type">{job.type === 'merkez' ? 'Merkez' : 'Yurt'}</span>
                            </div>
                            <div className="bar-container">
                                <div 
                                    className="bar" 
                                    style={{
                                        width: `${(job.basvuru_sayisi / Math.max(...stats.applicationsByJob.map(j => j.basvuru_sayisi))) * 100}%`
                                    }}
                                />
                                <span className="count">{job.basvuru_sayisi}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeAdmin;