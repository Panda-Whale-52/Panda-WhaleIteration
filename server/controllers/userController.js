import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userController = {};

userController.registerUser = async (req, res) => {
  

  try {
    const { name, email, password } = req.body;
    
    console.log('Registering user:', { name, email });

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Name, email, and password are required' });
  }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // const user = await User.create({ name, email, password });
    const user = new User({name,
      email,
      password,
    });

    await user.save();

    return res.status(201).json({ message: 'User registered successfully', user });

    // res.locals.newUser = user;
    // next()

  } catch (error) {
    console.error('Error registering user:', error);
    return res
      .status(500)
      .json({ error: 'Failed to register user', details: error.message });
  }
};

// Check if user and password are correct 

userController.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Logging in user:', { email });

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res
      .status(500)
      .json({ error: 'Failed to log in', details: error.message });
  }
};


userController.getUserInfo = async (req, res) => {
  const { userId } = req;
  console.log('Fetching user info for userId:', userId);

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User info retrieved', user });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch user info', details: error.message });
  }
};

userController.deleteUser = async (req, res) => {
  const { userId } = req.params;
  console.log('Deleting user with userId:', userId);

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res
      .status(500)
      .json({ error: 'Failed to delete user', details: error.message });
  }
};

export default userController;
