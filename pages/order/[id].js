import React, { useContext, useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import Link from 'next/link';
// import AWS from 'aws-sdk';

import { Row, Col, ListGroup, Card, Image, Form } from 'react-bootstrap';
import Message from '../../components/Message';
import {
  FETCH_FAIL,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  PAY_FAIL,
  PAY_REQUEST,
  PAY_SUCCESS,
  PAY_RESET,
  DELIVER_REQUEST,
  DELIVER_SUCCESS,
  DELIVER_FAIL,
  DELIVER_RESET,
} from '../../constants/constants';
import axios from 'axios';
import Loader from '../../components/Loader';
import { useRouter } from 'next/router';
import { getError } from '../../utils/error';
// import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case FETCH_SUCCESS:
      return { ...state, loading: false, order: action.payload, error: '' };
    case FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PAY_REQUEST:
      return { ...state, loadingPay: true };
    case PAY_SUCCESS:
      return { ...state, loadingPay: false, successPay: true };
    case PAY_FAIL:
      return { ...state, loadingPay: false, errorPay: action.payload };
    case PAY_RESET:
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case DELIVER_REQUEST:
      return { ...state, loadingDeliver: true };
    case DELIVER_SUCCESS:
      return { ...state, loadingDeliver: false, successDeliver: true };
    case DELIVER_FAIL:
      return { ...state, loadingDeliver: false, errorDliver: action.payload };
    case DELIVER_RESET:
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default:
      return state;
  }
};

