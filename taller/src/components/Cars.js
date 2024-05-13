// Cars.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Cars = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [clientName, setClientName] = useState(null);

  useEffect(() => {
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
  
    fetchData();
  }, [id]);
  

  return (
    <div>
      <h2>Carros de {clientName}</h2>
      {data && data.cars ? (
        <ul>
          {data.cars.map((car) => (
            <li key={car.id}>
              <a href={`/clients/${id}/${car.id}`}>
                {car.name} - {car.year_of_car} - {car.km}km - {new Date(car.last_time_date).toLocaleDateString()} - {car.comments}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Cars;
