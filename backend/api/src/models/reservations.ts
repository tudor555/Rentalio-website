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
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
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
