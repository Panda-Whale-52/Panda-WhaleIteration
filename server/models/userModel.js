import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  // For local auth
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    // validate: {
    //   validator: function (v) {
    //     return /\S+@\S+\.\S+/.test(v);
    //   },
    //   message: (props) => `${props.value} is not a valid email.`,
    // },
  },
  password: {
    type: String,
    minlength: 8,
  },

  exercises: [{
      type: Schema.Types.ObjectId,
      ref: 'Exercise',
      // default:[],
    },],

  // For GitHub OAuth
  // githubId: {
  //   type: String,
  //   unique: true,
  // },
  // avatarUrl: {
  //   type: String,
  // },

  // Timestamps
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
});

userSchema.pre("save", async function (next) {
  try {
    // Check if the password has been modified
    if (!this.isModified("password")) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    // Ignore this warning await does have an effect for local auth
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed to save
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

const User = mongoose.model("User", userSchema);
export default User;
