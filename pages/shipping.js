import React, { useContext, useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Layout from '../components/Layout';
import {
  SAVE_PAYMENT_METHOD,
  SAVE_SHIPPING_ADDRESS,
} from '../constants/constants';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { COUNTRIES } from '../utils/calculate';

const ShippingScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { redirect } = router.query;
  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [postcode, setPostcode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [disableBtn, setDisableBtn] = useState(true);

  const [hideCountry, setHideCountry] = useState(true);

  const submitHandler = (e) => {
    if (!COUNTRIES.includes(country)) {
      window.alert('Please choose one country from the list!');
      return;
    }
    e.preventDefault();

    if (!city || !recipient || !address || !phone || !country) {
      window.alert('Please enter all required info');
      return;
    }
    dispatch({
      type: SAVE_SHIPPING_ADDRESS,
      payload: { recipient, address, phone, city, country, postcode, notes },
    });
    Cookies.set('shippingAddress', {
      recipient,
      address,
      phone,
      city,
      country,
      postcode,
      notes,
    });
    dispatch({
      type: SAVE_PAYMENT_METHOD,
      payload: paymentMethod,
    });
    Cookies.set('paymentMethod', paymentMethod);
    router.push('/placeorder');
  };

  const selectCountry = (c) => {
    setCountry(c);
    setHideCountry(!hideCountry);
  };

  useEffect(() => {
    setPaymentMethod('Paypal');

    if (recipient && address && paymentMethod) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
    if (!userInfo && redirect !== 'guest') {
      router.push('/login?redirect=/shipping');
    }
  }, [recipient, address, city, country, paymentMethod, redirect, router, userInfo]);
  return (
    <Layout>
      <FormContainer>
        <h3 className="m-0">Shipping Information</h3>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label className="m-0">* Recipient</Form.Label>
            <Form.Control
              size="sm"
              type="email"
              placeholder="Enter Recipient..."
              //   value={email}
              onChange={(e) => setRecipient(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="address">
            <Form.Label className="m-0">* Address</Form.Label>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Enter address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Row>
            <Col>
              <Form.Group controlId="phone">
                <Form.Label className="m-0">* Phone</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Enter phone..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="city">
                <Form.Label className="m-0">* City</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Enter city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="postcode">
                <Form.Label className="m-0">Postcode</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Enter postcode..."
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col xs={6} md={6}>
              <Form.Group controlId="country">
                <Form.Label className="m-0">* Country</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Select Options..."
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onClick={() => setHideCountry(!hideCountry)}
                ></Form.Control>
              </Form.Group>
            </Col>
            {!hideCountry && (
              <div xs={12} md={12} style={{ position: 'relative' }}>
                <Col className="country_widget d-inline">
                  {COUNTRIES.map((country, index) => (
                    <div
                      className="country_element"
                      key={index}
                      onClick={() => selectCountry(country)}
                    >
                      {country}
                    </div>
                  ))}
                </Col>
              </div>
            )}
            <Col md={12}>
              <Form.Group controlId="notes">
                <Form.Label className="m-0">Note</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  lacolder="Add some notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          {/* <Button type="submit" variant="primary" className="m-2">
            Continue
          </Button> */}
        </Form>
        <br />
        {/* <h3 className="m-0">Payment Method</h3> */}
        <Form onSubmit={submitHandler}>
          {/* <Form.Group>
            <Form.Label>
              <span className="fs-6">*</span> Select Method
            </Form.Label>
            <Form.Check
              type="radio"
              label="Paypal or Credit Card"
              id="Paypal"
              name="paymentMethod"
              value="PayPal"
              // checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </Form.Group> */}

          <button
            type="submit"
            className="m-2 w-25 responsive_btn rounded dark_bg text-light"
            style={{ minWidth: '95px' }}
            disabled={disableBtn}
          >
            Continue
          </button>
        </Form>
      </FormContainer>
    </Layout>
  );
};

export default ShippingScreen;
