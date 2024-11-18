import React from 'react'
import './GenelMerkezBanner.css'

import GMBanner from '../../../assets/GMBanner.png'
import { Link } from 'react-router-dom'
import { LuArrowRight } from "react-icons/lu";


const GenelMerkezKatılBanner = () => {
  return (
    <div className='G-M-Container'>
        <div className='G-M-Desc'>
            <h1>Önder'de Çalışmaya Ne Dersin?</h1>
            <p>Kariyer yolculuğunuzu desteklemek amacıyla, en güncel iş ilanlarını ve kariyer fırsatlarını sizlere sunan bir platformuz.
            </p>
            <Link className='GM-Desc-B' to="/hakkımızda">
              Hakkımızda                              
              <LuArrowRight className='LuArrowRight' />
            </Link>
        </div>
      <img src={GMBanner} alt="onder kariyer" />
    </div>
  )
}

export default GenelMerkezKatılBanner