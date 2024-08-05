import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    details: mongoose.Schema.Types.Mixed,
    // brand: {
    //   type: String,
    //   required: true,
    // },
    productUrl: {
      type: String,
    },
    // category: {
    //   type: String,
    //   required: true,
    // },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: true,
      default: 500,
    },
    // size: {
    //   type: String,
    // },
    // countInStock: {
    //   type: Number,
    //   required: true,
    //   default: 10,
    // },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
