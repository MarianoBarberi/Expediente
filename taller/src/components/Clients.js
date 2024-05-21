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

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getAllClients');
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
    setNewClientLastTimeDate(new Date().toISOString().split('T')[0]);
  };

  const handleAction = async () => {
    switch (modalType) {
      case 'add':
        try {
          const response = await fetch('http://localhost:5000/api/addClient', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newClientName, last_time_date: newClientLastTimeDate }),
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
          const response = await fetch(`http://localhost:5000/api/editClient/${selectedClient}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newClientName, last_time_date: newClientLastTimeDate }),
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
          const response = await fetch(`http://localhost:5000/api/deleteClient/${selectedClient}`, {
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
        <button onClick={() => window.history.back()}>Back</button>
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
              <th>Última Fecha</th>
              <th colSpan="2" className="center">
                Acciones
              </th>
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
                    {new Date(client.last_time_date).toLocaleDateString()}
                  </a>
                </td>
                <td className="center">
                  <button className="edtBtn" onClick={() => handleEdit(client.id)}>
                    Editar
                  </button>
                </td>
                <td className="center">
                  <button className="dltBtn" onClick={() => handleDelete(client.id)}>
                    X
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
              <button className="dltBtn dltBtn2" onClick={handleCloseModal}>
                X
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
