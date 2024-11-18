import React from 'react'
import './politika.css'

import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

const Politika = () => {
  return (
    <>
        <Header />
          <div className='politikaContainer'>
                <div className='aboutDescBanner'>
                    <h1>ÖNDER İmam Hatipliler Derneği İnsan Kaynakları Politikası</h1>
                    <p>-İnsana Değer Veren, Gelişime Açık Bir Kariyer Anlayışı-</p>
                </div>
                <div className='aboutText'>
                  <p>“ÖNDER İmam Hatipliler Derneği olarak geliştirdiğimiz Kariyer Platformu, derneğimiz bünyesindeki iş ilanlarını paylaşmaktadır. Hem iş hayatında tecrübe sahibi profesyonellere hem de henüz yolun başında olan gençlere kapılarını açarak ortak hedefler doğrultusunda yapılacak çalışmalarla ÖNDER markasının güçlenmesini hedeflemektedir."</p>
                  <h4>BU ÇERÇEVEDE ÖNDER İMAM HATİPLİLER DERNEĞİ İNSAN KAYNAKLARI POLİTİKASININ TEMEL İLKELERİ ŞUNLARDIR;</h4>
                  <ul>
                    <li>• Derneğimizin misyon ve vizyonu ile uyumlu olarak tecrübe ve mesleki yetkinliğe sahip kişileri istihdam etmek.</li>
                    <li>• Genç yetenekleri keşfederek eğitim programları ile desteklemek ve kendi insan kaynağını oluşturmak.</li>
                    <li>• Çalışanın kişiliğine saygı duyan, adil, iletişime açık, şeffaf, katılımcı ve değer üreten bir kurum olmak.</li>
                    <li>• Çalışanların sosyal ve kültürel ihtiyaçlarının karşılanarak verimliliğinin artırılması.</li>
                    <li>• Çalışanların ve tüm paydaşların aidiyetini güçlendirecek ortak bir kurum kültürünün oluşmasını sağlamak.</li>
                    <li>• Etkin performans yönetim sistemi ile nitelikli ve özgüveni yüksek kişilerle çalışmak. Onların kariyer yolunda başarılı bir şekilde ilerlemesine imkan tanımak.</li>
                    <li>• Kurumsal hedeflere ulaşmak amacıyla insan kaynağını güçlendirmek, çalışanların mesleki bilgi ve yetkinliklerini geliştirebileceği yurt içi ve yurt dışı hizmet içi eğitim imkanları sunmak.</li>
                  </ul>
                </div>
          </div>
        <Footer />
    </>
  )
}

export default Politika