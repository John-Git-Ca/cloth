import React, {  useState } from 'react';
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  CarouselItem,
  Carousel,
  Image,
  Table,
} from 'react-bootstrap';
import Link from 'next/link';
import Layout from '../../components/Layout';
import db from '../../utils/db';
import Product from '../../models/Product';

const ProductScreen = (props) => {
  const { product } = props;
  const [size, setSize] = useState('');
  if (!product) {
    return <div>Product not found</div>;
  }

  // const addToCartHandler = async () => {
  //   product.size = size;
  //   if (
  //     product.size ||
  //     product.category === 'Bags' ||
  //     product.category === 'special'
  //   ) {
  //     const { data } = await axios.get(`/api/products/${product._id}`);
  //     if (data.countInStock <= 0) {
  //       window.alert('Sorry, Product is out of stock');
  //       return;
  //     }
  //     dispatch({
  //       type: CART_ADD_ITEM,
  //       payload: { ...product, quantity: 1 },
  //     });
  //     router.push('/cart');
  //   } else {
  //     window.alert('Please select Size');
  //   }
  // };

  return (
    <>
      <Layout title={product.name} description={product.description}>
        <Row className="justify-content-between">
          <Col>
            <Link href="/">
              <a className="btn btn-light m-2 border responsive_btn">Go Back</a>
            </Link>
          </Col>
          {/* <Col md={2}>
            <Link href={`/product/edit/${slug}`}>
              <a
                className="btn btn-light mr-3 my-2 border responsive_btn"
                style={{ width: '90px' }}
              >
                Edit
              </a>
            </Link>
          </Col> */}
        </Row>
        {product && (
          <>
            <Row className="m-auto">
              <Col
                xs={12}
                md={7}
                // lg={4}
                className="text-center p-2 py-0 m-0"
              >
                <Carousel
                  fade
                  variant="dark"
                  className="w-100 h-80 fix_ratio d-flex"
                >
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={image}
                        alt={product.name}
                        className="center-block"
                        style={{
                          maxWidth: '60%',
                          maxHeight: '80%',
                          width: 'auto',
                          height: 'auto',
                        }}
                      ></Image>
                    </CarouselItem>
                  ))}
                </Carousel>
              </Col>
              <Col xs={12} md={5} className="p-0 px-1 m-0 mt-5 pt-5">
                <ListGroup >
                  <ListGroupItem className="p-1">
                    <h1 className="fs-5">{product.name}</h1>
                  </ListGroupItem>
                  <ListGroupItem className="p-1 new_line">
                    Description: {product.description}
                  </ListGroupItem>
                  <ListGroupItem className="p-1">
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  {/* <ListGroupItem className="p-1">
                    <Row>
                      <Col>Inventory:</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <span className="text-success">In Stock</span>
                        ) : (
                          <span className="text-danger">Out of Stock</span>
                        )}
                      </Col>
                    </Row>
                  </ListGroupItem> */}
                  {product.category === 'Shoes' && (
                    <ListGroupItem className="p-1">
                      <Row className="flex-wrap justify-content-start">
                        <Col className="mr-auto">Size:</Col>
                        <Col>
                          <button
                            className={
                              size === 36
                                ? 'd-flex px-2 rounded bg-info'
                                : 'd-flex px-2 rounded'
                            }
                            onClick={() => setSize(36)}
                          >
                            36
                          </button>
                        </Col>
                        <Col>
                          <button
                            className={
                              size === 37
                                ? 'd-flex px-2 rounded bg-info'
                                : 'd-flex px-2 rounded'
                            }
                            onClick={() => setSize(37)}
                          >
                            37
                          </button>
                        </Col>
                        <Col>
                          <button
                            className={
                              size === 38
                                ? 'd-flex px-2 rounded bg-info'
                                : 'd-flex px-2 rounded'
                            }
                            onClick={() => setSize(38)}
                          >
                            38
                          </button>
                        </Col>
                        <Col>
                          <button
                            className={
                              size === 39
                                ? 'd-flex px-2 rounded bg-info'
                                : 'd-flex px-2 rounded'
                            }
                            onClick={() => setSize(39)}
                          >
                            39
                          </button>
                        </Col>
                        <Col>
                          <button
                            className={
                              size === 40
                                ? 'd-flex px-2 rounded bg-info'
                                : 'd-flex px-2 rounded'
                            }
                            onClick={() => setSize(40)}
                          >
                            40
                          </button>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  {product.category === 'Clothes' && (
                    <ListGroupItem className="p-1">
                      <Row className="flex-wrap justify-content-start">
                        <Col className="mr-auto">Size:</Col>

                        <Col>
                          <button
                            className={
                              size === 'S'
                                ? 'd-flex px-2 rounded bg-info'
                                : 'd-flex px-2 rounded'
                            }
                            onClick={() => setSize('S')}
                          >
                            S
                          </button>
                        </Col>
                        <Col>
                          <button
                            className={
                              size === 'M'
                                ? 'd-flex px-2 rounded bg-info'
                                : 'd-flex px-2 rounded'
                            }
                            onClick={() => setSize('M')}
                          >
                            M
                          </button>
                        </Col>
                        <Col>
                          <button
                            className={
                              size === 'L'
                                ? 'd-flex px-2 rounded bg-info'
                                : 'd-flex px-2 rounded'
                            }
                            onClick={() => setSize('L')}
                          >
                            L
                          </button>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  <ListGroupItem className="p-1">
                    <Row className="text-center">
                      <Col></Col>
                    </Row>
                  </ListGroupItem>
                  {/* <ListGroupItem className="p-1">
                    <button
                      style={{ width: '100%' }}
                      onClick={addToCartHandler}
                      className="btn border responsive_btn  dark_bg text-light"
                      // disabled={quantity > product.countInStock || quantity === 0}
                    >
                      Add To Cart
                    </button>
                  </ListGroupItem> */}
                </ListGroup>
              </Col>
              {/* <Col xs={12} md={3} lg={4} className="p-0 pl-0 m-0">
                <Card>
                  <ListGroup variant="flush">
                    
                  </ListGroup>
                </Card>
              </Col> */}
              <Col xs={12} md={6} className="p-0 pl-0 m-0 mt-3 border-top">
                {product && product.details && (
                  <Table striped bordered hover responsive className="table-sm">
                    <thead>
                      <tr>
                        <td>Product Details</td>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(product.details).map((key, index) => (
                        <tr key={index}>
                          <td>{product.details[key]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
          </>
        )}
      </Layout>
    </>
  );
};
export default ProductScreen;

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { slug } = params;
  await db.connectDB();
  const product = await Product.findOne({ slug }).lean();
  //   await db.disconnectDB();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
};
