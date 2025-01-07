import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const ReviewModel = mongoose.model("Review", ReviewSchema, "reviews");

// CRUD Operations

export const getReviews = () => ReviewModel.find();

export const getReviewById = (id: string) => ReviewModel.findById(id);

export const createReview = (values: Record<string, any>) =>
  new ReviewModel(values).save().then((review) => review.toObject());

export const updateReviewById = (id: string, values: Record<string, any>) =>
  ReviewModel.findByIdAndUpdate(id, values, { new: true });

export const deleteReviewById = (id: string) =>
  ReviewModel.findByIdAndDelete(id);
