import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Clients from './components/Clients';
import Login from './components/Login';
import Cars from './components/Cars';
import CarHistory from './components/CarHistory';


function App() {
  return (
      <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<Cars />} />
          <Route path="/clients/:id/:carId" element={<CarHistory />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
