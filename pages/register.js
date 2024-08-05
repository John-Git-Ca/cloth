import React, { useEffect, useState, useContext } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import Link from 'next/link';
import Layout from '../components/Layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';

const RegisterScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [message2, setMessage2] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disableBtn, setDisableBtn] = useState(true);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/register', {
        name: name,
        email: email,
        password: password,
      });
      Cookies.set('userInfo', data);
      router.push('/login');
    } catch (error) {
      setErrorMessage(
        // error.response.data ? error.response.data.message : error.message
        getError(error)
      );
    }
  };

  useEffect(() => {
    if (userInfo) {
      router.push('/login');
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
    } else {
      setMessage('');
    }
    if (name.length >= 8 && password.length >= 8) {
      setMessage2('');
      setDisableBtn(false);
    } else {
      setMessage2('Name or password has to be at least 8 characters');
    }
    setErrorMessage('');
  }, [password, confirmPassword, name, email]);
  return (
    <Layout>
      <FormContainer>
        <h1>Sign Up</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label className="m-0">Name</Form.Label>
            <Form.Control
              size="sm"
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label className="m-0">Email Address</Form.Label>
            <Form.Control
              size="sm"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label className="m-0">Password</Form.Label>
            <Form.Control
              size="sm"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label className="m-0">Confirm Password</Form.Label>
            <Form.Control
              size="sm"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {message && <Message variant="danger">{message}</Message>}
          {message2 && <Message variant="danger">{message2}</Message>}
          {errorMessage && <Message variant="danger">{errorMessage}</Message>}
          <Button
            type="submit"
            className="m-2 w-25 responsive_btn"
            style={{ minWidth: '95px' }}
            disabled={disableBtn}
          >
            Register
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            Have an Account?{' '}
            <Link href={'/login'}>
              <a>
                <strong className="customize_link">Login</strong>
              </a>
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </Layout>
  );
};

export default RegisterScreen;
