import React, { useState } from 'react';
import axios from 'axios';

const CreateActivityForm = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8000/activities', null, {
        params: {
          name: name
        }
      });

      
      /*
      const response2 = await fetch(process.env.REACT_APP_BACKEND + '/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });
      */

  
      console.log('Activity created successfully!');
      console.log('Activity ID:', response.data.id);
      setError('');
    } catch (error) {
      console.error('Error creating activity:', error);
      setError('Failed to create activity');
    }
  };
  

  return (
    <div>
      <h1>Create Activity</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="submit" value="Create Activity" />
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreateActivityForm;
