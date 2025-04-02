import mongoose, { mongo } from "mongoose";

interface GetListingsOptions {
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
}

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: [
      "apartment",
      "playground",
      "football_field",
      "tennis_field",
      "office",
      "other",
    ],
    required: true,
  },
  basePrice: { type: Number, required: true }, // Owner's price
  images: [{ type: String }],
  location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  amenities: [{ type: String }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  availability: {
    from: { type: Date },
    to: { type: Date },
    minStay: { type: Number },
    maxStay: { type: Number },
  },
  status: {
    type: String,
    enum: ["active", "inactive", "archived"],
    default: "active",
  },
  bookingsCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const ListingModel = mongoose.model(
  "Listing",
  ListingSchema,
  "listings"
);

// CRUD Operations

// Get all listings
export const getListings = ({
  filter = {},
  sort = {},
}: GetListingsOptions = {}) => {
  return ListingModel.find(filter).sort(sort);
};

// Get listing by ID
export const getListingById = (id: string) => ListingModel.findById(id);

// Create a new listing
export const createListing = (values: Record<string, any>) =>
  new ListingModel(values).save().then((listing) => listing.toObject());

// Update listing by ID
export const updateListingById = (id: string, values: Record<string, any>) =>
  ListingModel.findByIdAndUpdate(id, values, { new: true });

// Delete listing by ID
export const deleteListingById = (id: string) =>
  ListingModel.findByIdAndDelete(id);
