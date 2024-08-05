import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Table, Button, Row, Col, Image } from 'react-bootstrap';

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
import { AiFillDelete } from 'react-icons/ai';
import dynamic from 'next/dynamic';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case FETCH_SUCCESS:
      return { ...state, loading: false, products: action.payload, error: '' };
    case FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ProductListScreen = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [message, setMessage] = useState('');
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  const deleteHandler = async (id) => {
    try {
      const deleteConfig = {
        method: 'post',
        url: `/api/products/deleteproduct/${id}`,
        headers: { authorization: `Bearer ${userInfo.token}` },
      };
      await axios(deleteConfig);

      setMessage('Product deleted');
    } catch (error) {
      setMessage(getError(error));
    }
  };

  useEffect(() => {
    if (userInfo === null || !userInfo.isAdmin) {
      router.push('/login');
    }
    const fetchProducts = async () => {
      try {
        dispatch({ type: FETCH_REQUEST });
        const { data } = await axios.get(`/api/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_FAIL, payload: getError(error) });
      }
    };
    fetchProducts();
  }, [router, userInfo, message]);

  return (
    <Layout>
      <Row className="align-items-center justify-content-center my-2">
        <Col className="p-0">
          <Link href="/admin/productlist">
            <a className="border rounded px-1 active_btn">Products</a>
          </Link>
        </Col>
        <Col className="p-0">
          <Link href="/admin/editproduct">
            <a className="border rounded px-1">Edit Product</a>
          </Link>
        </Col>
        {/* <Col className="p-0">
          <Link href="/admin/importproducts">
            <a className="border rounded px-1">Import Products</a>
          </Link>
        </Col> */}
        <Col className="p-0">
          <Link href="/admin/userlist">
            <a className="border rounded px-1">Users</a>
          </Link>
        </Col>
      </Row>
      <h3>You have {products.length} products</h3>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          {message && <Message>{message}</Message>}
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>No.</th>
                <th>Photo</th>
                <th>ID({products.length} products)</th>
                <th>BRAND</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>ACTIONS</th>
                <th>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td className="text-center">
                    <Image
                      style={{ height: '50px' }}
                      src={product.images[0]}
                      alt={product.name}
                    ></Image>
                  </td>
                  <td>{product._id}</td>
                  <td>{product.brand}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    {/* <Link href={`/admin/product/${product._id}/edit`} passHref>
                      <Button variant="info" className="btn-sm">
                        <AiFillEdit />
                      </Button>
                    </Link> */}
                    <Button
                      className="btn-sm delete_btn"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <AiFillDelete />
                    </Button>
                  </td>
                  <td>
                    <Link href={`/product/${product.slug}`}>
                      <a
                        className="p-0 m-0 text-center text-primary"
                        target="_blank"
                      >
                        {product.slug}
                      </a>
                    </Link>
                  </td>
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
export default dynamic(() => Promise.resolve(ProductListScreen), {
  ssr: false,
});
