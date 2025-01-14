// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://apis.ccbp.in/list-creation/lists';

function App() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLists, setSelectedLists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data.lists)) {
        setLists(response.data.lists);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectList = (id) => {
    setSelectedLists((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCreateNewList = () => {
    if (selectedLists.length !== 2) {
      alert('You should select exactly 2 lists to create a new list');
      return;
    }
    setIsCreating(true);
  };

  const handleCancelCreation = () => {
    setIsCreating(false);
  };

  const handleUpdateLists = () => {
    // Logic to update lists
    setIsCreating(false);
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-view">
        <p>{error}</p>
        <button onClick={fetchLists}>Try Again</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
        {isCreating ? (
          <ListCreationView
            selectedLists={selectedLists}
            onCancel={handleCancelCreation}
            onUpdate={handleUpdateLists}
          />
        ) : (
          <AllListsView
            lists={lists}
            selectedLists={selectedLists}
            onSelectList={handleSelectList}
            onCreateNewList={handleCreateNewList}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const resetError = () => setHasError(false);

  try {
    if (hasError) throw new Error('Error occurred');
    return children;
  } catch (error) {
    return (
      <div className="error-boundary">
        <h2>Something went wrong</h2>
        <button onClick={resetError}>Try Again</button>
      </div>
    );
  }
};

const AllListsView = ({ lists, selectedLists, onSelectList, onCreateNewList }) => {
  const groupedLists = lists.reduce((acc, list) => {
    if (!acc[list.list_number]) {
      acc[list.list_number] = [];
    }
    acc[list.list_number].push(list);
    return acc;
  }, {});

  return (
    <div>
      <h1 className='center-align'>Create Lists</h1>
      <button className='create-btn' onClick={onCreateNewList} style={{ alignSelf: 'flex-start' }}>Create a new list</button>
      <div className="lists-view" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {Object.keys(groupedLists).map((listNumber) => (
          <div
            key={listNumber}
            className="list-group"
            style={{
              width: '48%',
              maxHeight: '3000px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <div style={{display: 'flex'}}>
            <input type="checkbox"/>
            <h2>List {listNumber}</h2>
            </div>

            {groupedLists[listNumber].map((item) => (
              <div key={item.id} className="list-container">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

  );
};

const ListCreationView = ({ selectedLists, onCancel, onUpdate }) => (
  <div className="creation-view">
    <h2>List Creation</h2>
    <p>List creation functionality will go here</p>
    <button onClick={onCancel}>Cancel</button>
    <button onClick={onUpdate}>Update</button>
  </div>
);

export default App;