import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Reservation",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  ownerAmount: { type: Number, required: true }, // Amount paid to the listing owner
  siteFee: { type: Number, required: true }, // Platform's fee
  totalAmount: { type: Number, required: true }, // Total user pays (ownerAmount + siteFee)
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer"],
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "pending", "failed"],
    default: "pending",
  },
  transactionId: { type: String }, // Payment processor's ID
  isRefunded: { type: Boolean, default: false }, // Refund status
  refundAmount: { type: Number }, // Optional refund amount
  createdAt: { type: Date, default: Date.now },
});

export const PaymentModel = mongoose.model(
  "Payment",
  PaymentSchema,
  "payments"
);

// CRUD Operations

export const getPayments = () => PaymentModel.find();

export const getPaymentById = (id: string) => PaymentModel.findById(id);

export const createPayment = (values: Record<string, any>) =>
  new PaymentModel(values).save().then((payment) => payment.toObject());

export const updatePaymentById = (id: string, values: Record<string, any>) =>
  PaymentModel.findByIdAndUpdate(id, values, { new: true });

export const deletePaymentById = (id: string) =>
  PaymentModel.findByIdAndDelete(id);
