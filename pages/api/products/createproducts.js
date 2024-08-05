// import axios from 'axios';
// import nc from 'next-connect';
// import db from '../../../utils/db';
// import Product from '../../../models/Product';
// import { wordExclude } from '../../../constants/wordExclude';

// const handler = nc();

// handler.get(async (req, res) => {
//   await db.connectDB();
//   createProducts();
//   console.log('creating products...');
//   const product = await Product.findById(req.query.id);
//   //   await db.disconnectDB();
//   res.send(product);
// });

// export default handler;

// // const isASCII = (str) => {
// //   return /^[\x00-\x7F]*$/.test(str);
// // };

// const createProducts = () => {
//   console.log('create products');
//   var bazhuayuProducts;
//   var selectedIndex = [];
//   var bazhuayuAccesstoken;

//   const bazhuayuPassword = {
//     username: '14715014903',
//     password: 'il0veyip',
//     grant_type: 'password',
//   };

//   const bazhuayuAccessTokenConfig = {
//     method: 'post',
//     url: 'https://openapi.bazhuayu.com/token',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: bazhuayuPassword,
//   };
//   return axios(bazhuayuAccessTokenConfig)
//     .then((response) => {
//       bazhuayuAccesstoken = response.data.data.access_token;
//       console.log('bazhuayuAccesstoken');
//       //   const getProductsConfig = {
//       //     method: 'get',
//       //     url: `https://advancedapi.bazhuayu.com/api/notexportdata/gettop?taskId=283b63ff-8c7c-4cec-bfb9-a3d78a0bade2&size=5`,
//       //     headers: {
//       //       Authorization: `Bearer ` + bazhuayuAccesstoken,
//       //     },
//       //   };
//       //   return axios(getProductsConfig);
//     })
//     .then(async (response) => {
//       console.log(response);
//       bazhuayuProducts = response?.data?.data?.dataList || 0;
//       var checkProductRromises = [];
//       console.log(
//         `${bazhuayuProducts.length} products found on bazhuayu create`
//       );
//       //   for (let i = 0; i < bazhuayuProducts.length; i++) {
//       for (let i = 0; i < 5; i++) {
//         var postProductUrlPromises = [];
//         await db.connectDB();
//         const checkProductExistance = await Product.findOne({
//           slug: 'free-shirt',
//         });

//         console.log('checkProductExistance');
//         console.log(checkProductExistance);
//         // await db.disconnectDB();
//         if (checkProductExistance) {
//           console.log('product exists');
//         } else {
//           console.log('post new product to website..');
//           const postProductPromise = await createSingleProduct(
//             bazhuayuAccesstoken,
//             bazhuayuProducts,
//             i
//           );
//           postProductUrlPromises.push(postProductPromise);
//         }
//         const refId = bazhuayuProducts[i].ref_no;
//         if (
//           bazhuayuProducts[i].Availability !== 'Availability Notice' &&
//           //   isASCII(refId) &&
//           refId.indexOf(' ') < 0
//         ) {
//           console.log(bazhuayuProducts[i].ProductName);
//         } else {
//           checkProductRromises.push(0);
//         }
//       }

//       return Promise.all(checkProductRromises);
//     })
//     .then(async (response) => {
//       var postProductUrlPromises = [];
//       console.log(`${response.length} products found on bazhuayu`);
//       console.log(
//         `${response.length} products found on bazhuayu with availablity not equal to availability notice, and in English`
//       );
//       // finalResponse.push(`${response.length} products found in shopify`);
//       // finalResponse.push('variantId');
//       for (let i = 0; i < response.length; i++) {
//         if (response[i] !== 0) {
//           const edges = response[i].data.data.productVariants.edges;
//           if (edges.length === 0) {
//             selectedIndex.push(i);
//           } else {
//             console.log(`edges for item ${i} is not empty`);
//           }
//         }
//       }
//       if (selectedIndex.length === 0) {
//         throw new Error('0 products found on bazhuayu, but not on shopify');
//       }
//       console.log(
//         `${selectedIndex.length} products found on bazhuayu, but not on shopify`
//       );
//       for (let j = 0; j < response.length; j++) {
//         if (j < 0) {
//           // if (selectedIndex.includes(j)) {
//           const postProductPromise = await createSingleProduct(
//             bazhuayuAccesstoken,
//             bazhuayuProducts,
//             j
//           );
//           console.log(bazhuayuProducts[j]);
//           postProductUrlPromises.push(postProductPromise);
//           // break;
//         }
//       }
//       // finalResponse.push(`${numberofProducts} products should be archived`);
//       return Promise.all(postProductUrlPromises);
//     })
//     .then((response) => {
//       console.log(`${response.length} products posted to shopify`);
//     })
//     .catch((error) => {
//       console.log(error);
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//       } else if (error.request) {
//         // The request was made but no response was received
//         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//         // http.ClientRequest in node.js
//         console.log(error.request);
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.log('Error', error.message);
//       }
//       console.log('error config', error.config);
//     });
// };

