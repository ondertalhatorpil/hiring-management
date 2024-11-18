import { useState, useEffect } from 'react';
import axios from 'axios';
import './slider.css';


const API_URL = process.env.REACT_APP_API_URL;



const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/sliders`);
        setSlides(response.data);
        setLoading(false);
      } catch (err) {
        setError('Slider verileri yüklenirken bir hata oluştu');
        setLoading(false);
        console.error('Error fetching sliders:', err);
      }
    };

    fetchSliders();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  const handleSlideClick = (link_url) => {
    if (link_url) {
      window.open(link_url, '_blank', 'noopener noreferrer');
    }
  };

  if (loading) return <div className="w-full h-[600px] flex items-center justify-center">Yükleniyor...</div>;
  if (error) return <div className="w-full h-[600px] flex items-center justify-center text-red-500">{error}</div>;
  if (slides.length === 0) return <div className="w-full h-[600px] flex items-center justify-center">Slider bulunamadı</div>;

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative cursor-pointer"
            onClick={() => handleSlideClick(slide.link_url)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSlideClick(slide.link_url);
              }
            }}
          >
            <img
              src={slide.image_url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {slide.link_url && (
              <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm">
                Daha fazla bilgi →
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
            }}
            className={`rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-red-500 w-4 h-4'
                : 'bg-white/50 w-3 h-3'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;