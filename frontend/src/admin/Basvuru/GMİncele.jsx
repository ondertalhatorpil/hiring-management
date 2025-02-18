import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './gmincele.css'


const API_URL = process.env.REACT_APP_API_URL;


const GMIncele = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tum-basvurular/merkez`);
      const data = await response.json();
  
      // CV ve fotoğraf verilerini çek ve başvuranlara ekle
      const jobsWithDetails = await Promise.all(data.ilanlar.map(async (job) => {
        const basvuranlarWithDetails = await Promise.all(job.basvuranlar.map(async (applicant) => {
          // CV verilerini çek
          const cvResponse = await fetch(`${API_URL}/api/cv/${applicant.user_id}`);
          const cvData = await cvResponse.json();
          
          // Fotoğraf verilerini çek
          const photoResponse = await fetch(`${API_URL}/api/photo/${applicant.user_id}`);
          const photoData = await (photoResponse.ok ? photoResponse.blob() : null);
          const photoUrl = photoData ? URL.createObjectURL(photoData) : null;
          
          return { 
            ...applicant, 
            cv: cvData[0], 
            photoUrl 
          };
        }));
        return { ...job, basvuranlar: basvuranlarWithDetails };
      }));
      
      setJobs(jobsWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleApplicantClick = (applicant) => {
    navigate(`/basvuru-detay/${applicant.user_id}`, { 
      state: { applicantData: applicant } 
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="main-title">Genel Merkez İş Başvuruları</h1>
      
      <div className="dashboard-container">
        {/* Sol Panel - İş İlanları */}
        <div className="jobs-panel">
          <h2 className="section-title">İş İlanları</h2>
          {jobs.map((job) => (
            <div
              key={job.ilan_detay.id}
              className={`job-card ${selectedJob?.ilan_detay.id === job.ilan_detay.id ? 'selected' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="job-header">
                <h3 className="job-title">{job.ilan_detay.ilan_basligi}</h3>
                <span className="applicant-count">
                  Başvuru: {job.basvuranlar?.length || 0}
                </span>
              </div>
              <div className="job-details">
                <p className="company-name">{job.ilan_detay.firma_adi}</p>
                <p className="job-info">
                  <span>{job.ilan_detay.sehir}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="applications-panel">
          {selectedJob ? (
            <>
              <h2 className="section-title">
                {selectedJob.ilan_detay.ilan_basligi} - Başvurular
              </h2>
              <div className="applications-list">
                {selectedJob.basvuranlar.map((applicant) => (
                  <div 
                    key={applicant.user_id} 
                    className="applicant-card"
                    onClick={() => handleApplicantClick(applicant)}
                  >
                    <div className="applicant-header">
                      <h3>{applicant.ad} {applicant.soyad}</h3>
                      <span className="education">{applicant.mezuniyet}</span>
                    </div>
                    <div className="applicant-details">
                      <p><strong>Email:</strong> {applicant.email}</p>
                      <p><strong>Telefon:</strong> {applicant.cep_telefonu}</p>
                      <p><strong>Deneyim:</strong></p>
                      <ul className="experience-list">
                        {applicant.is_deneyimleri.map((exp, index) => (
                          <li key={index}>
                            {exp.firma_adi} - {exp.pozisyon}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Başvuruları görüntülemek için bir ilan seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GMIncele;