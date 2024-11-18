import React from 'react'
import './footer.css'
import {Link} from 'react-router-dom'
const Footer = () => {
  return (
    <div className='F-Container'>
        <div className='radio-footer'>
        <Link to='/kvkk'>
        KVKK Sözleşmesi
        </Link>
        <p>2024 © Önder Kariyer. Tüm Hakları Saklıdır</p>
        <p>insankaynaklari@onder.org.tr</p>
        </div>
    </div>
  )
}

export default Footer