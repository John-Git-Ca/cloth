import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Table, Image } from 'react-bootstrap';
import { AiFillDelete } from 'react-icons/ai';
import Message from '../components/Message';
import Loader from '../components/Loader';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import axios from 'axios';
import Layout from '../components/Layout';
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAIL,
} from '../constants/constants';
import { getError } from '../utils/error';
import Link from 'next/link';
// import Image from 'next/image';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case FETCH_SUCCESS:
      return { ...state, loading: false, orders: action.payload, error: '' };
    case FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const OrderListScreen = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [message, setMessage] = useState('');
  const [cover, setCover] = useState(true);
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });
  const deleteHandler = async (id) => {
    try {
      const deleteConfig = {
        method: 'post',
        url: `/api/orders/${id}/delete`,
        headers: { authorization: `Bearer ${userInfo.token}` },
      };
      await axios(deleteConfig);

      setMessage('Order deleted');
    } catch (error) {
      setMessage(getError(error));
    }
  };

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: FETCH_REQUEST });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_FAIL, payload: getError(error) });
      }
    };
    fetchOrders();
  }, [userInfo, router]);
  return (
    <Layout title="Order History">
      <h1>My Orders</h1>
      {message && <Message>{message}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="table-sm order_table"
        >
          <thead>
            <tr>
              <th>NO.</th>
              <th>ORDER ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAYMENT RECORD</th>
              <th>PAYMENT STATUS</th>
              <th>PACKAGE SENT</th>
              {userInfo?.isAdmin && <th>Recipient</th>}
              {userInfo?.isAdmin && (
                <th>
                  <button onClick={() => setCover(!cover)}>
                    Hide/Unhide Delete
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td>You have not placed any orders yet</td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td className={order.payRecord ? 'green_bg' : ''}>
                    {order.payRecord && 'Uploaded'}
                  </td>
                  <td className={order.isPaid ? 'green_bg' : ''}>
                    {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                  </td>
                  <td className={order.isDelivered ? 'green_bg' : ''}>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : 'No'}
                  </td>
                  {userInfo?.isAdmin && (
                    <td>{order.shippingAddress.recipient || 'N/A'}</td>
                  )}
                  {userInfo?.isAdmin && (
                    <td>
                      {order.shippingAddress.address},
                      {order.shippingAddress.city}
                      {order.shippingAddress.postcode},
                      {order.shippingAddress.country}
                    </td>
                  )}

                  <td>
                    <Link href={`/order/${order._id}`}>
                      <a className="customize_link" target="_blank">
                        <u>Order Details</u>
                      </a>
                    </Link>
                  </td>
                  {userInfo?.isAdmin && (
                    <td className={order.purchased ? 'green_bg' : ''}>
                      {order.purchased ? '已订货' : '未订货'}
                    </td>
                  )}
                  {userInfo?.isAdmin &&
                    order?.orderItems?.map((item, ii) => (
                      <td key={ii} className="text-center">
                        <Image
                          src={item.images[1] || item.images[0]}
                          alt="product image"
                          fluid
                          rounded
                          style={{ maxHeight: '60px', minWidth: '50px' }}
                        />
                      </td>
                    ))}
                  {userInfo?.isAdmin && !cover && (
                    <td>
                      <button
                        className="btn-sm bg-light"
                        onClick={() => deleteHandler(order._id)}
                      >
                        <AiFillDelete />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Layout>
  );
};

// export default OrderListScreen;
export default dynamic(() => Promise.resolve(OrderListScreen), { ssr: false });
