import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Home from './pages/home/index';
import UserForm from './components/questions/MerkezForm';
import YurtQuestions from './components/questions/YurtForm';
import JobList from './pages/jop-list/JobList';
import SuccessPage from './pages/SuccessPage/SuccessPage';
import YurtIlanForm from './components/İlanPages/YurtIlanForm';
import MerkezİlanForm from './components/İlanPages/MerkezİlanForm';
import Admin from './admin/AdminPanel';
import Politikamız from './pages/Politika/Politika';
import BasvuruDetay from './admin/Basvuru/BasvuruDetay';
import LoginPage from './admin/LoginPage';
import About from './pages/About/About';
import KVKK from './pages/KVKK/KVKK';


const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merkez-ilanlar/:id" element={<UserForm />} />
        <Route path="/yurt-ilanlar/:id" element={<YurtQuestions />} />
        <Route path="/jobs-list" element={<JobList />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path='/yurt-ilan-ac' element={<YurtIlanForm />}/>
        <Route path='/merkez-ilan-ac' element={<MerkezİlanForm />}/>
        <Route path='/login' element={<LoginPage />} />
        <Route path="/hakkımızda" element={<About />} />
        <Route path="/kvkk" element={<KVKK />} />
        <Route path='/admin' element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }/>
        <Route path="/basvuru-detay/:id" element={
          <ProtectedRoute>
            <BasvuruDetay />
          </ProtectedRoute>
        } />
        <Route path="/politika" element={<Politikamız />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;