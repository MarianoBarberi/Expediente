// CarHistory.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import useSearch from './search';

const CarHistory = () => {
  const { carId, id } = useParams();   
  const [data, setData] = useState(null);
  const [carName, setCarName] = useState(null);
  const [newCarHistory, setNewCarHistory] = useState({
    service_of_car: '',
    service_date: new Date().toISOString().split('T')[0],
    service_date_end: new Date().toISOString().split('T')[0],
    comments: ''
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedCarHistory, setSelectedCarHistory] = useState(null);
  const [clientName, setClientName] = useState(null);


  const handleAdd = () => {
    setModalType('add');
    setModalOpen(true);
  };

  const handleEdit = (carHistoryId) => {
    setModalType('edit');
    setSelectedCarHistory(carHistoryId);
    setModalOpen(true);
    const carHistory = data.carHistory.find((c) => c.id === carHistoryId);
    setNewCarHistory({
      service_of_car: carHistory.service_of_car,
      service_date: new Date(carHistory.service_date).toISOString().split('T')[0],
      service_date_end: new Date(carHistory.service_date_end).toISOString().split('T')[0],
      comments: carHistory.comments
    });
  };

  const handleDelete = (carHistoryId) => {
    setModalType('delete');
    setSelectedCarHistory(carHistoryId);
    setModalOpen(true);
    setNewCarHistory( data.carHistory.find((c) => c.id === carHistoryId));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCarHistory(null);
    setModalType('');
    setNewCarHistory({
      service_of_car: '',
      service_date: new Date().toISOString().split('T')[0],
      service_date_end: new Date().toISOString().split('T')[0],
      comments: ''
    });
  };

  const handleAction = async () => {
    switch (modalType) {
      case 'add':
        try {
          const response = await fetch('https://expediente.onrender.com/api/addCarHistory', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              service_of_car: newCarHistory.service_of_car,
              service_date: newCarHistory.service_date,
              service_date_end: newCarHistory.service_date_end,
              comments: newCarHistory.comments,
              car_id: carId
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }

          fetchData();
          handleCloseModal();
        } catch (error) {
          console.error('Error adding car history:', error);
        }
        break;
      case 'edit':
        try {
          await fetch(`https://expediente.onrender.com/api/editCarHistory/${selectedCarHistory}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCarHistory),
          });
          fetchData();
          handleCloseModal();
        } catch (error) {
          console.error('Error editing car history:', error);
        }
        break;
      case 'delete':
        try {
          const response = await fetch(`https://expediente.onrender.com/api/deleteCarHistory/${selectedCarHistory}`, {
            method: 'DELETE',
          });

          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }
          
          fetchData();
          handleCloseModal();
        } catch (error) {
          console.error('Error deleting car:', error);
        }
        break;
      default:
        break;
    }
  };


  const fetchData = async () => {
    try {
      const [carHistoryResponse, carNameResponse, clientNameResponse] = await Promise.all([
        fetch(`https://expediente.onrender.com/api/getAllCarHistoryOfCar/${carId}`).then(response => response.json()),
        fetch(`https://expediente.onrender.com/api/getCarName/${carId}`).then(response => response.json()),
        fetch(`https://expediente.onrender.com/api/getClientName/${id}`).then(response => response.json())
      ]);

      setData(carHistoryResponse);
      setCarName(carNameResponse.car[0].name);
      setClientName(clientNameResponse.client[0].name);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [carId]);


  const { searchTerm, handleSearch, filteredData } = useSearch(data ? data.carHistory : [], 'service_of_car');


return (
    <div className='all'>
      <div className='titleDiv'>
        <a href={`/clients/${id}`} className='link'>
          <button>
          Back 
          </button>
        </a>
      </div>
        <h2>Historial de {carName}</h2>
        <h3 style={{color:'gray'}}>Carro de {clientName} </h3>

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
            <button className='addBtn' onClick={handleAdd}>Añadir</button>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((carEntry) => (
                <tr key={carEntry.id}>
                  <td>{carEntry.service_of_car}</td>
                  <td>{new Date(carEntry.service_date).toLocaleDateString()}</td>
                  <td>{new Date(carEntry.service_date_end).toLocaleDateString()}</td>
                  <td>{carEntry.comments}</td>
                  <td className='center'>
                    <button className='edtBtn' onClick={() => handleEdit(carEntry.id)}><img src="/edit.svg" alt="Edit"/></button>
                  <button className='dltBtn' onClick={() => handleDelete(carEntry.id)}><img src="/delete.svg" alt="Delete"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className='modal'>
            <div className='modal-content'>
            <div className='modalTitle'>
                <button className='backBtn' onClick={handleCloseModal}><img src="/back.svg" alt="Back"/></button>
                {modalType === 'add' && <h2>Añadir Servicio</h2>}
                {modalType === 'edit' && <h2>Editar {newCarHistory.service_of_car}</h2>}
                {modalType === 'delete' && <h2>Eliminar {newCarHistory.service_of_car}</h2>}
              </div>
              {modalType !== 'delete' && (
                <>
                <input
                  type='text'
                  placeholder='Servicio'
                  value={newCarHistory.service_of_car}
                  onChange={(e) => setNewCarHistory({ ...newCarHistory, service_of_car: e.target.value })}
                />
                <input
                  type='date'
                  placeholder='Fecha de Entrada'
                  value={newCarHistory.service_date}
                  onChange={(e) => setNewCarHistory({ ...newCarHistory, service_date: e.target.value })}
                />
                <input
                  type='date'
                  placeholder='Fecha de Salida'
                  value={newCarHistory.service_date_end}
                  onChange={(e) => setNewCarHistory({ ...newCarHistory, service_date_end: e.target.value })}
                />
                <input
                  type='text'
                  placeholder='Comentarios'
                  value={newCarHistory.comments}
                  onChange={(e) => setNewCarHistory({ ...newCarHistory, comments: e.target.value })}
                />
              </>
              )}
              <button onClick={handleAction} className='addBtn'>
                {modalType === 'add' && 'Añadir'}
                {modalType === 'edit' && 'Editar'}
                {modalType === 'delete' && 'Eliminar'}
              </button>
            </div>
          </div>
        )}
    </div>
);
};

export default CarHistory;
