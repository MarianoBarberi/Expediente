import React, { useState, useEffect } from 'react';
import './styles.css';
import useSearch from './search';

const Clients = () => {
  const [data, setData] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientLastTimeDate, setNewClientLastTimeDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPhone, setNewPhone] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('https://expediente.onrender.com/api/getAllClients');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setModalType('add');
    setModalOpen(true);
  };

  const handleEdit = (clientId) => {
    setSelectedClient(clientId);
    setModalType('edit');
    setModalOpen(true);
    const client = data.clients.find((c) => c.id === clientId);
    setNewClientName(client.name);
    setNewPhone(client.phone);
    setNewClientLastTimeDate(new Date(client.last_time_date).toISOString().split('T')[0]);
  };

  const handleDelete = (clientId) => {
    setSelectedClient(clientId);
    setNewClientName(data.clients.find((c) => c.id === clientId).name);
    setModalType('delete');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClient(null);
    setModalType('');
    setNewClientName('');
    setNewPhone('');
    setNewClientLastTimeDate(new Date().toISOString().split('T')[0]);
  };

  const handleAction = async () => {
    switch (modalType) {
      case 'add':
        try {
          const response = await fetch('https://expediente.onrender.com/api/addClient', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newClientName, last_time_date: newClientLastTimeDate, phone: newPhone}),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }

          fetchData();
          handleCloseModal();
        } catch (error) {
          console.error('Error adding client:', error);
        }
        break;
      case 'edit':
        try {
          const response = await fetch(`https://expediente.onrender.com/api/editClient/${selectedClient}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newClientName, last_time_date: newClientLastTimeDate, phone: newPhone}),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }

          fetchData();
          handleCloseModal();
        } catch (error) {
          console.error('Error editing client:', error);
        }
        break;
      case 'delete':
        try {
          const response = await fetch(`https://expediente.onrender.com/api/deleteClient/${selectedClient}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }

          fetchData();
          handleCloseModal();
        } catch (error) {
          console.error('Error deleting client:', error);
        }
        break;
      default:
        break;
    }
  };

  const { searchTerm, handleSearch, filteredData } = useSearch(data ? data.clients : [], 'name');

  return (
    <div className="all">
      <div className="titleDiv">
        <a href={`/`} className='link link2'>
          <button>
          Back 
          </button>
        </a>
      </div>
      <h2>Clientes</h2>
      <div className="search-container">
        <div className="smaller-search-container">
          <input
            type="text"
            list="names"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <datalist id="names">
            {data &&
              data.clients.map((client) => (
                <option key={client.id} value={client.name} />
              ))}
          </datalist>
          <button className="addBtn" onClick={handleAdd}>
            Añadir
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Última Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((client) => (
              <tr key={client.id}>
                <td>
                  <a href={`/clients/${client.id}`} className="link">
                    {client.name}
                  </a>
                </td>
                <td>
                  <a href={`/clients/${client.id}`} className="link">
                    {client.phone}
                  </a>
                </td>
                <td>
                  <a href={`/clients/${client.id}`} className="link">
                    {new Date(client.last_time_date).toLocaleDateString()}
                  </a>
                </td>
                <td className="center">
                  <button className="edtBtn" onClick={() => handleEdit(client.id)}>
                  <img src="/edit.svg" alt="Edit"/>
                  </button>
                
                  <button className="dltBtn" onClick={() => handleDelete(client.id)}>
                  <img src="/delete.svg" alt="Delete"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modalTitle">
              <button className="backBtn" onClick={handleCloseModal}>
              <img src="/back.svg" alt="Back"/>
              </button>
              {modalType === 'add' && <h2>Añadir Cliente</h2>}
              {modalType === 'edit' && <h2>Editar {newClientName}</h2>}
              {modalType === 'delete' && <h2>Eliminar {newClientName}</h2>}
            </div>
            {modalType !== 'delete' && (
              <>
                <input
                  type="text"
                  placeholder="Nombre del Cliente"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
                <input
                  type="date"
                  value={newClientLastTimeDate}
                  onChange={(e) => setNewClientLastTimeDate(e.target.value)}
                />
              </>
            )}
            <button onClick={handleAction} className="addBtn">
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

export default Clients;
