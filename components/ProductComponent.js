import React from 'react';
import { Card } from 'react-bootstrap';
import Link from 'next/link';

const ProductComponent = ({ product }) => {
  return (
    <Card
      className="m-2 p-0 rounded responsive_btn"
      style={{ height: '315px' }}
    >
      <div
        style={{ height: '245px', positive: 'relative' }}
        className="text-center"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -63%)',
          }}
        >
          <Link href={`/product/${product.slug}`} legacyBehavior>
            <a className="p-0 m-0 text-center">
              <Card.Img
                className="align-middle"
                src={product.images[0]}
                variant="bottom"
                style={{
                  maxWidth: '270px',
                  maxHeight: '235px',
                  height: 'auto',
                  width: 'auto',
                }}
              />
            </a>
          </Link>
        </div>
      </div>
      <Card.Body
        className="p-0  primary_background  align-bottom"
        style={{ height: '50px' }}
      >
        {/* <Link
          className="text-dark"
          href="/"
          style={{ backgroundColor: 'white' }}
        >
          <a className="p-0 m-0 text-center">
            <Card.Title
              className="fs-6 p-0 m-0"
              style={{ backgroundColor: 'white', height: '50%' }}
            >
              {product.name}
            </Card.Title>
          </a>
        </Link> */}
        <div className="fs-4 text-center">
          <div className="mx-3 align-bottom">
            {product.name.split(' ').slice(0, 4).join(' ')}
            <br />
            <strong>${product.price}</strong>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductComponent;
