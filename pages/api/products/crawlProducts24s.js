import axios from 'axios';
import nc from 'next-connect';
import Product from '../../../models/Product';
import { isAdmin, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
// import { encryptImage } from './downloadImage';
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const handler = nc();
handler.use(isAuth);
handler.use(isAdmin);

handler.get(async (req, res) => {
  console.log('crawing products...');
  //   const category = req.query.category;
  console.log(req.query);
  //   const page = req.query.page;
  for (let ppage = 20; ppage < 30; ppage++) {
    for (let cc = 0; cc < 1; cc++) {
      console.log(`Carwling....Catetory:${cc}, page:${ppage}`);
      await crawProducts(cc, ppage);
    }
  }
  res.send({ message: 'products success imported' });
});

export default handler;

const productCategory = ['Bags', 'Shoes', 'Clothes'];
const crawUrls = [
  process.env.CRAW_BAG_URL,
  process.env.CRAW_SHOE_URL,
  process.env.CRAW_CLOTHES_URL,
];

const crawProducts = async (category, page) => {
  const targetUrl = crawUrls[category] + `&page=${page}`;
  const crawConfig = {
    method: 'get',
    url: targetUrl,
  };
  return axios(crawConfig)
    .then(async (response) => {
      const newProducts = [];
      const crawBagHtml = response.data;
      console.log('crawl products: before cheerio');
      const $ = cheerio.load(crawBagHtml);
      console.log('crawl products: after cheerio');
      $('.product_wrapper-products__mjxlx').each((index, element) => {
        let newProduct = {};
        if (category === 2) {
          newProduct.price = 750;
        } else {
          newProduct.price = 500;
        }
        newProduct.productUrl =
          process.env.CRAW_DOMAIN_NAME +
          $(element).children('.product_btn__QSoXG').attr('href');

        newProduct.brand = $(element)
          .children('.product_btn__QSoXG')
          .children('.product_brand__LChRs')
          .text();
        newProduct.title = $(element)
          .children('.product_btn__QSoXG')
          .children('.product_product-title__7pfDK')
          .text();

        newProducts.push(newProduct);
      });
      //   console.log(newProducts);
      console.log(newProducts.length + ' products found');
      for (let i = 0; i < newProducts.length; i++) {
        const currentProduct = newProducts[i];
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`\nCrawling ${i} th products`);
        await crawlProductDetails(currentProduct, category);
      }
    })
    .catch((error) => {
      console.log('end of create single product error');
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log('error config', error.config);
    });
};

const crawlProductDetails = async (currentProduct, category) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await page.goto(currentProduct.productUrl);

    // const tempLink = await page.evaluate(() => {
    //   let temp = document
    //     .querySelector('.slick-slide.slick-active.slick-current')
    //     .getAttribute('aria-hidden');
    //   return temp;
    // });
    // console.log('tempLink');
    // console.log(tempLink);
    // const imageBtn = page.$$(
    //   '.slick-slide.slick-active.slick-current div picture source'
    // );
    // const imageBtn = page.waitForSelector(
    //   '.slick-slide.slick-active.slick-current div picture source'
    // );

    //remove cookies pop up
    await page.waitForSelector('#onetrust-accept-btn-handler');
    // await page.screenshot({ path: 'screen1.png' });
    await page.click('#onetrust-accept-btn-handler');
    await page.click('.slick-slide.slick-active.slick-current');
    await new Promise((resolve) => setTimeout(resolve, 500));
    // await page.screenshot({ path: 'screen2.png' });
    await page.click('.slick-slide.slick-active.slick-current');
    await new Promise((resolve) => setTimeout(resolve, 500));
    // await page.screenshot({ path: 'screen3.png' });

    await page.waitForSelector('.zoomable-image');
    // await page.screenshot({ path: 'screen4.png' });

    const images = await page.evaluate(() => {
      let elements = Array.from(document.querySelectorAll('.zoomable-image'));
      let links = elements.map((element) => {
        return element.getAttribute('src');
      });
      return links;
    });
    // console.log('images');
    // console.log(images);

    // const encryptedImages = [];
    // for (let i = 0; i < 6; i++) {
    //   if (images[i]) {
    //     const encryptedImage = await encryptImage(images[i]);
    //     encryptedImages.push(encryptedImage);
    //   }
    // }

    //get first 6 images because some image duplicate
    currentProduct.images = images.slice(0, 6);
    browser.close();
    // return;
  } catch (error) {
    return error;
  }

  const productDetailConfig = {
    method: 'get',
    url: currentProduct.productUrl,
  };
  return axios(productDetailConfig)
    .then(async (response) => {
      const productDetailHtml = response.data;
      const $ = cheerio.load(productDetailHtml);
      currentProduct.details = {};
      $('.accordion-text:first')
        .children('ul')
        .children('li')
        .each((index, element) => {
          const key =
            $(element)
              .children('.accordion-list-item-title')
              .text()
              .trim()
              .replace(/\W/g, '_') || 'default';
          const value =
            $(element).children('.accordion-list-item-text').text() ||
            $(element).text();
          if (key) currentProduct.details[key] = value;
        });

      currentProduct.slug = $('.accordion-list-item-text-book')
        .text()
        .split(' ')
        .pop();

      currentProduct.description = $('blockquote').text();

      //   console.log('slick vertical');
      //   $('.slick-track').each((index, element) => {
      //     if (index === 0) {
      //       const img = $(element).find('img').attr('src');
      //       if (img) {
      //         currentProduct.images.push(img);
      //       }
      //     }
      //   });

      //   console.log('picture');
      //   $('picture').each((index, element) => {
      //     const img = $(element).children('img').attr('src');
      //     console.log(index);
      //     console.log(img);
      //   });

      //   console.log('slick active');
      //   $('.slick-slide').each((index, element) => {
      //     console.log(index);
      //     const img = $(element)
      //       .children('div')
      //       .children('picture')
      //       .children('source')
      //       .attr('srcset');
      //     console.log(img);
      //     if (img) {
      //       currentProduct.images.push(img);
      //     }
      //   });

      // $('.slick-slider.slick-vertical.slick-initialized')
      //   .children('.slick-list')
      //   .children('.slick-track')
      //   .children('div')
      //   .each((index, element) => {
      //     // let img = $(element)
      //     //   .children('div')
      //     //   .children('picture')
      //     //   .children('img')
      //     //   .attr('src');

      //     let img = $(element).find('img').attr('src');

      //     if (img) {
      //       currentProduct.images.push(img);
      //     }
      //   });

      //search product on my website
      await db.connectDB();
      //   const findResult = await Product.find({ slug: currentProduct.slug });

      console.log('connected db now...');
      const findResult = { length: 0 };
      //   console.log(currentProduct);
      if (findResult.length === 0) {
        console.log('product does not exist');
        const insertProduct = new Product({
          name: currentProduct.brand + ' ' + currentProduct.title,
          slug: currentProduct.slug,
          brand: currentProduct.brand,
          category: productCategory[category],
          countInStock: Math.floor(Math.random() * 100 + 10),
          price: currentProduct.price,
          images: currentProduct.images,
          description: currentProduct.description || 'See Product Details',
          details: currentProduct.details,
          productUrl: currentProduct.productUrl,
        });
        await insertProduct.save();
        console.log('Another product posted...');
        // const insertProductResult = await insertProduct.save();
        // console.log(insertProductResult);
        return 'success';
      } else {
        console.log('product exists');
        // console.log(findResult);
      }

      //   await db.disconnectDB();
    })
    .catch((error) => {
      console.log('end of create single product error');
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log('error config', error.config);
    });
};
