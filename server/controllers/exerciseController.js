import Exercise from '../models/exerciseModel.js';
import User  from "../models/userModel.js";

const exerciseController = {};

exerciseController.getUserExercise = async (req, res) => {
  try {
    const userId = req.userId; // Extract the userId from the request (set by authenticate)

    // Fetch the user with their exercises populated
    const user = await User.findById(userId).populate('exercises');
   
    /**  user ={
     * name
     * email
     * pass
     * exer: [excerse1_id, exercise2_id] -> [{data exercise 1}, {data exercise 2}]
     * 
     * }
     * **/ 
// When to Use populate()
// You use populate() when you want to:
// Replace the ObjectIds in a field with the corresponding documents from the referenced collection.
// Retrieve related data in a structured way without manually querying multiple collections.

    // Handle the case where the user is not found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the user's exercises
    // console.log('User exercises:', user.exercises); // debugging 

    res.status(200).json({exercises : user.exercises});

  } catch (error) {
    console.error('Error fetching user exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
};

exerciseController.createExercise = async (req, res) => {
  try {
    const { Name, ActivityDescription, date, notes } = req.body;

    // console.log('Creating exercise:', { Name, ActivityDescription, date, notes });

    if (!Name|| !ActivityDescription) {
      return res.status(400).json({ error: 'Name and ActivityDescription are required' });
    }

    const user = await User.findById(req.userId);

    // console.log('user from request:', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
// added await , .create to save exercise in the db
    const newExercise = await Exercise.create({
      Name,
      ActivityDescription,
      date,
      notes,
      userId: req.userId, // user id provide by authenticate
    });

    user.exercises.push(newExercise._id);
    console.log('user after the push',user.exercises);
    await user.save(); // save() -> method of Mongodb
    
    const populatedUser = await User.findById(req.userId).populate('exercises');

    res.status(201).json({message: 'Exercise created successfully',exercises: populatedUser.exercises});
  } catch (error) {
    console.error('Error creating exercise:', error);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
};


exerciseController.deleteExercise = async (req, res) => {

  // Getting the exercise id in the params
  const { id } = req.params;
  console.log('in deleteExercise: ', id); // Debbugin

  try {
    const exerciseDeleted = await Exercise.findByIdAndDelete(id); // using Mongoose method to Find the exercise with the id that we pass in the params and deleted \
    if (!exerciseDeleted) {
      res.status(404).json({ error: 'Failed to delete exercise' });
    }
    res.status(200).json('Exercise is delete successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
};


// exerciseController.updateExercise = async (req, res) => {
//   const { id } = req.params;
//   const { type, distance, duration, date, caloriesBurned } = req.body;
//   console.log('in updateExercise: ', id, {
//     type,
//     distance,
//     duration,
//     date,
//     caloriesBurned,
//   });
//   try {
//     // Validate required fields
//     if (!type || !duration) {
//       return res.status(400).json({ error: 'Type and duration are required' });
//     }
//     const exerciseUpdated = await Exercise.findByIdAndUpdate(
//       id,
//       { type, distance, duration, date, caloriesBurned },
//       { new: true }
//     );
//     if (!exerciseUpdated) {
//       res.status(404).json({ error: 'Failed to Update exercise' });
//     }
//     res.status(200).json('Exercise is updated successfully!');
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to Update exercise' });
//   }
// };



export default exerciseController;
