// HomeAdmin.jsx 
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
        const fetchDashboardStats = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/dashboard/stats`);
                setStats(response.data);
            } catch (err) {
                setError('Veriler yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    if (loading) return <div className="loader"></div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!stats) return null;

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Yönetim Paneli</h1>
            
            <div className="stats-container">
                <div className="stats-card">
                    <div className="stats-icon">
                        <FiBriefcase />
                    </div>
                    <div className="stats-info">
                        <h3>Aktif İlanlar</h3>
                        <div className="stats-numbers">
                            <span className="main-number">{stats.activeJobs.total}</span>
                            <div className="sub-numbers">
                                <span>Merkez: {stats.activeJobs.merkez}</span>
                                <span>Yurt: {stats.activeJobs.yurt}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-icon">
                        <FiArchive />
                    </div>
                    <div className="stats-info">
                        <h3>Arşivlenen İlanlar</h3>
                        <div className="stats-numbers">
                            <span className="main-number">{stats.archivedJobs.total}</span>
                            <div className="sub-numbers">
                                <span>Merkez: {stats.archivedJobs.merkez}</span>
                                <span>Yurt: {stats.archivedJobs.yurt}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-icon">
                        <FiUsers />
                    </div>
                    <div className="stats-info">
                        <h3>Toplam Başvuru</h3>
                        <span className="main-number">{stats.totalApplicants}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="data-card">
                    <h2>Son Başvurular</h2>
                    <div className="table-wrapper">
                        <table className="data-table">
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

                <div className="data-card">
                    <h2>İlan Bazlı Başvurular</h2>
                    <div className="job-stats">
                        {stats.applicationsByJob.map((job, index) => (
                            <div key={index} className="job-stat-item">
                                <div className="job-header">
                                    <span className="job-title">{job.ilan_basligi}</span>
                                    <span className="job-type">{job.type === 'merkez' ? 'Merkez' : 'Yurt'}</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress" style={{
                                        width: `${(job.basvuru_sayisi / Math.max(...stats.applicationsByJob.map(j => j.basvuru_sayisi))) * 100}%`
                                    }}></div>
                                    <span className="count">{job.basvuru_sayisi}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeAdmin;