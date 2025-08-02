import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  fullName?: string;
  businessName?: string;
  userType: 'user' | 'owner';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  profileCompleted: boolean;
  isActive: boolean;
  updateLastLogin(): Promise<IUser>;
}

export interface IUserModel extends Model<IUser> {
  findByClerkId(clerkId: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
}

const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  businessName: {
    type: String,
    trim: true,
    maxlength: 200
  },
  userType: {
    type: String,
    enum: ['user', 'owner'],
    required: true,
    default: 'user'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ userType: 1 });
UserSchema.index({ isActive: 1 });

// Pre-save middleware to update the updatedAt field
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to update last login
UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find by Clerk ID
UserSchema.statics.findByClerkId = function(clerkId: string) {
  return this.findOne({ clerkId });
};

// Static method to find by email
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export default mongoose.models.User || mongoose.model<IUser, IUserModel>('User', UserSchema); 