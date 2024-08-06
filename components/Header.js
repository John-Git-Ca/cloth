import React, { useContext,  useState } from 'react';
import { Navbar, Row, Col, Form } from 'react-bootstrap';
import Link from 'next/link';
import { Store } from '../utils/Store';
import { USER_LOGOUT } from '../constants/constants';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { AiFillSetting } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';

const Header = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {  userInfo } = state;
  const [keyword, setKeyword] = useState('');
  const logoutHandler = () => {
    dispatch({ type: USER_LOGOUT });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    Cookies.remove('shippinhAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
  };

  const handleEnter = (e) => {
    if (e.charCode === 13) {
      e.preventDefault();
      router.push(keyword ? `/page/${keyword.trim()}/1` : `/page/all/1`);
    }
  };

  return (
    <Navbar className="border-bottom m-auto p-1 px-0 w-100">
      <Row className="align-items-center justify-content-center w-100">
        <Col className="p-0 text-center" xs={2} sm={3} md={4} lg={2}>
          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand className="fs-3 nav_brand m-0">
              HOME
            </Navbar.Brand>
          </Link>
        </Col>
        <Col className="text-center" xs={8} sm={7} md={6} lg={3}>
          <Form className="d-flex" style={{ maxWidth: '400px' }}>
            <Form.Control
              className="me-2"
              placeholder="Search Products..."
              size="sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => handleEnter(e)}
            />
            <Link
              href={keyword ? `/page/${keyword}/1` : `/page/all/1`}
              legacyBehavior
            >
              <a className="responsive_btn align-self-center">
                <BsSearch size={20} />
              </a>
            </Link>
          </Form>
        </Col>
        {/* <Col xs={2} sm={1} md={2} lg={1} className="responsive_btn text-center">
          <Link href="/cart" className="responsive_btn" legacyBehavior>
            <a className="responsive_btn">
              {cart.cartItems.reduce((acc, item) => acc + item.quantity, 0) ===
              0 ? (
                <HiOutlineShoppingBag size={30} />
              ) : (
                <HiShoppingBag size={30} color="bg-info" />
              )}
            </a>
          </Link>
        </Col> */}
        {/* <Col xs={3} sm={2} md={2} lg={1} className="responsive_btn text-center">
          <Link href="/order-history" legacyBehavior>
            <a>Orders</a>
          </Link>
        </Col>
        <Col xs={3} sm={2} md={2} lg={1} className="responsive_btn text-center">
          <Link href="/profile" legacyBehavior>
            <a>Profile</a>
          </Link>
        </Col>
        <Col xs={3} sm={2} md={2} lg={1} className="responsive_btn text-center">
          <Link href="/register" legacyBehavior>
            <a>Register</a>
          </Link>
        </Col> */}
        {/* <Col xs={3} sm={3} md={2} lg={1} className="responsive_btn text-center">
          {userInfo ? (
            <div onClick={logoutHandler}>
              <a>SignOut</a>&nbsp;
            </div>
          ) : (
            <Link href="/login" legacyBehavior>
              <a>SignIn</a>
            </Link>
          )}
        </Col> */}
        <Col xs={3} sm={3} md={2} lg={1} className="responsive_btn text-center">
          {userInfo && 
            <div onClick={logoutHandler}>
              <a>SignOut</a>&nbsp;
            </div>
          }
        </Col>
        {userInfo && userInfo.isAdmin && (
          <Col>
            <Link href="/admin/productlist" legacyBehavior>
              <a className=" responsive_btn">
                <AiFillSetting />
              </a>
            </Link>
          </Col>
        )}
      </Row>
    </Navbar>
  );
};

export default Header;
