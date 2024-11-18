import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import './SSS.css';

const SSS = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            question: "Başvuru sürecim ne kadar sürer?",
            answer: "Başvuru süreciniz ortalama 5-7 iş günü içerisinde değerlendirilir ve tarafınıza mail yoluyla dönüş sağlanır."
        },
        {
            question: "Başvuru belgelerimi nasıl güncelleyebilirim?",
            answer: " Belgelerinizi e-posta yoluyla ileterek güncelleyebilirsiniz."
        },
        {
            question: "Birden fazla pozisyona başvuru yapabilir miyim?",
            answer: "Evet, aynı anda birden fazla pozisyona başvuru yapabilirsiniz. Her başvuru ayrı ayrı değerlendirilecektir ve uygun görülen pozisyonlar için sizinle iletişime geçilecektir."
        },
        {
            question: "Başvuru sonucumu nasıl öğrenebilirim?",
            answer: "Başvuru sonuçlarınız sisteme kayıtlı mail adresinize gönderilecektir. Ayrıca tarafınıza arama yapılıp bilgilendirileceksiniz."
        },
        {
            question: "Eksik belge tamamlama sürem ne kadardır?",
            answer: "Eksik belge bildirimi yapıldıktan sonra 5 iş günü içerisinde belgelerinizi tamamlamanız gerekmektedir. Bu süre içinde tamamlanmayan başvurular değerlendirmeye alınmayacaktır."
        }
    ];

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="sss-container">
            <h2 className="sss-title">Sıkça Sorulan Sorular</h2>
            <div className="sss-list">
                {faqData.map((faq, index) => (
                    <div key={index} className="sss-item">
                        <button
                            className="sss-button"
                            onClick={() => handleToggle(index)}
                            aria-expanded={openIndex === index}
                        >
                            <span className="sss-question">{faq.question}</span>
                            <span className="sss-icon">
                                {openIndex === index ? (
                                    <Minus size={20} />
                                ) : (
                                    <Plus size={20} />
                                )}
                            </span>
                        </button>
                        <div 
                            className={`sss-answer-container ${openIndex === index ? 'active' : ''}`}
                        >
                            <div className="sss-answer">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SSS;