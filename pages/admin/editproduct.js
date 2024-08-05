import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Image } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import dynamic from 'next/dynamic';
import Link from 'next/link';

function randomslug(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const ProductEditScreen = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState('');
  const [slug, setSlug] = useState(randomslug(18));
  const [price, setPrice] = useState(500);
  // const [countInStock, setCountInStock] = useState(1);
  // const [brand, setBrand] = useState('');
  // const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const [query, setQuery] = useState('');

  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [image5, setImage5] = useState('');
  const [image6, setImage6] = useState('');
  const [image7, setImage7] = useState('');
  const [image8, setImage8] = useState('');
  const [image9, setImage9] = useState('');
  const [image10, setImage10] = useState('');

  const [error, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [productUrl, setProductUrl] = useState('');

  useEffect(() => {
    console.log(userInfo)
    console.log(userInfo.isAdmin)
    if (!userInfo.isAdmin) {
      router.push('/login');
    }
  }, [userInfo, router]);

  const getProductBySlug = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/products/editproduct',
        { search: query },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoading(false);
      //need details,
      const { brand, category, countInStock, description, images, name, slug } =
        data;
      setBrand(brand);
      // setCategory(category);
      // setCountInStock(countInStock);
      setDescription(description);
      if (images[0]) setImage1(images[0]);
      if (images[1]) setImage2(images[1]);
      if (images[2]) setImage3(images[2]);
      if (images[3]) setImage4(images[3]);
      if (images[4]) setImage5(images[4]);
      if (images[5]) setImage6(images[5]);
      if (images[6]) setImage6(images[6]);
      if (images[7]) setImage6(images[7]);
      if (images[8]) setImage6(images[8]);
      if (images[9]) setImage6(images[9]);
      setName(name);
      setSlug(slug);
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.response.data ? error.response.data.message : error.message
      );
    }
  };

  const submitHandler = async () => {
    let images = [];
    if (image1) images.push(image1);
    if (image2) images.push(image2);
    if (image3) images.push(image3);
    if (image4) images.push(image4);
    if (image5) images.push(image5);
    if (image6) images.push(image6);
    if (image7) images.push(image7);
    if (image8) images.push(image8);
    if (image9) images.push(image9);
    if (image10) images.push(image10);
    const product = {
      name,
      slug,
      price,
      // countInStock,
      // brand,
      // category,
      description,
      images: images,
    };
    try {
      setLoading(true);
      const { data } = await axios.post('/api/products/editproduct', product, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      setLoading(false);
      setProductUrl(data.slug);
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.response.data ? error.response.data.message : error.message
      );
    }
  };

  return (
    <Layout>
      <Row className="align-items-center justify-content-center my-2 ">
        <Col className="p-0">
          <Link href="/admin/productlist">
            <a className="border rounded px-1">Products</a>
          </Link>
        </Col>
        <Col className="p-0">
          <Link href="/admin/editproduct">
            <a className="border rounded px-1 active_btn">Edit Product</a>
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
      {/* <h3 className="mt-4 p-1 border-top">Edit Existing Product</h3>

      <div>
        <input
          className="p-1 m-1"
          onChange={(e) => setQuery(e.target.value)}
        ></input>
        <button
          className="p-1 m-1 bg-info border-light rounded"
          onClick={getProductBySlug}
        >
          Get product by slug
        </button>
      </div> */}
      <h3>Create New Product</h3>
      {productUrl && (
        <Message>
          <Link href={`/product/${productUrl}`}>
            <a target="_blank">See new posted/updated Product:{productUrl}</a>
          </Link>
        </Message>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col>
            <Form width="300px">
              <Row>
                <Col>
                  <Form.Group controlId="name">
                    <Form.Label className="mb-0">*Name</Form.Label>
                    <Form.Control
                      type="name"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="slug">
                    <Form.Label className="mb-0">
                      *Slug <strong className="text-danger">(unique)</strong>
                    </Form.Label>
                    <Form.Control
                      type="name"
                      placeholder="Enter slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              {/* <Row>
                <Col>
                  <Form.Group controlId="brand">
                    <Form.Label className="mb-0">*Brand</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="category">
                    <Form.Label className="mb-0">*Category</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row> */}
              <Row>
                {/* <Col>
                  <Form.Group controlId="countInStock">
                    <Form.Label className="mb-0">*Count In Stock</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter countInStock"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col> */}
                <Col>
                  <Form.Group controlId="price">
                    <Form.Label className="mb-0">*Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="description">
                <Form.Label className="mb-0">*Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <br />
              <Row className="border m-1 p-1 rounded flex-wrap">
                <Row>
                  <Form.Group controlId="image1">
                    <Form.Label className="mb-0">*Image1</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image url"
                      value={image1}
                      onChange={(e) => setImage1(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="image2">
                    <Form.Label className="mb-0">Image2</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image url"
                      value={image2}
                      onChange={(e) => setImage2(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="image3">
                    <Form.Label className="mb-0">Image3</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image url"
                      value={image3}
                      onChange={(e) => setImage3(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="image4">
                    <Form.Label className="mb-0">Image4</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image url"
                      value={image4}
                      onChange={(e) => setImage4(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="image5">
                    <Form.Label className="mb-0">Image5</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image url"
                      value={image5}
                      onChange={(e) => setImage5(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="image6">
                    <Form.Label className="mb-0">Image6</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image url"
                      value={image6}
                      onChange={(e) => setImage6(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="image7">
                    <Form.Label className="mb-0">Image7</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image url"
                      value={image7}
                      onChange={(e) => setImage7(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="image8">
                    <Form.Label className="mb-0">Image8</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image url"
                      value={image8}
                      onChange={(e) => setImage8(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="image9">
                    <Form.Label className="mb-0">Image9</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image url"
                      value={image9}
                      onChange={(e) => setImage9(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="image10">
                    <Form.Label className="mb-0">Image10</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image url"
                      value={image10}
                      onChange={(e) => setImage10(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
              </Row>
            </Form>
          </Col>
          <Col>
            <Row>
              <Col>
                <Form.Label className="mb-0">*Name</Form.Label>
                <h6 className="text-info">{name}</h6>
              </Col>
              <Col>
                <Form.Label className="mb-0">
                  *Slug <strong className="text-danger">(unique)</strong>
                </Form.Label>
                <h6 className="text-info">{slug}</h6>
              </Col>
            </Row>
            <Row>
              {/* <Col>
                <Form.Label className="mb-0">*Brand</Form.Label>
                <h6 className="text-info">{brand}</h6>
              </Col>
              <Col>
                <Form.Label className="mb-0">*Category</Form.Label>
                <h6 className="text-info">{category}</h6>
              </Col> */}
            </Row>
            <Row>
              {/* <Col>
                <Form.Label className="mb-0">*Count In Stock</Form.Label>
                <h6 className="text-info">{countInStock}</h6>
              </Col> */}
              <Col>
                <Form.Label className="mb-0">*Price</Form.Label>
                <h6 className="text-info">{price}</h6>
              </Col>
            </Row>
            <Form.Label className="mb-0">*Description</Form.Label>
            <h6 className="text-info">{description}</h6>
            <Form.Label className="mb-0">Images</Form.Label>
            <Image
              className="m-1"
              src={image1}
              alt="image1"
              style={{ maxWidth: '60px' }}
            ></Image>
            <Image
              className="m-1"
              src={image2}
              alt="image2"
              style={{ maxWidth: '60px' }}
            ></Image>
            <Image
              className="m-1"
              src={image3}
              alt="image3"
              style={{ maxWidth: '60px' }}
            ></Image>
            <Image
              className="m-1"
              src={image4}
              alt="image4"
              style={{ maxWidth: '60px' }}
            ></Image>
            <Image
              className="m-1"
              src={image5}
              alt="image5"
              style={{ maxWidth: '60px' }}
            ></Image>
            <Image
              className="m-1"
              src={image6}
              alt="image6"
              style={{ maxWidth: '60px' }}
            ></Image>
            <Image
              className="m-1"
              src={image7}
              alt="image7"
              style={{ maxWidth: '60px' }}
            ></Image>
            <Image
              className="m-1"
              src={image8}
              alt="image8"
              style={{ maxWidth: '60px' }}
            ></Image>
            <Image
              className="m-1"
              src={image9}
              alt="image9"
              style={{ maxWidth: '60px' }}
            ></Image>
            <Image
              className="m-1"
              src={image10}
              alt="image10"
              style={{ maxWidth: '60px' }}
            ></Image>
            <div className="border-top">
              <button
                className="p-1 m-1 bg-info border-light rounded"
                onClick={submitHandler}
              >
                POST PRODUCT
              </button>
            </div>
          </Col>
        </Row>
      )}
    </Layout>
  );
};

// export default ProductEditScreen;
export default dynamic(() => Promise.resolve(ProductEditScreen), {
  ssr: false,
});
