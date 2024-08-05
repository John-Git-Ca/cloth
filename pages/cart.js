import {
  ListGroup,
  Row,
  Col,
  ListGroupItem,
  Card,
  Image,
} from 'react-bootstrap';
import Message from '../components/Message';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import Link from 'next/link';
import Layout from '../components/Layout';
import axios from 'axios';
import { CART_REMOVE_ITEM } from '../constants/constants';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { RiDeleteBinLine } from 'react-icons/ri';

const CartScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems } = cart;
  const removeHanlder = (item) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: item });
  };

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    if (quantity >= 1) {
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    }
  };

  const checkoutHandler = () => {
    router.push('/shipping');
  };
  return (
    <Layout>
      <h3>Shopping Cart:</h3>
      <Row>
        <Col md={12} lg={8}>
          {cartItems.length === 0 ? (
            <Message>
              Your Cart is Empty{' '}
              <Link href="/">
                <a>
                  <strong className="px-1 customize_link text-info">
                    Go shopping
                  </strong>
                </a>
              </Link>
            </Message>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroupItem key={item._id} className="p-1">
                  <Row className="align-items-center flex-wrap p-2">
                    <Col sm={3} md={2} className="text-center px-1 my-1">
                      <Image
                        src={item.images[1] || item.images[0]}
                        className="mw-100"
                        style={{
                          height: '60px',
                          width: 'auto',
                          maxWidth: '100%',
                        }}
                        alt={item.name}
                      />
                    </Col>
                    <Col
                      sm={3}
                      md={2}
                      className="flex-grow-1 responsive_btn  px-1 my-1"
                    >
                      <Link href={`/product/${item.slug}`}>
                        <a className="customize_link" target="_blank">
                          {item.name}
                        </a>
                      </Link>
                    </Col>
                    {item.size && (
                      <Col sm={2} md={1} className="fs-6 px-1 my-1">
                        Size:{item.size}
                      </Col>
                    )}
                    <Col sm={2} md={1} className="fs-6 px-1 my-1">
                      HK${item.price}
                    </Col>
                    <Col sm={3} md={2} className="px-1 my-1">
                      <div
                        className="qty-picker qty-picker2"
                        onClick={() =>
                          item.quantity > 0 &&
                          updateCartHandler(item, item.quantity - 1)
                        }
                      >
                        -
                      </div>
                      <div
                        className="qty-picker"
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {item.quantity}
                      </div>
                      <div
                        className="qty-picker qty-picker2 "
                        onClick={() =>
                          item.quantity < item.countInStock &&
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        +
                      </div>
                    </Col>
                    <Col xs={3} md={2} className="my-1">
                      <button
                        onClick={() => removeHanlder(item)}
                        size="sm"
                        className="responsive_btn bg-light rounded"
                      >
                        <RiDeleteBinLine variant="danger" />
                      </button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={6} lg={4}>
          <Card>
            <ListGroup>
              <ListGroupItem>
                <h2>
                  Subtotal (
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                  items
                </h2>
                <h3>
                  HK$
                  {cartItems
                    .reduce((acc, item) => acc + item.quantity * item.price, 0)
                    .toFixed(2)}
                </h3>
              </ListGroupItem>
              <ListGroupItem>
                <button
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                  className="w-100 responsive_btn rounded dark_bg text-light"
                >
                  Checkout
                </button>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
// export default CartScreen;
