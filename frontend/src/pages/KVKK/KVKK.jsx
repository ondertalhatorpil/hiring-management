import React from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

import './kvkk.css'



const KVKK = () => {
  return (
    <>
        <Header />
            <div>
                <div className='aboutDescBanner'>
                    <h1>KVKK AYDINLATMA METNİ</h1>
                    <p>Kişisel Verilerinizi Koruma Kanunu</p>
                </div>
               <div className='kvkk-container'>
               <div className='kvkk-box'>
                   <h2>KİŞİSEL VERİLERİN TOPLANMA YÖNTEMLERİ</h2>
                   <span>
                    <p>Kişisel verileriniz;</p>
                    <ul>
                        <li>Web sitemiz ve mobil uygulamamız üzerinden</li>
                        <li>E-posta, telefon, SMS yoluyla</li>
                        <li>Sosyal medya kanallarımız üzerinden</li>
                        <li>Etkinlik ve organizasyonlarımız sırasında</li>
                        <li>Fiziksel formlar aracılığıyla</li>
                        <li>Çerezler (cookies) vasıtasıyla toplanmaktadır.</li>
                    </ul>
                   </span>
                </div>
                <div className='kvkk-box'>
                   <h2>İŞLENEN KİŞİSEL VERİLER</h2>
                   <span>
                    <p>Kişisel verileriniz;</p>
                    <ul>
                        <li>Kimlik Bilgileri (Ad, soyad, T.C. kimlik no, doğum tarihi vb.)</li>
                        <li>İletişim Bilgileri (Adres, telefon, e-posta vb.)</li>
                        <li>Eğitim Bilgileri (Okul, bölüm, mezuniyet durumu vb.)</li>
                        <li>Mesleki Deneyim (İş geçmişi, pozisyon, referanslar vb.)</li>
                        <li>Görsel ve İşitsel Kayıtlar</li>
                        <li>Çerezler (cookies) vasıtasıyla toplanmaktadır.</li>
                    </ul>
                   </span>
                </div>
                <div className='kvkk-box'>
                   <h2>KİŞİSEL VERİLERİN İŞLENME AMAÇLARI</h2>
                   <span>
                    <p>Kişisel verileriniz;</p>
                    <ul>
                        <li>Üyelik işlemlerinin yürütülmesi</li>
                        <li>Dernek faaliyetleri hakkında bilgilendirme</li>
                        <li>Etkinlik ve organizasyon düzenlenmesi</li>
                        <li>Eğitim ve kariyer planlaması desteği</li>
                        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                        <li>İletişim faaliyetlerinin yürütülmesi</li>
                    </ul>
                   </span>
                </div>
                <div className='kvkk-box'>
                   <h2>KİŞİSEL VERİLERİN AKTARILMASI</h2>
                   <span>
                    <p>Kişisel verileriniz;</p>
                    <ul>
                        <li>Yasal yükümlülükler kapsamında kamu kurumlarıyla</li>
                        <li>İş birliği yaptığımız kurumlarla</li>
                        <li>Bağlı kuruluşlar ve iştiraklarla gerekli güvenlik önlemleri alınarak paylaşılabilmektedir.</li>
                    </ul>
                   </span>
                </div>
                <div className='kvkk-box'>
                   <h2>VERİ SAHİBİNİN HAKLARI</h2>
                   <span>
                    <p>KVK Kanunu'nun 11. maddesi uyarınca veri sahipleri:</p>
                    <ul>
                        <li>Kişisel veri işlenip işlenmediğini öğrenme</li>
                        <li>İşlenen verilere ilişkin bilgi talep etme</li>
                        <li>İşlenme amacını öğrenme</li>
                        <li>Eksik/yanlış işleme durumunda düzeltme isteme</li>
                        <li>Silme veya yok edilmesini isteme</li>
                    </ul>
                   </span>
                </div>
                <div className='kvkk-box'>
                   <h2>GÜVENLİK ÖNLEMLERİ</h2>
                   <span>
                    <p>Kişisel verileriniz için;</p>
                    <ul>
                        <li>Teknik ve idari güvenlik önlemleri alınmaktadır</li>
                        <li>Veri güvenliği için gerekli denetimler yapılmaktadır</li>
                        <li>Çalışanlarımız gizlilik konusunda eğitilmektedir</li>
                    </ul>
                   </span>
                </div>
               </div>
            </div>
        <Footer />
    </>
  )
}

export default KVKK