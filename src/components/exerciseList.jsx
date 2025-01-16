import  { useState, useEffect } from 'react';
import config from '../config';
import '../styles/exerciseList.css';
import ExerciseItem from './ExerciseItem';


const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [newExercise, setNewExercise] = useState({
    Name: '',
    ActivityDescription: '',
    
  });

  useEffect(() => {
    const fetchExercises = async () => {
      const token = localStorage.getItem('token');
      console.log(token)
      try {
        const response = await fetch(`${config.baseURL}/exercise`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch exercises');
          return;
        }

        const data = await response.json();
        setExercises(data.exercises || []); // Set the exercises from the response
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);


  const handleAddExercise = async () => {
    const exerciseData = {
      ...newExercise,
      Name: newExercise.Name,
      ActivityDescription: newExercise.ActivityDescription,
      // date: new Date().toISOString(),
      // userId: 'currentUserId', //this will be supplanted with the user id from the token 
      // _id: String(Date.now())
      
      //2024-05-22T12:19:33.038Z 
    };

    setExercises([...exercises, exerciseData]);
    setNewExercise({ Name: '', ActivityDescription: '',  });
    setShowPopup(false);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${config.baseURL}/exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(exerciseData),
      });

      if (!response.ok) {
        console.error('Failed to add exercise');
        return;
      }

      const addedExercise = await response.json();
      setExercises(prevExercises => [...prevExercises, addedExercise]);

      // setExercises(prevExercises => 
      //   prevExercises.map(ex => 
      //     ex._id === exerciseData._id ? addedExercise : ex
      //   )
      // );
      
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
      Name: exercise.exercise,
      ActivityDescription: exercise.description
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
            setNewExercise({ Name: '', ActivityDescription: '' });
            setShowPopup(true);
          }}
        >
          + Add Exercise
        </button>
      </div>

      <div className="exercise-list">
        {exercises.map((exerciseData) => (
          <ExerciseItem
            key={exerciseData._id}
            exercise={exerciseData}
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
                value={newExercise.Name}
                onChange={(e) => setNewExercise({
                  ...newExercise,
                  Name: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={newExercise.ActivityDescription}
                onChange={(e) => setNewExercise({
                  ...newExercise,
                  ActivityDescription: e.target.value
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
                setNewExercise({ Name: '', ActivityDescription: '' });
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
