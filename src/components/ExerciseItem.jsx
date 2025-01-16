import  { useState } from "react";
import "../styles/exerciseItem.css";

const ExerciseItem = ({ exercise, onEdit, onDelete }) => {
  return (
    <div className="exercise-item">
      <h3>{exercise.Name}</h3>
      <p>{exercise.ActivityDescription}</p>

      <div className="exercise-item-options">
        <button
          className="edit-btn"
          onClick={(e) => {
            onEdit(exercise);
          }}
        >
          Edit
        </button>
        <button
          className="delete-btn"
          onClick={(e) => {
            if (
              window.confirm("Are you sure you want to delete this exercise?")
            ) {
              onDelete(exercise._id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExerciseItem;