// const titleCase = (str) => {
//   str = str.toLowerCase().split(' ');
//   for (var i = 0; i < str.length; i++) {
//     str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
//   }
//   return str.join(' ');
// };

// const createSingleProduct = (bazhuayuAccesstoken, bazhuayuProducts, j) => {
//   console.log('current product');

//   var productSize = 'N/A';
//   var productUsage = 'See Packaging';
//   var productIngredient = 'See Packaging';
//   var productMadeIn = 'N/A';
//   var plagiarismDescription = '';

//   const tempPrice = Math.max(
//     Number(bazhuayuProducts[j].OriginalPrice.substring(1)),
//     Number(bazhuayuProducts[j].Price.substring(1))
//   );
//   var newProduct = {
//     title: titleCase(
//       bazhuayuProducts[j].Brand + ' ' + bazhuayuProducts[j].ProductName
//     ),
//     vendor: titleCase(bazhuayuProducts[j].Brand),

//     metafields_global_title_tag: titleCase(
//       bazhuayuProducts[j].Brand +
//         ' ' +
//         bazhuayuProducts[j].ProductName +
//         ' | Carsha'
//     ),
//     metafields_global_description_tag: titleCase(
//       'Buy ' +
//         bazhuayuProducts[j].Brand +
//         ' ' +
//         bazhuayuProducts[j].ProductName +
//         ' and more'
//     ),
//     tags: [],
//     variants: [
//       {
//         weight_unit: 'g',
//         price: Math.round(tempPrice * 8 * 0.925 * 100) / 100,
//         inventory_management: 'shopify',
//         inventory_policy: 'deny',
//         sku: bazhuayuProducts[j].ref_no,
//         requires_shipping: true,
//         inventory_quantity: Math.round(Math.random() * 298),
//         compare_at_price: Math.round(tempPrice * 8.2 * 100) / 100,
//       },
//     ],
//     published_scope: 'global',
//   };

//   const bazhuayuHeaders = {
//     Authorization: `Bearer ` + bazhuayuAccesstoken,
//     'Content-Type': 'application/json',
//   };

//   const postProductUrlConfig = {
//     method: 'post',
//     url: `https://advancedapi.bazhuayu.com/api/task/UpdateTaskRule`,
//     headers: bazhuayuHeaders,
//     data: {
//       taskId: 'dec02c17-a284-d2f2-ce09-e484b4f85066',
//       name: 'ghlp99o9aev.Url',
//       value: bazhuayuProducts[j].ProductURL,
//     },
//   };
//   return axios(postProductUrlConfig)
//     .then(() => {
//       console.log('posted ProductUrlConfig');
//       const startScrapProductConfig = {
//         method: 'post',
//         url: 'https://advancedapi.bazhuayu.com/api/task/StartTask?taskId=dec02c17-a284-d2f2-ce09-e484b4f85066',
//         headers: bazhuayuHeaders,
//         // data: {
//         //   taskId: 'dec02c17-a284-d2f2-ce09-e484b4f85066',
//         // },
//       };

//       return axios(startScrapProductConfig);
//     })
//     .then(() => {
//       console.log('started ScrapProduct');
//       const encodedUrl = encodeURI(
//         bazhuayuProducts[j].Brand + ' ' + bazhuayuProducts[j].ProductName
//       );
//       const changeYandexKeywordConfig = {
//         method: 'post',
//         url: 'https://advancedapi.bazhuayu.com/api/task/UpdateTaskRule',
//         headers: bazhuayuHeaders,
//         data: {
//           taskId: 'a57a8f08-fa1f-b908-7045-13d7fefcb0f0',
//           name: '07qrlm020zv5.Url',
//           value: `https://yandex.com/search/?text=${encodedUrl}+-ebay+-sephora+-amazon+-ebeauty+-beautybay&lang=en`,
//         },
//       };
//       return axios(changeYandexKeywordConfig);
//     })
//     .then(() => {
//       console.log('changed YandexKeyword');
//       const startScrapYandexConfig = {
//         method: 'post',
//         url: 'https://advancedapi.bazhuayu.com/api/task/StartTask?taskId=a57a8f08-fa1f-b908-7045-13d7fefcb0f0',
//         headers: bazhuayuHeaders,
//       };
//       return axios(startScrapYandexConfig);
//     })
//     .then(async () => {
//       console.log('started ScrapYandex search');
//       const getShillaScrapInfoConfig = {
//         method: 'get',
//         url: 'https://advancedapi.bazhuayu.com/api/notexportdata/gettop?taskId=dec02c17-a284-d2f2-ce09-e484b4f85066&size=1000',
//         headers: bazhuayuHeaders,
//       };
//       for (let i = 0; i < 300; i++) {
//         const getShillaResponse = await axios(getShillaScrapInfoConfig);
//         if (
//           getShillaResponse.data.data.total === undefined ||
//           getShillaResponse.data.data.total === 0
//         ) {
//           await new Promise((resolve) => setTimeout(resolve, 3000));
//           console.log(`waiting getShilla Scrap Info ... ${i} times`);
//           continue;
//         } else {
//           return getShillaResponse;
//         }
//       }
//     })
//     .then(async (response) => {
//       const productDetails = response.data.data;
//       const { total, dataList } = productDetails;
//       console.log('total ' + total + ' datalist');
//       // console.log(dataList);
//       // console.log(dataList);
//       console.log(dataList[0]);