const OrderScreen = ({ params }) => {
  const orderId = params.id;
  //   const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [adminNote, setAdminNote] = useState('');
  //   var formData = new FormData();

  const [
    { loading, error, order, loadingDeliver, successDeliver, successPay },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: FETCH_REQUEST });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_FAIL, payload: getError(error) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: PAY_RESET });
      }
      if (successDeliver) {
        dispatch({ type: DELIVER_RESET });
      }
    }
  }, [order, successPay, successDeliver]);

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });
    // formData.append('images', file);
    dispatch({ type: FETCH_REQUEST });
    try {
      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post(
        `/api/orders/${order._id}/payment`,
        formData,
        config
      );
      console.log(data);
      dispatch({ type: FETCH_SUCCESS, payload: data });
    } catch (error) {
      console.error(error);
      dispatch({ type: FETCH_FAIL, payload: getError(error) });
    }
  };

  //   const uploadFileHandler = (e) => {
  //     const S3_BUCKET = 'allhkd500';
  //     const file = e.target.files[0];
  //     console.log(file);
  //     // const newFile = new File(file, orderId + '.jpg');
  //     AWS.config.update({
  //       accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
  //       secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
  //     });

  //     const myBucket = new AWS.S3({
  //       params: { Bucket: S3_BUCKET },
  //       region: 'ap-southeast-1',
  //     });

  //     const params = {
  //       ACL: 'public-read',
  //       Body: file,
  //       Bucket: S3_BUCKET,
  //       Key: orderId + '.jpg',
  //     };
  //     if (e.target.files && e.target.files[0]) {
  //       myBucket
  //         .putObject(params)
  //         .on('httpUploadProgress', async (evt) => {
  //           //    setProgress (Math.round((evt.loaded / evt.total) * 100))
  //           console.log(evt);
  //           try {
  //             dispatch({ type: FETCH_REQUEST });
  //             const config = {
  //               headers: {
  //                 authorization: `Bearer ${userInfo.token}`,
  //                 'Content-Type': 'application/json',
  //               },
  //             };
  //             const { data } = await axios.post(
  //               `/api/orders/${order._id}/payment`,
  //               orderId + '.jpg',
  //               config
  //             );
  //             console.log(data);
  //             dispatch({ type: FETCH_SUCCESS, payload: data });
  //           } catch (error) {
  //             dispatch({ type: FETCH_FAIL, payload: getError(error) });
  //           }
  //         })
  //         .send((err) => {
  //           if (err) console.log(err);
  //         });

  //       //   formData.append('payment', e.target.files[0]);
  //     }
  //   };
  const adminNoteHandler = async () => {
    dispatch({ type: FETCH_REQUEST });
    try {
      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/orders/${order._id}/adminnote`,
        { adminNote: adminNote },
        config
      );
      console.log(data);
      dispatch({ type: FETCH_SUCCESS, payload: data });
    } catch (error) {
      console.error(error);
      dispatch({ type: FETCH_FAIL, payload: getError(error) });
    }
  };

  const purchaseHandler = async () => {
    dispatch({ type: FETCH_REQUEST });
    try {
      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/orders/${order._id}/purchase`,
        {},
        config
      );
      console.log(data);
      dispatch({ type: FETCH_SUCCESS, payload: data });
    } catch (error) {
      console.error(error);
      dispatch({ type: FETCH_FAIL, payload: getError(error) });
    }
  };

  const paymentHandler = async () => {
    try {
      dispatch({ type: PAY_REQUEST });
      const { data } = await axios.put(
        `/api/orders/${order._id}/pay`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(data);
      dispatch({ type: PAY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PAY_FAIL, payload: getError(error) });
    }
  };

  const deliverHandler = async () => {
    try {
      dispatch({ type: DELIVER_REQUEST });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: DELIVER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: DELIVER_FAIL, payload: getError(error) });
    }
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Layout title="order">
      <h2>
        Order ID: <span className="fs-5">{orderId}</span>
      </h2>{' '}
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index} className="p-1">
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.images[1] || item.images[0]}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link href={`/product/${item?.slug}`}>
                            <a className="customize_link" target="_blank">
                              {item.name}
                            </a>
                          </Link>
                        </Col>
                        {item.size && <Col>Size:{item.size}</Col>}
                        <Col md={4}>
                          {item.quantity} x ${item.price} = $
                          {item.quantity * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                  {order.shippingAddress.notes && (
                    <ListGroup.Item>
                      Note: {order.shippingAddress.notes}
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item></ListGroup.Item>
                </ListGroup>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment</h2>
              <h5>
                STEP 1: Make the payment with{' '}
                <strong className="fs-4 text-danger">ONE</strong> of the
                following options:
              </h5>
              <Row>
                <Col sm={6} md={4}>
                  <Card>
                    <Card.Header>1 Pay with FPS</Card.Header>
                    <Card.Img
                      variant="bottom"
                      src="/images/fps.png"
                      alt="fps"
                    ></Card.Img>
                  </Card>
                </Col>
                <Col sm={6} md={4}>
                  <Card>
                    <Card.Header>Pay with AlipayHK</Card.Header>
                    <Card.Img src="/images/alipay.jpg" alt="alipay"></Card.Img>
                  </Card>
                </Col>
                <Col sm={6} md={4}>
                  <Card>
                    <Card.Header>3 Pay with PAYME</Card.Header>
                    <Card.Img src="/images/payme.jpg" alt="payme"></Card.Img>
                  </Card>
                </Col>
              </Row>
              <h5 className="mt-3">
                STEP 2: Upload payment record(Image size less then 1M)
              </h5>
              <Form.Group controlId="images">
                <Form.Label className="mb-0">Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  label="Choose Images"
                  onChange={uploadFileHandler}
                ></Form.Control>
                {/* {uploading && <Loader />} */}
              </Form.Group>
              {order?.payRecord && (
                <div>
                  <Message>Payment Record Uploaded</Message>
                  {/* <Image
                    className="w-100"
                    src={order.payRecord}
                    alt="payment record"
                  ></Image> */}
                </div>
              )}
              <h5 className="mt-3">STEP 3: Payment Status</h5>
              {order.isPaid ? (
                <Message variant="success">Payment is confirmed</Message>
              ) : (
                <Message variant="danger">
                  Payment has not been confirmed
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Shipping</h2>
              {order.shippingAddress && (
                <p>
                  <strong>Recipient:</strong>
                  {order.shippingAddress.recipient || ' N/A'}
                </p>
              )}
              {order.shippingAddress && (
                <p>
                  <strong>Address:</strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postcode},{' '}
                  {order.shippingAddress.country}
                </p>
              )}
              {order.shippingAddress.phone && (
                <p>
                  <strong>Phone:</strong>
                  {order.shippingAddress.phone}
                </p>
              )}
              {order.isDelivered ? (
                <Message variant="success">Package Sent</Message>
              ) : (
                <Message variant="danger">Package not Sent</Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice || 0}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* {!order.isPaid && (
                <ListGroup.Item className="px-0">
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div className="w-100">
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </div>
                  )}
                </ListGroup.Item>
              )} */}
              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && (
                <ListGroup.Item>
                  <button
                    type="button"
                    className={
                      order.isPaid
                        ? 'btn btn-block w-100 bg-success text-light'
                        : 'btn btn-block w-100 bg-dark text-light'
                    }
                    onClick={paymentHandler}
                  >
                    {order.isPaid ? '已确认付款' : '未确认付款'}
                  </button>
                </ListGroup.Item>
              )}
              {userInfo && userInfo.isAdmin && (
                <ListGroup.Item>
                  <button
                    type="button"
                    className={
                      order.purchased
                        ? 'btn btn-block w-100 bg-success text-light'
                        : 'btn btn-block w-100 bg-dark text-light'
                    }
                    onClick={purchaseHandler}
                  >
                    {order.purchased ? '已订货' : '未订货'}
                  </button>
                </ListGroup.Item>
              )}
              {userInfo && userInfo.isAdmin && (
                <ListGroup.Item>
                  <button
                    type="button"
                    className={
                      order.isDelivered
                        ? 'btn btn-block w-100 bg-success text-light'
                        : 'btn btn-block w-100 bg-dark text-light'
                    }
                    onClick={deliverHandler}
                  >
                    {order?.isDelivered ? '已寄出' : '未寄出'}
                  </button>
                </ListGroup.Item>
              )}
              {userInfo && userInfo.isAdmin && (
                <ListGroup.Item>
                  备注：
                  <input
                    className="w-100"
                    onChange={(e) => setAdminNote(e.target.value)}
                  ></input>
                  <button
                    type="button"
                    className="btn btn-block w-100 dark_bg text-light"
                    onClick={adminNoteHandler}
                  >
                    添加备注
                  </button>
                </ListGroup.Item>
              )}
              {userInfo && userInfo.isAdmin && order?.adminNote && (
                <p>{order.adminNote}</p>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

// export default OrderScreen;
export default dynamic(() => Promise.resolve(OrderScreen), { ssr: false });
