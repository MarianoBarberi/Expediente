// AllCars.js
import React, { useState, useEffect } from 'react';
import './styles.css';
import useSearch from './search';

const AllCars = () => {

    const [data, setData] = useState(null);

    const [newCar, setNewCar] = useState({
      name: '',
      year: '',
      color: '',
      last_time_date: new Date().toISOString().split('T')[0],
      km: '',
      comments: '',
      client_id: '',
      isInTaller: false,
      NombreCliente: ''
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
        last_time_date: new Date(car.last_time_date).toISOString().split('T')[0],
        km: car.km,
        comments: car.comments,
        client_id: car.client_id,
        isInTaller: car.isInTaller,
        NombreCliente: car.NombreCliente
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
        client_id: '',
        isInTaller: false,
        NombreCliente: ''
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
                last_time_date: newCar.last_time_date,
                km: newCar.km, 
                comments: newCar.comments, 
                client_id: newCar.client_id,
                isInTaller: newCar.isInTaller,
                NombreCliente: newCar.NombreCliente
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
                last_time_date: newCar.last_time_date,
                km: newCar.km, 
                comments: newCar.comments, 
                client_id: newCar.client_id,
                isInTaller: newCar.isInTaller,
                NombreCliente: newCar.NombreCliente
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
            const response = await fetch('http://localhost:5000/api/getAllCars');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const { searchTerm, handleSearch, filteredData } = useSearch(data ? data.cars : [], 'name');

    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
      setActiveTab(index);

    };

    return (
        <div className='all'>
      <div className='titleDiv'>
        <button onClick={() => window.history.back()}>Back</button>
      </div>
        <h2>Carros</h2>

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
        <div className='navigation'>
          <h3 className={`navigationTitle ${activeTab === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>Dentro de Taller</h3>
          <h3 className={`navigationTitle ${activeTab === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)}>Fuera de Taller</h3>
        </div>
        <div className="table-container">
          <table className="styled-table" style={{ display: activeTab === 0 ? '' : 'none' }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Año</th>
                <th>Color</th>
                <th>Kilometraje</th>
                <th>Última Fecha</th>
                <th>Comentarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData
              .filter(car => car.isInTaller)
              .map((car) => (
                <tr key={car.id}>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'> {car.name}</a></td>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'>  {car.year_of_car} </a></td>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'>  {car.color} </a></td>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'>  {car.km} </a></td>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'>  {new Date(car.last_time_date).toLocaleDateString()} </a></td>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'>  {car.comments} </a></td>
                  <td className='center'>
                    <button className='edtBtn' onClick={() => handleEdit(car.id)}><img src="/edit.svg" alt="edit"/></button>
                    <button className='dltBtn' onClick={() => handleDelete(car.id)}><img src="/delete.svg" alt="delete"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="styled-table" style={{ display: activeTab === 1 ? '' : 'none' }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Año</th>
                <th>Color</th>
                <th>Kilometraje</th>
                <th>Última Fecha</th>
                <th>Comentarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData
              .filter(car => !car.isInTaller)
              .map((car) => (
                <tr key={car.id}>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'> {car.name}</a></td>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'>  {car.year_of_car} </a></td>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'>  {car.color} </a></td>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'>  {car.km} </a></td>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'>  {new Date(car.last_time_date).toLocaleDateString()} </a></td>
                  <td><a href={`/clients/${car.client_id}/${car.id}`} className='link'>  {car.comments} </a></td>
                  <td className='center'>
                    <button className='edtBtn' onClick={() => handleEdit(car.id)}><img src="/edit.svg" alt="edit"/></button>
                    <button className='dltBtn' onClick={() => handleDelete(car.id)}><img src="/delete.svg" alt="delete"/></button>
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
                {modalType === 'edit' && 
                <div>
                  <h2>Editar {newCar.name}</h2>
                  <h3 style={{color:'gray'}}>{newCar.NombreCliente}</h3>
                </div>
                }
                {modalType === 'delete' &&
                <div>
                  <h2>Eliminar {newCar.name}</h2>
                  <h3 style={{color:'gray'}}>{newCar.NombreCliente}</h3>
                </div>
                }
                {modalType !== 'delete' && (
                  <>
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
}

export default AllCars;