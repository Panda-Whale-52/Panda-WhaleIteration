import React, { useState } from 'react';
import config from '../config';
import '../styles/medicationList.css';
import MedicationItem from './MedicationItem';

const MedicationList = () => {
  const [medications, setMedications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [newMedication, setNewMedication] = useState({
    medication: '',
    description: ''
  });

  const handleAddMedication = async () => {
    const medicationData = {
      ...newMedication,
      date: new Date().toISOString(),
      userId: 'currentUserId',
      _id: Date.now().toString()
    };

    setMedications(prevMedications => [...prevMedications, medicationData]);
    setNewMedication({ medication: '', description: '' });
    setShowPopup(false);

    try {
      const response = await fetch(`${config.baseURL}/medication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`
        },
        body: JSON.stringify(medicationData),
      });

      if (!response.ok) {
        console.error('Failed to add medication');
        return;
      }

      const addedMedication = await response.json();
      setMedications(prevMedications => 
        prevMedications.map(med => 
          med._id === medicationData._id ? addedMedication : med
        )
      );
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const handleEditMedication = async () => {
    const updatedMedication = {
      ...editingMedication,
      medication: newMedication.medication,
      description: newMedication.description
    };
    
    setMedications(prevMedications => 
      prevMedications.map(med => 
        med._id === editingMedication._id ? updatedMedication : med
      )
    );
    setShowPopup(false);
    setEditingMedication(null);
    setNewMedication({ medication: '', description: '' });

    try {
      const response = await fetch(`${config.baseURL}/medication/${editingMedication._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedMedication),
      });

      if (!response.ok) {
        console.error('Failed to update medication');
        return;
      }
      
      const updatedFromServer = await response.json();
      setMedications(prevMedications =>
        prevMedications.map(med =>
          med._id === editingMedication._id ? updatedFromServer : med
        )
      );
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  const handleDelete = async (medicationId) => {
    setMedications(prevMedications => 
      prevMedications.filter(med => med._id !== medicationId)
    );

    try {
      const response = await fetch(`${config.baseURL}/medication/${medicationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        console.error('Failed to delete medication');
        return;
      }
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  const startEditing = (medication) => {
    setEditingMedication(medication);
    setNewMedication({
      medication: medication.medication,
      description: medication.description
    });
    setShowPopup(true);
  };

  return (
    <div className="medication-list-container">
      <div className="medication-list-header">
        <h1>My Medications</h1>
        <button 
          className="add-medication-btn"
          onClick={() => {
            setEditingMedication(null);
            setNewMedication({ medication: '', description: '' });
            setShowPopup(true);
          }}
        >
          + Add Medication
        </button>
      </div>

      <div className="medication-list">
        {medications.map((medication) => (
          <MedicationItem
            key={medication._id}
            medication={medication}
            onEdit={startEditing}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{editingMedication ? 'Edit Medication' : 'Add New Medication'}</h2>
            <div className="form-group">
              <label htmlFor="medication">Medication Name:</label>
              <input
                type="text"
                id="medication"
                value={newMedication.medication}
                onChange={(e) => setNewMedication({
                  ...newMedication,
                  medication: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description/Dosage:</label>
              <textarea
                id="description"
                value={newMedication.description}
                onChange={(e) => setNewMedication({
                  ...newMedication,
                  description: e.target.value
                })}
              />
            </div>
            <div className="popup-buttons">
              <button onClick={editingMedication ? handleEditMedication : handleAddMedication}>
                {editingMedication ? 'Save' : 'Add'}
              </button>
              <button onClick={() => {
                setShowPopup(false);
                setEditingMedication(null);
                setNewMedication({ medication: '', description: '' });
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationList; 