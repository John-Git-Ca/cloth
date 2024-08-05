import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsInstagram } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <Container className="py-2 mt-3 primary_background border-top" fluid>
        <Row className="py-1 m-auto justify-content-center">
          <Col></Col>
          <Col className="text-center">
            <Link className="text-dark" href="/aboutus" legacyBehavior>
              <a className="fs-4" target="_blank">
                About Us
              </a>
            </Link>
          </Col>

          <Col className="text-center">
            <a
              href="http://instagram.com/allhkd500"
              target="_blank"
              rel="noreferrer"
              className="px-3"
            >
              <BsInstagram size={25} style={{ color: '#D46E4D' }} />
            </a>
            <a href="mailto:allhkd500@protonmail.com">
              <HiOutlineMail size={30} style={{ color: '#2596be' }} />
            </a>
          </Col>
        </Row>

        <Row>
          <Col className="text-center py-1">
            &copy; {new Date().getFullYear()} ALLHKD500
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
