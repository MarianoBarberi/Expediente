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
    km: '',
    comments: ''
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);


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
      km: car.km,
      comments: car.comments
    });
  };

  const handleDelete = ( carId ) => {
    setModalType('delete');
    setSelectedClient(carId);
    setModalOpen(true);
    const car = data.cars.find((c) => c.id === carId);
    setNewCar({
      name: car.name,
      year: car.year_of_car,
      color: car.color,
      km: car.km,
      comments: car.comments
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClient(null);
    setModalType('');
    setNewCar({
      name: '',
      year: '',
      color: '',
      km: '',
      comments: ''
    });
  };

  const handleAction = async () => {
    switch (modalType) {
      case 'add':
        try {
          const response = await fetch('http://localhost:5000/api/addCar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              name: newCar.name, 
              year_of_car: newCar.year, 
              color: newCar.color, 
              km: newCar.km, 
              comments: newCar.comments, 
              client_id: id
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
          const response = await fetch(`http://localhost:5000/api/editCar/${selectedClient}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              name: newCar.name, 
              year_of_car: newCar.year, 
              color: newCar.color, 
              km: newCar.km, 
              comments: newCar.comments, 
              client_id: id
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
          const response = await fetch(`http://localhost:5000/api/deleteCar/${selectedClient}`, {
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
      const [carsResponse, clientNameResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/getAllCarsOfClient/${id}`),
        fetch(`http://localhost:5000/api/getClientName/${id}`)
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

  const { searchTerm, handleSearch, filteredData } = useSearch(data ? data.cars : [], 'name');

  return (
    <div className='all'>
      <div className='titleDiv'>
        <button onClick={() => window.history.back()}>Back</button>
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
                <th>Kilometraje</th>
                <th>Última Fecha</th>
                <th>Comentarios</th>
                <th colSpan="2" className='center'>Acciones</th>
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
                  <td className='center'><button className='edtBtn' onClick={() => handleEdit(car.id)}>Editar</button></td>
                  <td className='center'><button className='dltBtn' onClick={() => handleDelete(car.id)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <div className='modalTitle'>
                <button className='dltBtn dltBtn2' onClick={handleCloseModal}>X</button>
                {modalType === 'add' && <h2>Añadir Cliente</h2>}
                {modalType === 'edit' && <h2>Editar {newCar.name}</h2>}
                {modalType === 'delete' && <h2>Eliminar {newCar.name}</h2>}
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
