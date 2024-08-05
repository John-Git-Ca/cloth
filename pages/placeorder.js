import React, { useContext, useState } from 'react';
import {
  ListGroup,
  Row,
  Col,
  Image,
  Card,
  ListGroupItem,
} from 'react-bootstrap';
import Message from '../components/Message';
import { Store } from '../utils/Store';
import Link from 'next/link';
import Layout from '../components/Layout';
import axios from 'axios';
import { getError } from '../utils/error';
import Loader from '../components/Loader';
import { CART_CLEAR } from '../constants/constants';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { calculateShppingCost } from '../utils/calculate';

const PlaceOrderScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo, cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;
  const { country } = shippingAddress;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const shippingPrice = calculateShppingCost(
    country,
    cart.cartItems.reduce((acc, item) => acc + item.quantity, 0)
  );
  const itemPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const totalPrice = Number(shippingPrice) + Number(itemPrice);
  const placeOrderHandler = async () => {
    if (cartItems.length === 0) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          shippingPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: CART_CLEAR });
      Cookies.remove('cartItems');
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (error) {
      setMessage(getError(error));
    }
  };
  return (
    <Layout>
      <Row className="mt-2">
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>Shipping</h3>
              <p>
                <strong>Recipient: </strong>
                {cart.shippingAddress.recipient}
              </p>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {cart.shippingAddress.country},{cart.shippingAddress.postcode}
              </p>
              {cart.shippingAddress.phone && (
                <p>
                  <strong>Phone: </strong>
                  {cart.shippingAddress.phone}
                </p>
              )}
              {cart.shippingAddress.notes && (
                <p>
                  <strong>Note: </strong>
                  {cart.shippingAddress.notes}
                </p>
              )}
            </ListGroup.Item>
            {/* <ListGroup.Item>
              <h3>Payment Method</h3>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item> */}
            <ListGroup.Item>
              <h3>Order Items</h3>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1} className="text-center">
                          <Image
                            src={item.images[1] || item.images[0]}
                            alt={item.name}
                            fluid
                            rounded
                            style={{ maxHeight: '50px' }}
                          />
                        </Col>
                        <Col>
                          <Link href={`/product/${item.slug}`}>
                            <a target="_blank">{item.name}</a>
                          </Link>
                        </Col>
                        {item.size && <Col md={2}>Size:{item.size}</Col>}
                        <Col md={4}>
                          {item.quantity} X HK${item.price} = HK$
                          {item.quantity * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>Order Summary:</h3>
              </ListGroup.Item>
              <ListGroupItem>
                <Row>
                  <Col>
                    Items(
                    {cart.cartItems.reduce(
                      (acc, item) => acc + item.quantity,
                      0
                    )}
                    ):
                  </Col>
                  <Col>HK${itemPrice}</Col>
                </Row>
                <Row className="border-bottom">
                  <Col>Shipping: </Col>
                  <Col>HK${shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>HK$ {totalPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                {/* {error && <Message variant="danger"></Message>} */}
              </ListGroupItem>
              <ListGroupItem>
                <button
                  type="button"
                  className="btn-block w-100 responsive_btn rounded dark_bg text-light"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </button>
              </ListGroupItem>
            </ListGroup>
            {loading && <Loader />}
            {message && <Message variant="danger">{message}</Message>}
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

// export default PlaceOrderScreen;
export default dynamic(() => Promise.resolve(PlaceOrderScreen), { ssr: false });
