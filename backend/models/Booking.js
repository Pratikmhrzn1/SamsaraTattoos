import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    tattooIdea: {
      type: String,
      required: [true, "Tattoo idea is required"],
      trim: true,
    },
    referenceImage: {
      type: String, 
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
    notes: {
      type: String, 
      default: "",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;