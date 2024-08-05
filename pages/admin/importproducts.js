import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import FormContainer from '../../components/FormContainer';
import { getError } from '../../utils/error';
// import Image from 'next/image';

const ProductEditScreen = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [crawCategory, setCrawCategory] = useState(0);
  const [crawPage, setCrawPage] = useState(1);
  const [crawResponse, setCrawResponse] = useState();

  useEffect(() => {
    if (userInfo === null || !userInfo.isAdmin) {
      router.push('/login');
    }
  }, [router, userInfo]);

  const setCategory = (e, number) => {
    e.preventDefault();
    setCrawCategory(number);
  };

  const handleImportProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/products/crawlProducts24s?category=${crawCategory}&page=${crawPage}`,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data) {
        setSuccess(true);
        setCrawResponse(data);
      }
      setLoading(false);
    } catch (error) {
      setError(getError(error));
      setLoading(false);
    }
  };

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
            <a className="border rounded px-1 ">Edit Product</a>
          </Link>
        </Col>
        {/* <Col className="p-0">
          <Link href="/admin/importproducts">
            <a className="border rounded px-1 active_btn">Import Products</a>
          </Link>
        </Col> */}
        <Col className="p-0">
          <Link href="/admin/userlist">
            <a className="border rounded px-1">Users</a>
          </Link>
        </Col>
        {/* <Col className="p-0">
          <button onClick={downloadImage}>download images</button>
        </Col> */}
      </Row>
      <h3>Import Products</h3>
      {/* {images && (
        <Image src={images} alt="image" width={500} height={500}></Image>
      )} */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <FormContainer>
          <Form width="300px">
            <Row>
              <Row>
                STEP1 Select product category to crawl
                <Col>
                  <button
                    variant="light"
                    className={crawCategory === 0 ? 'active_btn' : ''}
                    onClick={(e) => setCategory(e, 0)}
                  >
                    Bags 29 pages
                  </button>
                  <button
                    variant="light"
                    className={crawCategory === 1 ? 'active_btn' : ''}
                    onClick={(e) => setCategory(e, 1)}
                  >
                    Shoes 28 pages
                  </button>
                  <button
                    variant="light"
                    className={crawCategory === 2 ? 'active_btn' : ''}
                    onClick={(e) => setCategory(e, 2)}
                  >
                    Clothes 21 pages
                  </button>
                  {/* <Button
                    variant="light"
                    className={crawCategory === 3 && 'active_btn'}
                    onClick={() => setCrawCategory(3)}
                  >
                    Wallets 30 pages
                  </Button>
                  <Button
                    variant="light"
                    className={crawCategory === 4 && 'active_btn'}
                    onClick={() => setCrawCategory(4)}
                  >
                    Hats 3 pages
                  </Button>
                  <Button
                    variant="light"
                    className={crawCategory === 5 && 'active_btn'}
                    onClick={() => setCrawCategory(5)}
                  >
                    Scarves 5 pages
                  </Button> */}
                </Col>
              </Row>
              <Row>
                STEP 2: Enter the page to crawl:
                <input
                  onChange={(e) => setCrawPage(e.target.value)}
                  value={crawPage}
                ></input>
              </Row>
              <Button onClick={handleImportProducts} className="mt-3">
                import products automatically
              </Button>
              {crawResponse && <Message>{crawResponse.message}</Message>}
            </Row>
            {success && (
              <Message variant="success">
                Imported successfully{' '}
                <Link href="/admin/productlist">
                  <a className="border rounded px-1">
                    <strong>Go to Products</strong>
                  </a>
                </Link>
              </Message>
            )}
          </Form>
        </FormContainer>
      )}
    </Layout>
  );
};

// export default ProductEditScreen;
export default dynamic(() => Promise.resolve(ProductEditScreen), {
  ssr: false,
});
