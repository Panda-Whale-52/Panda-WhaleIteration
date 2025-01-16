import React, { useState } from 'react';
import config from '../config';
import '../styles/exerciseList.css';
import ExerciseItem from './ExerciseItem';

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [newExercise, setNewExercise] = useState({
    exercise: '',
    description: ''
  });

  const handleAddExercise = async () => {
    const exerciseData = {
      ...newExercise,
      date: new Date().toISOString(),
      userId: 'currentUserId', //this will be supplanted with the user id from the token 
      _id: Date.now().toString()
    };

    setExercises([...exercises, exerciseData]);
    setNewExercise({ exercise: '', description: '' });
    setShowPopup(false);

    try {
      const response = await fetch(`${config.baseURL}/exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`
        },
        body: JSON.stringify(exerciseData),
      });

      if (!response.ok) {
        console.error('Failed to add exercise');
        return;
      }

      const addedExercise = await response.json();
      setExercises(prevExercises => 
        prevExercises.map(ex => 
          ex._id === exerciseData._id ? addedExercise : ex
        )
      );
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const handleEditExercise = async () => {
    const updatedExercise = {
      ...editingExercise,
      exercise: newExercise.exercise,
      description: newExercise.description
    };
    
    setExercises(prevExercises => 
      prevExercises.map(ex => 
        ex._id === editingExercise._id ? updatedExercise : ex
      )
    );
    setShowPopup(false);
    setEditingExercise(null);
    setNewExercise({ exercise: '', description: '' });

    try {
      const response = await fetch(`${config.baseURL}/exercise/${editingExercise._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`
        },
        body: JSON.stringify(updatedExercise),
      });

      if (!response.ok) {
        console.error('Failed to update exercise');
        return;
      }
      
      const updatedFromServer = await response.json();
      setExercises(prevExercises =>
        prevExercises.map(ex =>
          ex._id === editingExercise._id ? updatedFromServer : ex
        )
      );
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const handleDelete = async (exerciseId) => {
    setExercises(prevExercises => prevExercises.filter(ex => ex._id !== exerciseId));

    try {
      const response = await fetch(`${config.baseURL}/exercise/${exerciseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`
        },
      });

      if (!response.ok) {
        console.error('Failed to delete exercise');
        return;
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const startEditing = (exercise) => {
    setEditingExercise(exercise);
    setNewExercise({
      exercise: exercise.exercise,
      description: exercise.description
    });
    setShowPopup(true);
  };

  return (
    <div className="exercise-list-container">
      <div className="exercise-list-header">
        <h1>My Exercises</h1>
        <button 
          className="add-exercise-btn"
          onClick={() => {
            setEditingExercise(null);
            setNewExercise({ exercise: '', description: '' });
            setShowPopup(true);
          }}
        >
          + Add Exercise
        </button>
      </div>

      <div className="exercise-list">
        {exercises.map((exercise) => (
          <ExerciseItem
            key={exercise._id}
            exercise={exercise}
            onEdit={startEditing}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</h2>
            <div className="form-group">
              <label htmlFor="exercise">Exercise Name:</label>
              <input
                type="text"
                id="exercise"
                value={newExercise.exercise}
                onChange={(e) => setNewExercise({
                  ...newExercise,
                  exercise: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={newExercise.description}
                onChange={(e) => setNewExercise({
                  ...newExercise,
                  description: e.target.value
                })}
              />
            </div>
            <div className="popup-buttons">
              <button onClick={editingExercise ? handleEditExercise : handleAddExercise}>
                {editingExercise ? 'Save' : 'Add'}
              </button>
              <button onClick={() => {
                setShowPopup(false);
                setEditingExercise(null);
                setNewExercise({ exercise: '', description: '' });
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
