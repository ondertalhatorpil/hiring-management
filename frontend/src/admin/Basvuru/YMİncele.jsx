import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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
      const response = await fetch(`${API_URL}/api/tum-basvurular/yurt`);
      const data = await response.json();

       // CV verilerini çek ve başvuranlara ekle
      const jobsWithCV = await Promise.all(data.ilanlar.map(async (job) => {
      const basvuranlarWithCV = await Promise.all(job.basvuranlar.map(async (applicant) => {
        const cvResponse = await fetch(`${API_URL}/api/cv/${applicant.user_id}`);
        const cvData = await cvResponse.json();
        return { ...applicant, cv: cvData[0] }; // İlk CV'yi al (birden fazla olabilir)
      }));
      return { ...job, basvuranlar: basvuranlarWithCV };
    }));
    
    setJobs(jobsWithCV);

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
                  <span>{job.ilan_detay.is_tipi}</span>
                </p>
                <p className="salary">Maaş: {job.ilan_detay.maas} TL</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sağ Panel - Başvuru Detayları */}
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