//       newProduct.product_type = dataList[0].Category;

//       newProduct.tags.push(dataList[0].Category);
//       if (dataList.Subcatagory) {
//         newProduct.tags.push(dataList[0].Subcatagory);
//       }
//       if (dataList.SubSub) {
//         newProduct.tags.push(dataList[0].SubSub);
//       }

//       newProduct.metafields_global_description_tag =
//         newProduct.metafields_global_description_tag +
//         ' ' +
//         dataList[0].Category +
//         ' at Carsha. ' +
//         dataList[0].Category +
//         ' Wholesale Available.';

//       const checkString = (parent, child) => {
//         return parent.toUpperCase().includes(child.toUpperCase());
//       };

//       for (let i = 0; i < dataList.length; i++) {
//         if (
//           checkString(dataList[i].Row, 'size') ||
//           checkString(dataList[i].Row, 'weight')
//         ) {
//           productSize = dataList[i].Description;

//           // console.log('productSize ' + productSize);
//           const newSize = Number(
//             productSize.replace(/\D/g, '').substring(0, 4)
//           );
//           newProduct.variants[0].weight = newSize || 800;
//         }
//         if (checkString(dataList[i].Row, 'how to use')) {
//           const plagiarismRemoveConfig = {
//             method: 'POST',
//             url: 'https://api.copymatic.ai/',
//             headers: {
//               Authorization: 'Bearer 097be6ad1d84ed50306d6f6df',
//               'Content-Type': 'application/json',
//             },
//             data: {
//               model: 'sentence-rewriter',
//               tone: 'professional',
//               creativity: 'regular',
//               sentence: dataList[i].Description,
//               language: 'English (US)',
//               n: '1',
//             },
//           };
//           const plagiarismRemoveRes = await axios(plagiarismRemoveConfig);
//           console.log('how to use: removed plagiarism');
//           productUsage = plagiarismRemoveRes.data.ideas['1'];
//           console.log(productUsage);
//         }
//         if (
//           checkString(dataList[i].Row, 'ingredient') ||
//           checkString(dataList[i].Row, 'element')
//         ) {
//           productIngredient = dataList[i].Description;
//         }
//         if (
//           checkString(dataList[i].Row, 'nation') ||
//           checkString(dataList[i].Row, 'country') ||
//           checkString(dataList[i].Row, 'made in')
//         ) {
//           productMadeIn = dataList[i].Description;
//         }
//       }

//       const getYandexScrapInfoConfig = {
//         method: 'get',
//         url: 'https://advancedapi.bazhuayu.com/api/notexportdata/gettop?taskId=a57a8f08-fa1f-b908-7045-13d7fefcb0f0&size=16',
//         headers: bazhuayuHeaders,
//       };

//       for (let i = 0; i < 300; i++) {
//         const getYandexScrapInfoResponse = await axios(
//           getYandexScrapInfoConfig
//         );
//         if (
//           getYandexScrapInfoResponse.data.data.total === undefined ||
//           getYandexScrapInfoResponse.data.data.total === 0
//         ) {
//           await new Promise((resolve) => setTimeout(resolve, 3000));
//           console.log(`waiting get Yandex Scrap Info... ${i} times`);
//           continue;
//         } else {
//           return getYandexScrapInfoResponse;
//         }
//       }
//     })
//     .then(async (response) => {
//       // console.log(response.data);
//       const yandexResult = response.data.data;
//       const { total, dataList } = yandexResult;
//       console.log(`${total} yandex results found`);
//       var productDescription = [];

//       for (let i = 0; i < dataList.length; i++) {
//         const content = dataList[i].Content;
//         if (!wordExclude.some((el) => content.includes(el))) {
//           productDescription.push(content);
//         }
//       }
//       console.log(productDescription);
//       const plagiarismRemoveReses = [];
//       for (let j = 0; j < productDescription.length; j++) {
//         const plagiarismRemoveConfig = {
//           method: 'POST',
//           url: 'https://api.copymatic.ai/',
//           headers: {
//             Authorization: 'Bearer 097be6ad1d84ed50306d6f6df',
//             'Content-Type': 'application/json',
//           },
//           data: {
//             model: 'sentence-rewriter',
//             tone: 'professional',
//             creativity: 'regular',
//             sentence: productDescription[j],
//             language: 'English (US)',
//             n: '1',
//           },
//         };
//         const plagiarismRemoveRes = await axios(plagiarismRemoveConfig);
//         plagiarismRemoveReses.push(plagiarismRemoveRes);
//       }

