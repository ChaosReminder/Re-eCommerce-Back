const Order = require("../models/OrderModel");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    const ordersProducts = orders.map((el) => el.orderItems).flat();
    const itemsPrices = ordersProducts
      .map((p) => p.price * p.qty)
      .reduce((a, b) => a + b, 0);
    const itemsQuantity = ordersProducts
      .map((p) => p.qty)
      .reduce((a, b) => a + b, 0);
    const ordersFinal = {
      orders,
      spent: itemsPrices,
      quantityItems: itemsQuantity,
    };
    res.status(200).json(ordersFinal);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOrder = async (req, res) => {
  const { orderId } = req.params;
  if (orderId) {
    const order = await Order.findById(orderId);
    if (order) {
      return res.status(200).json(order);
    } else {
      return res.status(404).send(`Review no existente`);
    }
  }
};
const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  if (userId) {
    const orders = await Order.find({ user: userId });
    if (orders) {
      const ordersProducts = orders.map((el) => el.orderItems).flat();
      const itemsPrices = ordersProducts
        .map((p) => p.price)
        .reduce((a, b) => a + b, 0);
      const itemsQuantity = ordersProducts
        .map((p) => p.qty)
        .reduce((a, b) => a + b, 0);
      const ordersFinal = orders
        .map((o) => o)
        .concat({ spent: itemsPrices, quantityItems: itemsQuantity });

      return res.status(200).json(ordersFinal);
    } else {
      return res.status(404).send(`Aún no hay reviews`);
    }
  }
};

const getOrdersProduct = async (req, res) => {
  const { productId } = req.params;
  if (productId) {
    const orders = await Order.find({ product: productId });
    if (orders) {
      return res.status(200).json(orders);
    } else {
      return res.status(404).send(`Aún no hay reviews`);
    }
  }
};

const modifyOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllOrders,
  getUserOrders,
  getOrdersProduct,
  getOrder,
  modifyOrder,
};
