import React, { useState, useEffect } from 'react';
import './AdminSlider.css';

const API_URL = process.env.REACT_APP_API_URL;

const AdminSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSlider, setNewSlider] = useState({
    title: '',
    image_url: '',
    link_url: ''
  });

  const fetchSliders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sliders`);
      if (!response.ok) {
        throw new Error('API yanıt vermedi');
      }
      const data = await response.json();
      
      // Gelen veriyi kontrol et ve array'e çevir
      const slidersArray = Array.isArray(data) ? data : data.rows || [data];
      setSliders(slidersArray);
      setLoading(false);
    } catch (err) {
      console.error('Slider yükleme hatası:', err);
      setError('Sliderlar yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/sliders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSlider),
      });

      if (!response.ok) {
        throw new Error('Slider eklenirken bir hata oluştu');
      }

      setNewSlider({ title: '', image_url: '', link_url: '' });
      fetchSliders();
      alert('Slider başarıyla eklendi');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSlider(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu sliderı silmek istediğinize emin misiniz?')) {
      try {
        const response = await fetch(`${API_URL}/api/sliders/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Slider silinirken bir hata oluştu');
        }

        fetchSliders();
        alert('Slider başarıyla silindi');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Slider Yönetimi</h1>
      </header>

      <main className="admin-main">
        <section className="slider-form-section">
          <h2>Yeni Slider Ekle</h2>
          <form onSubmit={handleSubmit} className="slider-form">
            <div className="form-group">
              <label htmlFor="title">Başlık:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newSlider.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image_url">Resim URL:</label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={newSlider.image_url}
                onChange={handleChange}
                required
              />
              {newSlider.image_url && (
                <div className="image-preview">
                  <img src={newSlider.image_url} alt="Önizleme" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="link_url">Link URL:</label>
              <input
                type="url"
                id="link_url"
                name="link_url"
                value={newSlider.link_url}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-btn">
              Slider Ekle
            </button>
          </form>
        </section>

        <section className="slider-list-section">
          <h2>Mevcut Sliderlar</h2>
          {loading ? (
            <div className="loading">Yükleniyor...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="slider-list">
              {sliders && sliders.length > 0 ? (
                sliders.map((slider) => (
                  <div key={slider.id} className="slider-item">
                    <div className="slider-image">
                      <img src={slider.image_url} alt={slider.title} />
                    </div>
                    <div className="slider-info">
                      <h3>{slider.title}</h3>
                      {slider.link_url && (
                        <a href={slider.link_url} target="_blank" rel="noopener noreferrer" className="slider-link">
                          Link'e Git
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(slider.id)}
                      className="delete-btn"
                    >
                      Sil
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-sliders">Henüz slider eklenmemiş</div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminSlider;