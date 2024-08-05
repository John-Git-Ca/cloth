// import axios from 'axios';
// import nc from 'next-connect';
// import Product from '../../../models/Product';
// import db from '../../../utils/db';
// const cheerio = require('cheerio');

// const handler = nc();

// handler.get(async (req, res) => {
//   console.log('crawing products...');
//   const category = req.query.category;
//   console.log(req.query);
//   const page = req.query.page;
//   crawProducts(category, page);
//   res.send({ message: 'products success imported' });
// });

// export default handler;

// const productCategory = [
//   'Bags',
//   'Shoes',
//   'Clothes',
//   'Wallets',
//   'Hats',
//   'Scarves',
// ];

// const crawProducts = (category, page) => {
//   const crawUrls = [
//     `https://www.farfetch.com/hk/shopping/women/bags-purses-1/items.aspx?page=${page}&view=30&sort=3&designer=7466135|49486|8880292|2765|4062|8690|15503980|214504|12080417|2450|15652|18370|412694|769627|28299800|47755737|11915262|5589921|825223|3977820|190721|10845712|1859723|113040|2747|251057|1862611|413452|14236|7199|171092|619|130548|4165|15514|120161|4249434|8479|6117139|106911|3064|25354|991|6832|3066|4461170|18741|516688|8880|258324|2038|3895340|8676|150826|43281599|1025204|114084|4981|12070683|2762|4224|8593682|8360|4535|3879|3977901|1664|1205035|100965|1123|6|22775|34624|735267|3060|17127|9967283|547344|3451|2049368|5502|12080457|513808|9463|39691|29246|18286|23606|10533|145807|4001|235168|4191|23875|8750|17886|55006|9419|36241|1186|7553889|580741|6864`,
//     `https://www.farfetch.com/hk/shopping/women/shoes-1/items.aspx?page=${page}&view=90&sort=3&designer=7466135|49486|8880292|2765|4062|8690|15503980|214504|12080417|2450|15652|18370|412694|769627|28299800|47755737|11915262|5589921|825223|3977820|190721|10845712|1859723|113040|2747|251057|1862611|413452|14236|7199|171092|619|130548|4165|15514|120161|4249434|8479|6117139|106911|3064|25354|991|6832|3066|4461170|18741|516688|8880|258324|2038|3895340|8676|150826|43281599|1025204|114084|4981|12070683|2762|4224|8593682|8360|4535|3879|3977901|1664|1205035|100965|1123|6|22775|34624|735267|3060|17127|9967283|547344|3451|2049368|5502|12080457|513808|9463|39691|29246|18286|23606|10533|145807|4001|235168|4191|23875|8750|17886|55006|9419`,
//     `https://www.farfetch.com/hk/shopping/women/clothing-1/items.aspx?page=${page}&view=30&sort=3&designer=7466135|49486|8880292|2765|4062|8690|15503980|214504|12080417|2450|15652|18370|412694|769627|28299800|47755737|11915262|5589921|825223|3977820|190721|10845712|1859723|113040|2747|251057|1862611|413452|14236|7199|171092|619|130548|4165|15514|120161|4249434|8479|6117139|106911|3064|25354|991|6832|3066|4461170|18741|516688|8880|258324|2038|3895340|8676|150826|43281599|1025204|114084|4981|12070683|2762|4224|8593682|8360|4535|3879|3977901|1664|1205035|100965|1123|6|22775|34624|735267|3060|17127|9967283|547344|3451|2049368|5502|12080457|513808|9463|39691|29246|18286|23606|10533|145807|4001|235168|4191|23875|8750|17886|55006|9419|10527318|762802`,
//     `https://www.farfetch.com/hk/shopping/women/wallets-purses-1/items.aspx?page=${page}&view=30&sort=3&designer=7466135|49486|8880292|2765|4062|8690|15503980|214504|12080417|2450|15652|18370|412694|769627|28299800|47755737|11915262|5589921|825223|3977820|190721|10845712|1859723|113040|2747|251057|1862611|413452|14236|7199|171092|619|130548|4165|15514|120161|4249434|8479|6117139|106911|3064|25354|991|6832|3066|4461170|18741|516688|8880|258324|2038|3895340|8676|150826|43281599|1025204|114084|4981|12070683|2762|4224|8593682|8360|4535|3879|3977901|1664|1205035|100965|1123|6|22775|34624|735267|3060|17127|9967283|547344|3451|2049368|5502|12080457|513808|9463|39691|29246|18286|23606|10533|145807|4001|235168|4191|23875|8750|17886|55006|9419|36241|1186`,
//     `https://www.farfetch.com/hk/shopping/women/hats-1/items.aspx?page=${page}&view=30&sort=3&designer=2450|769627|2765|339767|8360|17886|34624|7466135|4535|25354`,
//     `https://www.farfetch.com/hk/shopping/women/scarves-1/items.aspx?page=${page}&view=30&sort=3&designer=10533|2450|339767|2747|4062|8880292|769627|25354|34624`,
//   ];
//   const crawConfig = {
//     method: 'get',
//     url: crawUrls[category],
//   };

//   axios(crawConfig)
//     .then(async (response) => {
//       const crawBagHtml = response.data;
//       console.log('crawl products: before cheerio');
//       const $ = cheerio.load(crawBagHtml);

//       console.log('crawl products: after cheerio');
//       $('.ltr-1gxq4h9.e4l1wga0').each(async (index, element) => {
//         const productDetailUrl =
//           'https://www.farfetch.com' + $(element).attr('href');
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         crawlProductDetails(productDetailUrl, category);
//       });
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

// const crawlProductDetails = (productDetailUrl, category) => {
//   var currentProduct = { images: [] };
//   currentProduct.slug = productDetailUrl.split('=')[1];
//   if (category === 2) {
//     currentProduct.price = 750;
//   } else {
//     currentProduct.price = 500;
//   }
//   currentProduct.productUrl = productDetailUrl;
//   const productDetailConfig = {
//     method: 'get',
//     url: currentProduct.productUrl,
//   };
//   //   console.log(currentProduct);
//   return axios(productDetailConfig)
//     .then(async (response) => {
//       const productDetailHtml = response.data;
//       const $ = cheerio.load(productDetailHtml);
//       currentProduct.details = {};
//       currentProduct.brand = $(
//         '.ltr-jtdb6u-Body-Heading-HeadingBold.e1h8dali1'
//       ).text();

//       currentProduct.slug = (
//         currentProduct.brand + currentProduct.slug
//       ).replace(/\s/g, '');

//       currentProduct.title = $('.ltr-13ze6d5-Body.efhm1m90').text();
//       $('.ltr-bjn8wh.ed0fyxo0').each((index, element) => {
//         const image = $(element).children('button').children('img').attr('src');
//         if (image) {
//           currentProduct.images.push(image);
//         }
//       });

//       console.log('currentProduct');
//       console.log(currentProduct);

//       //search product on my website
//       await db.disconnectDB();
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
//         await insertProduct.save();
//         // console.log(insertProductResult);
//       } else {
//         console.log('product exists');
//         // console.log(findResult);
//       }

//       //   await db.disconnectDB();
//       return currentProduct;
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
