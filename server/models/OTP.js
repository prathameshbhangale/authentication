import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
      },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

otpSchema.statics.generateOtp = function () {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
