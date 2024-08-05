import { Row, Col } from 'react-bootstrap';
import Layout from '../components/Layout';
import ProductComponent from '../components/ProductComponent';
import db from '../utils/db';
import Product from '../models/Product';
import Paginate from '../components/Paginate';
import Selection from '../components/Selection';
import { useState } from 'react';
import { BRANDS } from '../constants/constants';

export default function Home(props) {
  const [shopByCat, setShopByCat] = useState(false);
  const [shopByBrand, setShopByBrand] = useState(false);
  const { products, pages, page, keyword } = props;
  const speciallink10 = {
    name: '百搭Link',
    slug: 'speciallink10',
    images: ['/images/speciallink10.jpg'],
    price: '10',
  };
  const speciallink100 = {
    name: '百搭Link',
    slug: 'speciallink100',
    images: ['/images/speciallink100.jpg'],
    price: '100',
  };
  const handleShopByCat = () => {
    setShopByCat(!shopByCat);
    setShopByBrand(false);
  };

  const handleShopByBrand = () => {
    setShopByBrand(!shopByBrand);
    setShopByCat(false);
  };
  return (
    <Layout title="products">
      <div>
        {/* <button
          onClick={() => handleShopByCat(!shopByCat)}
          className={
            shopByCat
              ? 'd-inline-block m-1 p-1 rounded text-center  green_border bg-dark text-light'
              : 'd-inline-block m-1 p-1 rounded text-center border'
          }
        >
          SHOP BY CATEGORY
        </button> */}
        {/* <button
          onClick={() => handleShopByBrand()}
          className={
            shopByBrand
              ? 'd-inline-block m-1 p-1 rounded text-center  green_border bg-dark text-light'
              : 'd-inline-block m-1 p-1 rounded text-center border'
          }
        >
          SHOP BY BRAND
        </button> */}
        {shopByCat && (
          <div>
            <Selection
              active={keyword === 'all'}
              content="ALL"
              target="/page/all/1"
            />
            <Selection
              active={keyword === 'bags'}
              content="BAGS"
              target="/page/bags/1"
            />
            <Selection
              active={keyword === 'shoes'}
              content="SHOES"
              target="/page/shoes/1"
            />
            <Selection
              active={keyword === 'clothes'}
              content="CLOTHES"
              target="/page/clothes/1"
            />
          </div>
        )}
        {shopByBrand && (
          <Row>
            <Col>
              {BRANDS.map((br, index) => (
                <Selection
                  key={index}
                  active={keyword.substring(0, 6) === br}
                  content={br}
                  target={`/page/brand+${br}/1`}
                />
              ))}
            </Col>
          </Row>
        )}
        {/* <button
          onClick={() => setShopByBrand(!shopByBrand)}
          className={
            shopByCat
              ? 'd-inline-block m-1 px-1 rounded text-center  green_border bg-dark text-light'
              : 'd-inline-block m-1 px-1 rounded text-center border'
          }
        >
          SHOP BY BRAND
        </button> */}
        {/* <Row className="border-bottom justify-content-start">
          <Col
            style={{
              maxHeight: '400px',
              maxWidth: '300px',
            }}
            className="m-1 mx-auto p-0"
            xs={12}
          >
            <ProductComponent product={speciallink10} className="p-0" />
          </Col>
          <Col
            style={{
              maxHeight: '400px',
              maxWidth: '300px',
            }}
            className="m-1 mx-auto p-0"
            xs={12}
          >
            <ProductComponent product={speciallink100} className="p-0" />
          </Col>
        </Row> */}
        <Row>
          {products.map((product) => (
            <Col
              key={product._id}
              sm={12}
              md={6}
              lg={4}
              xl={3}
              style={{
                maxHeight: '400px',
                maxWidth: '300px',
              }}
              className="m-1 mx-auto p-0"
            >
              <ProductComponent product={product} className="p-0" />
            </Col>
          ))}
        </Row>
        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ query }) => {
  const { pagenumber } = query;
  const pageSize = 48;
  const page = pagenumber || 1;
  const keyword = query.keyword
    ? {
        name: {
          $regex: query.keyword,
          $options: 'i',
        },
      }
    : {};
  await db.connectDB();
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .lean()
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: 'desc', test: -1 });
  //   await db.disconnectDB();
  const productObjects = products.map(db.convertDocToObj);
  productObjects.forEach((product) => {
    if (product.images.length > 1) {
      product.images = product.images.slice(1, 2);
    }
  });
  return {
    props: {
      products: productObjects,
      page,
      pages: Math.ceil(count / pageSize),
      keyword: 'all',
    },
  };
};
