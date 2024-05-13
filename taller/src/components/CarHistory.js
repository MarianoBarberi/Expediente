// CarHistory.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

return (
    <div>
        <h2>Historial de {carName}</h2>
        {data && data.carHistory ? (
            <ul>
                {data.carHistory.map((carEntry) => (
                    <li key={carEntry.id}>{carEntry.service_of_car} - {new Date(carEntry.service_date).toLocaleDateString()} - {carEntry.comments}</li>
                ))}
            </ul>
        ) : (
            <p>Loading...</p>
        )}
    </div>
);
};

export default CarHistory;
