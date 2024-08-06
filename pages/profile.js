import React, { useState, useEffect, useContext } from 'react';
import { Form } from 'react-bootstrap';
import Message from '../components/Message';
import dynamic from 'next/dynamic';
import { Store } from '../utils/Store';

import Layout from '../components/Layout';

import { getError } from '../utils/error';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const ProfileScreen = () => {
  const { state, dispatch } = useContext(Store);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const { userInfo } = state;
  const [disableBtn, setDisableBtn] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
    if (password !== confirmPassword || password.length < 6) {
      setMessage('Passwords not valid');
      setDisableBtn(true);
    } else {
      setMessage('');
      setDisableBtn(false);
    }
  }, [password, confirmPassword,router, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      setMessage('Updated successfully');
    } catch (err) {
      setMessage(getError(err));
    }
  };

  return (
    <Layout title="profile">
      <h2>User Profile</h2>
      <Form
        onSubmit={submitHandler}
        style={{ maxWidth: '500px' }}
        className="m-auto"
      >
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {message && <Message variant="info">{message}</Message>}

        <button
          type="submit"
          className="m-1 p-1 rounded dark_bg text-light"
          disabled={disableBtn}
        >
          Update
        </button>
      </Form>
    </Layout>
  );
};

// export default ProfileScreen;
export default dynamic(() => Promise.resolve(ProfileScreen), { ssr: false });
