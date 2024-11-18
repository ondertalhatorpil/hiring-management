import React, { useState } from 'react';
import './css/admin.css'; // Tarzlarınızı buradan ekleyebilirsiniz
import MerkezİlanForm from '../components/İlanPages/MerkezİlanForm';
import YurtIlanForm from '../components/İlanPages/YurtIlanForm';
import GMİncele from './Basvuru/GMİncele';
import YMİncele from './Basvuru/YMİncele';
import KariyerLogo from '../assets/kariyer_orj.png'
import JopArsiv from './JobManagement/JobArsiv'
import HomeAdmin from './HomeAdmin'
import AdminSlider from './Slider/AdminSlider'



function AdminPanel() {
  const [isJobMenuOpen, setIsJobMenuOpen] = useState(false);
  const [isApplicationsMenuOpen, setIsApplicationsMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('');

  const toggleJobMenu = () => {
    setIsJobMenuOpen(!isJobMenuOpen);
  };

  const toggleApplicationsMenu = () => {
    setIsApplicationsMenuOpen(!isApplicationsMenuOpen);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'genelMerkezIlan':
        return <div><MerkezİlanForm /></div>;
      case 'yurtMudurlukleriIlan':
        return <div><YurtIlanForm /></div>;
      case 'genelMerkezBasvuru':
        return <div><GMİncele /></div>;
      case 'yurtMudurlukleriBasvuru':
        return <div><YMİncele /></div>;
      case 'İlanArşivle':
        return <div><JopArsiv /></div>;
      case 'slider':
        return <div><AdminSlider /></div>;
      default:
        return <div><HomeAdmin /></div>;
    }
  };

  return (
    <div className="admin-panel">
      <div className="sidebar">
        <img src={KariyerLogo} alt="Onder Logo" />
        <h3 onClick={toggleJobMenu} style={{ cursor: 'pointer' }}>
          İş İlanı Oluştur {isJobMenuOpen ? '-' : '+'}
        </h3>
        {isJobMenuOpen && (
          <ul>
            <li onClick={() => setSelectedMenu('genelMerkezIlan')}>Genel Merkez</li>
            <li onClick={() => setSelectedMenu('yurtMudurlukleriIlan')}>Yurt Müdürlükleri</li>
          </ul>
        )}

        <h3 onClick={() => setSelectedMenu('İlanArşivle')} style={{ cursor: 'pointer' }}>
          İş İlanı Arşivle 
        </h3>

        <h3 onClick={toggleApplicationsMenu} style={{ cursor: 'pointer' }}>
          Başvuruları İncele {isApplicationsMenuOpen ? '-' : '+'}
        </h3>
        {isApplicationsMenuOpen && (
          <ul>
            <li onClick={() => setSelectedMenu('genelMerkezBasvuru')}>Genel Merkez Başvuruları İncele</li>
            <li onClick={() => setSelectedMenu('yurtMudurlukleriBasvuru')}>Yurt Müdürlükleri Başvuruları İncele</li>
          </ul>
        )}

        <h3 onClick={() => setSelectedMenu('slider')} style={{ cursor: 'pointer' }}>
          Slider
        </h3>

      </div>

      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPanel;
