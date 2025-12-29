import mongoose from "mongoose";

const productionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },

    // after add this

    lastEmailSentAt: { type: Date },
    emailSendCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const realForm = mongoose.model("realForm", productionSchema);

export default realForm;
