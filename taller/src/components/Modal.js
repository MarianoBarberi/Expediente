import React from 'react';

const Modal = ({ type, clientId, onClose, data }) => {
  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/addClient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.newClientName, last_time_date: data.newClientlast_time_date }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      onClose(); // Cierra el modal después de agregar
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/editClient/${clientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: clientId, name: data.newClientName, last_time_date: data.newClientlast_time_date }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      onClose(); // Cierra el modal después de editar
    } catch (error) {
      console.error('Error editing client:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/deleteClient/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      onClose(); // Cierra el modal después de eliminar
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {type === 'add' && (
          <>
            <h2>Añadir Cliente</h2>
            <input 
              type="text" 
              placeholder="Nombre del Cliente" 
              value={data.newClientName} 
              onChange={(e) => data.setNewClientName(e.target.value)} 
            />
            <input 
              type="date" 
              value={data.newClientlast_time_date} 
              onChange={(e) => data.setNewClientlast_time_date(e.target.value)} 
            />
            <button onClick={handleAdd}>Añadir</button>
          </>
        )}
        {type === 'edit' && (
          <>
            <h2>Editar Cliente</h2>
            <input 
              type="text" 
              placeholder="Nombre del Cliente" 
              value={data.newClientName}
              onChange={(e) => data.setNewClientName(e.target.value)} 
            />
            <input 
              type="date" 
              value={data.newClientlast_time_date}
              onChange={(e) => data.setNewClientlast_time_date(e.target.value)} 
            />
            <button onClick={handleEdit}>Editar</button>
          </>
        )}
        {type === 'delete' && (
          <>
            <h2>Eliminar Cliente</h2>
            <p>¿Estás seguro de que quieres eliminar este cliente?</p>
            <div style={{ display: 'flex', gap: '5px', margin: '0px auto' }}>
              <button onClick={handleDelete}>Sí</button>
              <button onClick={onClose}>No</button>
            </div>
          </>
        )}
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default Modal;
