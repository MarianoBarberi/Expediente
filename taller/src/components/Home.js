import React from 'react';


const Home = () => {
  return (
    <div className='all'>
      <h1>Home Page</h1>
      <a href="/clients" className='link'>
        <button className='link3'>
          Clients
        </button>
        </a>
      <a href="/carros" className='link'>
        <button className='link3'>
          Cars
        </button>
        </a>
    </div>
  );
};


export default Home;