import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Clients from './components/Clients';
import Login from './components/Login';
import Cars from './components/Cars';
import CarHistory from './components/CarHistory';
import AllCars from './components/AllCars';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {!isLoggedIn && <Route path="/" element={<Login />} />}
          {isLoggedIn && <Route path="/clients" element={<Clients />} />}
          {isLoggedIn && <Route path="/clients/:id" element={<Cars />} />}
          {isLoggedIn && <Route path="/clients/:id/:carId" element={<CarHistory />} />}
          {isLoggedIn && <Route path="/carros" element={<AllCars />} />}
          {!isLoggedIn && <Route to="/" />}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
