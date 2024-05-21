// CarHistory.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import useSearch from './search';

const CarHistory = () => {
  const { carId } = useParams();   
  const [data, setData] = useState(null);
  const [carName, setCarName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carHistoryResponse, carNameResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/getAllCarHistoryOfCar/${carId}`).then(response => response.json()),
          fetch(`http://localhost:5000/api/getCarName/${carId}`).then(response => response.json())
        ]);

        setData(carHistoryResponse);
        setCarName(carNameResponse.car[0].name);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [carId]);


  const { searchTerm, handleSearch, filteredData } = useSearch(data ? data.carHistory : [], 'service_of_car');


return (
    <div className='all'>
      <div className='titleDiv'>
        <button onClick={() => window.history.back()}>Back</button>
      </div>
        <h2>Historial de {carName}</h2>

        <div className="search-container">
          <div className="smaller-search-container">
            <input
              type="text"
              list="names"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={handleSearch}
              className='search-input'
            />
            <datalist id="names">
              {data && data.carHistory.map((carEntry) => (
                <option key={carEntry.id} value={carEntry.service_of_car} />
              ))}
            </datalist>
            <button className='addBtn'>Añadir</button>
          </div>
        </div>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Fecha de Entrada</th>
                <th>Fecha de Salida</th>
                <th>Comentarios</th>
                <th colSpan="2" className='center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((carEntry) => (
                <tr key={carEntry.id}>
                  <td>{carEntry.service_of_car}</td>
                  <td>{new Date(carEntry.service_date).toLocaleDateString()}</td>
                  <td>{new Date(carEntry.service_date_end).toLocaleDateString()}</td>
                  <td>{carEntry.comments}</td>
                  <td className='center'><button className='edtBtn'>Editar</button></td>
                  <td className='center'><button className='dltBtn'>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
);
};

export default CarHistory;
