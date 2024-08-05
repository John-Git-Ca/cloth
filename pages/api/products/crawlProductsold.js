// import axios from 'axios';
// import nc from 'next-connect';
// import Product from '../../../models/Product';
// import db from '../../../utils/db';
// const cheerio = require('cheerio');

// const handler = nc();

// handler.get(async (req, res) => {
//   console.log('crawing products...');
//     const category = req.query.category;
//   console.log(req.query);
//     const page = req.query.page;
//     crawProducts(category, page);
//   res.send({ message: 'products success imported' });
// });

// export default handler;

// const productCategory = ['Bags', 'Shoes', 'Clothes'];
// const crawUrls = [
//   process.env.CRAW_BAG_URL,
//   process.env.CRAW_SHOE_URL,
//   process.env.CRAW_CLOTHES_URL,
// ];

// const crawProducts = (category, page) => {
//   const crawConfig = {
//     method: 'get',
//     url: crawUrls[category] + `&page=${page}`,
//   };
//   axios(crawConfig)
//     .then(async (response) => {
//       const newProducts = [];
//       const crawBagHtml = response.data;
//       console.log('crawl products: before cheerio');
//       const $ = cheerio.load(crawBagHtml);
//       console.log('crawl products: after cheerio');
//       $('.product_wrapper-products__mjxlx').each((index, element) => {
//         let newProduct = {};
//         console.log('category');
//         console.log(category);
//         if (category === 2) {
//           newProduct.price = 750;
//         } else {
//           newProduct.price = 500;
//         }
//         newProduct.productUrl =
//           process.env.CRAW_DOMAIN_NAME +
//           $(element).children('.product_btn__QSoXG').attr('href');

//         newProduct.brand = $(element)
//           .children('.product_btn__QSoXG')
//           .children('.product_brand__LChRs')
//           .text();
//         newProduct.title = $(element)
//           .children('.product_btn__QSoXG')
//           .children('.product_product-title__7pfDK')
//           .text();

//         newProducts.push(newProduct);
//       });
//       //   console.log(newProducts);
//       console.log(newProducts.length);
//       console.log(newProducts.length + ' products found');
//       for (let i = 0; i < newProducts.length - 60; i++) {
//         const currentProduct = newProducts[i];
//         await crawlProductDetails(currentProduct, category);
//       }
//     })
//     .catch((error) => {
//       console.log('end of create single product error');
//       if (error.response) {
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//       } else if (error.request) {
//         console.log(error.request);
//       } else {
//         console.log('Error', error.message);
//       }
//       console.log('error config', error.config);
//     });
// };

// const crawlProductDetails = (currentProduct, category) => {
//   const productDetailConfig = {
//     method: 'get',
//     url: currentProduct.productUrl,
//   };

//   return axios(productDetailConfig)
//     .then(async (response) => {
//       const productDetailHtml = response.data;
//       const $ = cheerio.load(productDetailHtml);
//       currentProduct.details = {};
//       $('.accordion-text:first')
//         .children('ul')
//         .children('li')
//         .each((index, element) => {
//           const key =
//             $(element)
//               .children('.accordion-list-item-title')
//               .text()
//               .trim()
//               .replace(/\W/g, '_') || 'default';
//           const value =
//             $(element).children('.accordion-list-item-text').text() ||
//             $(element).text();
//           if (key) currentProduct.details[key] = value;
//         });

//       currentProduct.slug = $('.accordion-list-item-text-book')
//         .text()
//         .split(' ')
//         .pop();

//       currentProduct.description = $('blockquote').text();

//       currentProduct.images = [];
//       console.log('slick vertical');
//       $('.slick-track').each((index, element) => {
//         if (index === 0) {
//           const img = $(element).find('img').attr('src');
//           if (img) {
//             currentProduct.images.push(img);
//           }
//         }
//       });
//       //   $('.slick-slider.slick-vertical.slick-initialized')
//       //     .children('.slick-list')
//       //     .children('.slick-track')
//       //     .children('div')
//       //     .each((index, element) => {
//       //       // let img = $(element)
//       //       //   .children('div')
//       //       //   .children('picture')
//       //       //   .children('img')
//       //       //   .attr('src');

//       //       let img = $(element).find('img').attr('src');

//       //       if (img) {
//       //         currentProduct.images.push(img);
//       //       }
//       //     });

//       console.log('currentProduct');
//       //   console.log(currentProduct);

//       //search product on my website
//       await db.connectDB();
//       const findResult = await Product.find({ slug: currentProduct.slug });
//       if (findResult.length === 0) {
//         console.log('product does not exist');
//         const insertProduct = new Product({
//           name: currentProduct.brand + ' ' + currentProduct.title,
//           slug: currentProduct.slug,
//           brand: currentProduct.brand,
//           category: productCategory[category],
//           countInStock: Math.floor(Math.random() * 100 + 10),
//           price: currentProduct.price,
//           images: currentProduct.images,
//           description: currentProduct.description || 'See Product Details',
//           details: currentProduct.details,
//           productUrl: currentProduct.productUrl,
//         });
//         const insertProductResult = await insertProduct.save();
//         console.log(insertProductResult);
//       } else {
//         console.log('product exists');
//         console.log(findResult);
//       }

//       //   await db.disconnectDB();
//     })
//     .catch((error) => {
//       console.log('end of create single product error');
//       if (error.response) {
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//       } else if (error.request) {
//         console.log(error.request);
//       } else {
//         console.log('Error', error.message);
//       }
//       console.log('error config', error.config);
//     });
// };
