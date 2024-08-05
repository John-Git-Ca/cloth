import { Row, Col } from 'react-bootstrap';
import Layout from '../../../components/Layout';
import ProductComponent from '../../../components/ProductComponent';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import Paginate from '../../../components/Paginate';
import Message from '../../../components/Message';

export default function ProductsPage(props) {
  const { products, pages, page, keyword } = props;
  // const [shopByCat, setShopByCat] = useState(
  //   keyword === 'bags' || keyword === 'shoes' || keyword === 'clothes'
  //     ? true
  //     : false
  // );
  // const [shopByBrand, setShopByBrand] = useState(
  //   keyword.substring(0, 6) === 'brand+' ? true : false
  // );

  // const handleShopByCat = () => {
  //   setShopByCat(!shopByCat);
  //   setShopByBrand(false);
  // };

  // const handleShopByBrand = () => {
  //   setShopByBrand(!shopByBrand);
  //   setShopByCat(false);
  // };

  return (
    <Layout title="products">
      {/* <Selection active={keyword === 'all'} content="ALL" target="/" />
      <Selection
        active={keyword === 'bags'}
        content="BAGS"
        target="/page/bags/1"
      />
      <Selection
        active={keyword === 'shoes'}
        content="SHOES"
        target="/page/shoes/1"
        width="90px"
      />
      <Selection
        active={keyword === 'clothes'}
        content="CLOTHES"
        target="/page/clothes/1"
      /> */}
      {/* <button
        onClick={() => handleShopByCat()}
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
      {/* {shopByCat && (
        <div>
          <Selection
            active={keyword === 'all'}
            content="ALL"
            target="/page/all/1"
            width="70px"
          />
          <Selection
            active={keyword === 'bags'}
            content="BAGS"
            target="/page/bags/1"
            width="70px"
          />
          <Selection
            active={keyword === 'shoes'}
            content="SHOES"
            target="/page/shoes/1"
            width="70px"
          />
          <Selection
            active={keyword === 'clothes'}
            content="CLOTHES"
            target="/page/clothes/1"
            width="70px"
          />
        </div>
      )}
      {shopByBrand && (
        <Row>
          <Col>
            {BRANDS.map((br, index) => (
              <Selection
                key={index}
                active={keyword.substring(6) === br}
                content={br}
                target={`/page/brand+${br}/1`}
              />
            ))}
          </Col>
        </Row>
      )} */}
      <div className="text-center">
        <div className="d-inline"></div>

        <Row>
          {products.length > 0 ? (
            products.map((product) => (
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
            ))
          ) : (
            <Message variant="info">No products Found!</Message>
          )}
        </Row>
        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ query }) => {
  const pagenumber = query.pagenumber || 1;
  const pageSize = 48;
  const page = pagenumber;
  console.log(query.keyword);
  let keyword = {};
  if (query.keyword === 'brand+ALL') {
    keyword = { name: { $regex: '', $options: 'i' } };
  } else if (query.keyword.substring(0, 6) === 'brand+') {
    keyword = {
      brand: {
        $regex: query.keyword === 'all' ? '' : query.keyword.substring(6),
        $options: 'i',
      },
    };
  } else if (
    query.keyword === 'bags' ||
    query.keyword === 'shoes' ||
    query.keyword === 'clothes'
  ) {
    keyword = query.keyword
      ? {
          category: {
            $regex: query.keyword === 'all' ? '' : query.keyword,
            $options: 'i',
          },
        }
      : {};
  } else {
    keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword === 'all' ? '' : query.keyword,
            $options: 'i',
          },
        }
      : {};
  }
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
      keyword: query.keyword,
    },
  };
};
