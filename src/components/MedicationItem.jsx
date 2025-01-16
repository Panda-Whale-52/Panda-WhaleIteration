import React from 'react';
import '../styles/medicationItem.css';

const MedicationItem = ({ medication, onEdit, onDelete }) => {
  return (
    <div className="medication-item">
      <h3>{medication.medication}</h3>
      <p>{medication.description}</p>
      
      <div className="medication-item-options">
        <button 
          className="edit-btn"
          onClick={() => onEdit(medication)}
        >
          Edit
        </button>
        <button 
          className="delete-btn"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this medication?')) {
              onDelete(medication._id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MedicationItem; 