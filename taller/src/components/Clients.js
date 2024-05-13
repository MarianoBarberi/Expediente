// Clients.js
import React from 'react';
import { useState, useEffect } from 'react';

const Clients = () => {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getAllClients');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {data && data.clients.flat().map((client) => (
          <li key={client.id}>
            <a href={`/clients/${client.id}`}>{client.name} - {new Date(client.last_time_date).toLocaleDateString()}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;
