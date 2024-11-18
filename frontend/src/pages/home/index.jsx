import React from 'react'
import Header from '../../components/Header/Header'
import Slider from '../../components/Slider/Slider'

import '../../App.css'
import JopList from '../../components/JopsList/JopList'
import GenelMerkezKatılBanner from '../../components/Banner/GenelMerkezBanner/GenelMerkezKatılBanner'
import Footer from '../../components/Footer/Footer'
import SSS from '../../components/SSS/SSS'

const index = () => {
  return (
    <>
         <Header />
         <Slider />
         <div className='Jops-container'>
              <JopList />
              <SSS />
              <GenelMerkezKatılBanner />
         </div>
         <Footer />
    </>
  )
}

export default index