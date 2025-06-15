import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Listing",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ["credit-card", "paypal", "bank-transfer"],
    required: true,
  },
  priceType: {
    type: String,
    enum: ["hour", "day", "week", "month", "year"],
    required: true,
  },
  numberOfHours: { type: Number }, // Used if priceType === 'hour'
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // Required if not hourly
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  ownerAmount: { type: Number, required: true }, // Owner's share
  siteFee: { type: Number, required: true }, // Platform's fee
  totalAmount: { type: Number, required: true }, // User-visible total
  createdAt: { type: Date, default: Date.now },
});

export const ReservationModel = mongoose.model(
  "Reservation",
  ReservationSchema,
  "reservations"
);

// CRUD Operations

export const getReservations = () => ReservationModel.find();

export const getReservationById = (id: string) => ReservationModel.findById(id);

export const createReservation = (values: Record<string, any>) =>
  new ReservationModel(values)
    .save()
    .then((reservation) => reservation.toObject());

export const updateReservationById = (
  id: string,
  values: Record<string, any>
) => ReservationModel.findByIdAndUpdate(id, values, { new: true });

export const deleteReservationById = (id: string) =>
  ReservationModel.findByIdAndDelete(id);
