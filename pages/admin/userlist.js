import React, { useContext, useEffect, useReducer } from 'react';
import { Table, Row, Col } from 'react-bootstrap';

import Message from '../../components/Message';
import Loader from '../../components/Loader';
// import Paginate from '../../components/Paginate';
import Link from 'next/link';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import axios from 'axios';
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAIL,
} from '../../constants/constants';
import { useRouter } from 'next/router';
import { getError } from '../../utils/error';
import dynamic from 'next/dynamic';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case FETCH_SUCCESS:
      return { ...state, loading: false, users: action.payload, error: '' };
    case FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const UserListScreen = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    users: [],
    error: '',
  });

  useEffect(() => {
    if (userInfo === null || !userInfo.isAdmin) {
      router.push('/login');
    }
    const fetchUsers = async () => {
      try {
        dispatch({ type: FETCH_REQUEST });
        const { data } = await axios.get(`/api/users/userlist`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_FAIL, payload: getError(error) });
      }
    };
    fetchUsers();
  }, [router, userInfo]);

  return (
    <Layout>
      <Row className="align-items-center justify-content-center my-2">
        <Col className="p-0">
          <Link href="/admin/productlist">
            <a className="border rounded px-1">Products</a>
          </Link>
        </Col>
        <Col className="p-0">
          <Link href="/admin/editproduct">
            <a className="border rounded px-1">Edit Product</a>
          </Link>
        </Col>
        {/* <Col className="p-0">
          <Link href="/admin/importproducts">
            <a className="border rounded px-1 ">Import Products</a>
          </Link>
        </Col> */}
        <Col className="p-0">
          <Link href="/admin/userlist">
            <a className="border rounded px-1 active_btn">Users</a>
          </Link>
        </Col>
      </Row>
      <h3>You have {users.length} users</h3>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>No.</th>
                <th>ID({users.length} users)</th>
                <th>NAME</th>
                <th>Email</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <Paginate pages={pages} page={page} isAdmin={true} /> */}
        </>
      )}
    </Layout>
  );
};

// export default ProductListScreen;
export default dynamic(() => Promise.resolve(UserListScreen), {
  ssr: false,
});
