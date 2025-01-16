import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const exerciseSchema = new Schema({
  Name: {
    type: String,
    required: true,
    // default: Date.now,
  },
  ActivityDescription: {
    type: String,
    required: true,
    // default: Date.now,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
    required: false,
    maxlength: 500,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who performed the exercise
    required: true,
  },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;
