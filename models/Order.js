import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        images: [{ type: String, required: true }],
        price: { type: Number, required: true },
        size: { type: String },
        slug: { type: String },
      },
    ],
    shippingAddress: {
      recipient: { type: String },
      address: { type: String, required: true },
      phone: { type: String },
      city: { type: String },
      postcode: { type: String },
      country: { type: String },
      notes: { type: String },
    },
    payRecord: { type: String },
    paymentMethod: { type: String, required: true },
    paymentResult: { id: String, status: String, email_address: String },
    totalPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    adminNote: { type: String, default: '' },
    purchased: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
