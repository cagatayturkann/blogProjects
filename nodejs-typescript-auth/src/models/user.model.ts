import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';

// User schema definition
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // We'll validate this in pre-save hook instead
      required: false,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values
    },
    profilePicture: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
  // Check if password is required (no googleId) but not provided
  if (!this.googleId && !this.password) {
    const err = new Error('Password is required for email registration');
    return next(err);
  }
  
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  try {
    if (!this.password) return false;
    // Compare the provided password with the hashed password
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Create and export the User model
const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel; 