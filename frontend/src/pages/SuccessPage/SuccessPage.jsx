import React from 'react';
import { Link } from 'react-router-dom';

import Success from '../../assets/success.jpg'

import './success.css'

import { BiLeftArrowAlt } from "react-icons/bi";


import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const SuccessPage = () => {
    return (
        <div>
          <Header />
            <div className='successForm'>
              <img src={Success} alt="Önder İHL" />
            <h1>Form Başarıyla Gönderildi!</h1>
            <p>Başvurunuz için teşekkür ederiz. En kısa sürede sizinle iletişime geçeceğiz.</p>
           <div className='homeLink'>
           <BiLeftArrowAlt className='homeicon' />
           <Link to="/">Ana Sayfaya Dön</Link>
           </div>
            </div>
            <Footer />
        </div>
    );
};

export default SuccessPage;