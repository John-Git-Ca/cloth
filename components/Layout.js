import React from 'react';
import Head from 'next/head';
import { Container } from 'react-bootstrap';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="w-100 m-0" style={{ paddingLeft: '18px' }}>
      <Head>
        <title>MOON BEAUTY</title>
      </Head>
      <Header />
      <Container style={{ minHeight: '80vh' }} className="px-0">
        {children}
      </Container>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