//       return Promise.all(plagiarismRemoveReses);
//     })
//     .then((response) => {
//       console.log('plagiarism Removed');
//       for (let i = 0; i < response.length; i++) {
//         console.log(response[i].data.ideas['1']);
//         plagiarismDescription += response[i].data.ideas['1'] + '<br>';
//       }

//       const encodedUrl = encodeURI(
//         bazhuayuProducts[j].Brand + ' ' + bazhuayuProducts[j].ProductName
//       );
//       const imageSearchConfig = {
//         method: 'get',
//         url: `https://bing-image-search1.p.rapidapi.com/images/search?q=${encodedUrl}&count=5`,
//         headers: {
//           'X-RapidAPI-Key':
//             '8952a7c98amsh0084e031a1939e5p10e702jsn7d79f8860c5a',
//           'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com',
//         },
//       };
//       return axios(imageSearchConfig);
//     })
//     .then((response) => {
//       console.log('image searched');
//       console.log(response.data.value.length + ' images found');

//       const imagesFound = response.data.value;
//       const imagesFiltered = [];

//       for (let i = 0; i < imagesFound.length; i++) {
//         const imageRatio = imagesFound[i].width / imagesFound[i].height;
//         if (imageRatio > 0.9 && imageRatio < 1.1) {
//           imagesFiltered.push(imagesFound[i]);
//         }
//       }
//       console.log(`${imagesFiltered.length} images filtered`);
//       var imageSelected = imagesFiltered[0];
//       if (imagesFiltered.length > 0) {
//         for (let j = 0; j < imagesFiltered.length; j++) {
//           if (imagesFiltered[j].width > imageSelected.width) {
//             imageSelected = imagesFiltered[j];
//           }
//         }
//         console.log('image selected');
//         console.log('selected image url');
//         console.log(imageSelected.contentUrl);
//       } else {
//         console.log('no images found with ratio between 0.9 and 1.1');
//       }
//       newProduct.images = [{ src: imageSelected.contentUrl, position: 1 }];

//       newProduct.body_html = `<h4> Description </h4>
//         <p>${plagiarismDescription}</p>
//         <h4>Ingredients </h4>
//         <p>${productIngredient}</p>
//         <h4>How To Use</h4>
//         <p>${productUsage}</p>
//         <h4>Product Details </h4>
//         <p>Made In: ${productMadeIn}</p>
//         <p>Size: ${productSize}</p>
//         <p>Lead Time: 3-14 days</p>`;

//       const postProductConfig = 'carsha';
//       return axios(postProductConfig);
//     })
//     .then(() => {
//       console.log('new product posted');
//       // console.log(response);
//       console.log('new Product');
//       console.log(newProduct);

//       return new Promise((resolve) => setTimeout(resolve, 100));
//     })
//     .catch((error) => {
//       console.log('end of create single product error');
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//       } else if (error.request) {
//         // The request was made but no response was received
//         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//         // http.ClientRequest in node.js
//         console.log(error.request);
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.log('Error', error.message);
//       }
//       console.log('error config', error.config);
//     })
//     .finally(async () => {
//       const deleteShillaScrapConfig = {
//         method: 'post',
//         url: 'https://advancedapi.bazhuayu.com/api/task/RemoveDataByTaskId?taskId=dec02c17-a284-d2f2-ce09-e484b4f85066',
//         headers: bazhuayuHeaders,
//       };

//       const deleteShilla = await axios(deleteShillaScrapConfig);
//       console.log(`delete Shilla Scrap status ${deleteShilla.status}`);
//       const deleteYandexScrapInfo = {
//         method: 'post',
//         url: 'https://advancedapi.bazhuayu.com/api/task/RemoveDataByTaskId?taskId=a57a8f08-fa1f-b908-7045-13d7fefcb0f0',
//         headers: bazhuayuHeaders,
//       };
//       const deleteYandex = await axios(deleteYandexScrapInfo);
//       console.log(`delete yandex Scrap status ${deleteYandex.status}`);
//       const markTaskExportedConfig = {
//         method: 'post',
//         url: 'https://openapi.bazhuayu.com/data/markexported',
//         headers: bazhuayuHeaders,
//         data: {
//           taskId: 'f4474027-b4cf-4752-86ea-07c2dc47810d',
//         },
//       };
//       console.log('end of create single product success');
//       return axios(markTaskExportedConfig);
//     });
// };
