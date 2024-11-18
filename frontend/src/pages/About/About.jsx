import React from 'react'

import './about.css'


import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

const About = () => {
  return (
    <>
        <Header />
            <div className='aboutContainer'>
                <div className='aboutDescBanner'>
                    <img className='ONDERLOGO' src="https://www.onder.org.tr/assets/images/statics/onder-logo.svg" alt="Önder Logo" />
                    <h1>HAKKIMIZDA</h1>
                    <p>ÖNDER İmam Hatipliler Derneği olarak geliştirdiğimiz Kariyer Platformu, sadece derneğimiz bünyesindeki iş ilanlarını paylaşmaktadır. </p>
                </div>
                <div className='aboutContent'>
                    <div className='aboutSection1'>
                            <h2>ÖNDER Kariyer Platformu Nedir?</h2>
                            <p>ÖNDER Kariyer Platformu, derneğimiz bünyesindeki iş fırsatlarını geniş bir kitleye sunan özel bir kariyer ağıdır. Platform, iş ilanlarıyla derneğimizin projelerinde görev alacak yetenekleri bir araya getirmeyi amaçlar.</p>
                    </div>
                    <div className='aboutSection2'>
                            <h2>Kimler Başvurabilir?</h2>
                            <p>Platformumuzdaki ilanlara herkes başvurabilir. İmam Hatip mezunu veya üyesi olma şartı olmaksızın, ilanlara erişim sağlayarak özgeçmiş oluşturabilir ve uygun pozisyonlara başvuruda bulunabilirsiniz.</p>
                    </div>
                    <div className='aboutSection1'>
                            <h2>Hedefimiz Nedir?</h2>
                            <p>Amacımız, hem mezunlarımızı hem de topluluğumuz dışındaki yetenekleri değerlendirerek, onları derneğimizin projeleri ve iş imkanlarıyla buluşturmak ve böylece geniş bir kariyer ağı oluşturmaktır.</p>
                    </div>
                </div>
            </div>
        <Footer />
    </>
  )
}

export default About