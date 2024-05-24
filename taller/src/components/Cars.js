// Cars.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import useSearch from './search';

const Cars = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [clientName, setClientName] = useState(null);
  const [newCar, setNewCar] = useState({
    name: '',
    year: '',
    color: '',
    last_time_date: new Date().toISOString().split('T')[0],
    km: '',
    comments: '',
    isInTaller: false
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  
  const fetchData = async () => {
    try {
      const [carsResponse, clientNameResponse] = await Promise.all([
        fetch(`https://expediente.onrender.com/api/getAllCarsOfClient/${id}`),
        fetch(`https://expediente.onrender.com/api/getClientName/${id}`)
      ]);
  
      const [carsResult, clientNameResult] = await Promise.all([
        carsResponse.json(),
        clientNameResponse.json()
      ]);
  
      setData(carsResult);
      setClientName(clientNameResult.client[0].name);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [id]);
  
  const handleAdd = () => {
    setModalType('add');
    setModalOpen(true);
  };

  const handleEdit = (carId) => {
    setModalType('edit');
    setSelectedClient(carId);
    setModalOpen(true);
    const car = data.cars.find((c) => c.id === carId);
    setNewCar({
      name: car.name,
      year: car.year_of_car,
      color: car.color,
      last_time_date: new Date(car.last_time_date).toISOString().split('T')[0],
      km: car.km,
      comments: car.comments,
      isInTaller: car.isInTaller
    });
  };

  const handleDelete = ( carId ) => {
    setModalType('delete');
    setSelectedClient(carId);
    setModalOpen(true);
    setNewCar(data.cars.find((c) => c.id === carId));    
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClient(null);
    setModalType('');
    setNewCar({
      name: '',
      year: '',
      color: '',
      last_time_date: new Date().toISOString().split('T')[0],
      km: '',
      comments: '',
      isInTaller: false
    });
  };

  const handleAction = async () => {
    switch (modalType) {
      case 'add':
        try {
          const response = await fetch('https://expediente.onrender.com/api/addCar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              name: newCar.name, 
              year_of_car: newCar.year, 
              color: newCar.color, 
              last_time_date: newCar.last_time_date,
              km: newCar.km, 
              comments: newCar.comments, 
              client_id: id,
              isInTaller: newCar.isInTaller
            }),
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }
  
          fetchData();
          handleCloseModal();
        } catch (error) {
          console.error('Error adding car:', error);
        }
        break;
      case 'edit':
        try {
          const response = await fetch(`https://expediente.onrender.com/api/editCar/${selectedClient}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              name: newCar.name, 
              year_of_car: newCar.year, 
              color: newCar.color, 
              last_time_date: newCar.last_time_date,
              km: newCar.km, 
              comments: newCar.comments, 
              client_id: id,
              isInTaller: newCar.isInTaller
            }),
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }
  
          fetchData();
          handleCloseModal();
        } catch (error) {
          console.error('Error editing car:', error);
        }
        break;
      case 'delete':
        try {
          const response = await fetch(`https://expediente.onrender.com/api/deleteCar/${selectedClient}`, {
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
  


  const { searchTerm, handleSearch, filteredData } = useSearch(data ? data.cars : [], 'name');

  return (
    <div className='all'>
      <div className='titleDiv'>
        <a href={`/clients`} className='link link2'>
          <button>
          Back 
          </button>
        </a>
      </div>
        <h2>Carros de {clientName}</h2>

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
              {data && data.cars.map((car) => (
                <option key={car.id} value={car.name} />
              ))}
            </datalist>
            <button className='addBtn' onClick={handleAdd}>Añadir</button>
          </div>
        </div>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Año</th>
                <th>Color</th>
                <th>Km</th>
                <th>Última Fecha</th>
                <th>Comentarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((car) => (
                <tr key={car.id}>
                  <td><a href={`/clients/${id}/${car.id}`} className='link'>{car.name}</a></td>
                  <td><a href={`/clients/${id}/${car.id}`} className='link'>{car.year_of_car}</a></td>
                  <td><a href={`/clients/${id}/${car.id}`} className='link'>{car.color}</a></td>
                  <td><a href={`/clients/${id}/${car.id}`} className='link'>{car.km}</a></td>
                  <td><a href={`/clients/${id}/${car.id}`} className='link'>{new Date(car.last_time_date).toLocaleDateString()}</a></td>
                  <td><a href={`/clients/${id}/${car.id}`} className='link'>{car.comments}</a></td>
                  <td className='center'>
                    <button className='edtBtn' onClick={() => handleEdit(car.id)}><img src="/edit.svg" alt="Edit" /></button>
                    <button className='dltBtn' onClick={() => handleDelete(car.id)}><img src="/delete.svg" alt="Delete"/></button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <div className='modalTitle cars'>
                <button className='backBtn' onClick={handleCloseModal}><img src="/back.svg" alt="Back"/></button>
                {modalType === 'add' && <h2>Añadir Carro</h2>}
                {modalType === 'edit' && <h2>Editar {newCar.name}</h2>}
                {modalType === 'delete' && <h2>Eliminar {newCar.name}</h2>}
                {modalType !== 'delete' && (
                  <>
                  <h2 style={{marginLeft:'auto', color:'gray'}}>{newCar.isInTaller ? 'En taller' : 'Fuera de taller'}</h2>
                  <input
                    type="checkbox"
                    placeholder="Esta en taller"
                    checked={newCar.isInTaller}
                    onChange={(e) => setNewCar({ ...newCar, isInTaller: e.target.checked })}
                    className='check'
                  />
                  </>
                )}
              </div>
              {modalType !== 'delete' && (
                <>
                <input 
                type="text" 
                placeholder="Nombre del Carro" 
                value={newCar.name} 
                onChange={(e) => setNewCar({ ...newCar, name: e.target.value })} 
              />
              <input 
                type="text" 
                placeholder="Año" 
                value={newCar.year} 
                onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} 
              />
              <input 
                type="text" 
                placeholder="Color" 
                value={newCar.color} 
                onChange={(e) => setNewCar({ ...newCar, color: e.target.value })} 
              />
              <input 
                type="date" 
                placeholder="Última Fecha" 
                value={newCar.last_time_date} 
                onChange={(e) => setNewCar({ ...newCar, last_time_date: e.target.value })}
              />
              <input 
                type="text" 
                placeholder="Kilometraje" 
                value={newCar.km} 
                onChange={(e) => setNewCar({ ...newCar, km: e.target.value })} 
              />
              <input 
                type="text" 
                placeholder="Comentarios" 
                value={newCar.comments} 
                onChange={(e) => setNewCar({ ...newCar, comments: e.target.value })} 
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

export default Cars;
