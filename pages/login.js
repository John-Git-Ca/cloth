import { Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { USER_LOGIN } from '../constants/constants';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Message from '../components/Message';

const SigninScreen = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, [router, userInfo]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      dispatch({ type: USER_LOGIN, payload: data });
      console.log(data);
      Cookies.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
    } catch (error) {
      setErrorMessage(
        error.response.data ? error.response.data.message : error.message
      );
    }
  };
  useEffect(() => {
    setErrorMessage('');
  }, [email, password]);
  return (
    <Layout>
      <h3>Sign In</h3>
      <Form
        style={{ maxWidth: '400px' }}
        className="m-auto"
        onSubmit={submitHandler}
      >
        <Form.Group controlId="email">
          <Form.Label className="m-0">Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label className="m-0">Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Text className="d-block">
          Do not have an account?{' '}
          <Link href="/register">
            <a>
              <strong className="px-1 customize_link ">Register</strong>
            </a>
          </Link>
        </Form.Text>
        {errorMessage && <Message variant="danger">{errorMessage}</Message>}
        <button
          type="submit"
          className="m-2 w-25 responsive_btn rounded  dark_bg text-light"
          variant="light"
          style={{ minWidth: '95px' }}
        >
          Sign In
        </button>
      </Form>
    </Layout>
  );
};

export default SigninScreen;
