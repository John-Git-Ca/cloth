import axios from 'axios';
// const handler = nc();

const encryptImage = async (url) => {
  return axios
    .get(url, {
      responseType: 'arraybuffer',
    })
    .then((response) => {
      console.log(response.data);
      //   return Buffer.from(response.data).toString('base64');
      return (
        'data:' +
        response.headers['content-type'] +
        ';base64,' +
        Buffer.from(response.data, 'binary').toString('base64')
      );
    });
};

export { encryptImage };

// const plantImages = async () => {
//   const products = await Product.find({});
//   console.log(`product quantity: ${products.length}`);
//   for (let j = 0; j < products.length - 345; j++) {
//     let buffers = [];
//     let tempSlug = '';
//     for (let i = 0; i < products[j].images.length; i++) {
//       tempSlug = products[j].slug;
//       const buffer = await encryptImage(products[j].images[0]);
//       buffers.push({ data: buffer, contentType: 'image/jpeg' });
//     }
//     console.log(tempSlug);
//     const newImage = new Images({
//       slug: tempSlug,
//       images: buffers,
//     });
//     await newImage.save();
//   }
//   console.log('res');
// };

// handler.get(async (req, res) => {
//   console.log('handling image');
//   await db.connectDB();
//   const buffer = await encryptImage(
//     'https://img.zolaprod.babsta.net/Gsam3kB50JSn42NIo0egc1nidvM=/fit-in/375x395/ffdf9812996343bb9a9f64ea1a374894'
//   );
//   console.log(buffer);
//   //   const image = await Images.findById('63bdd39579186877f3fc23c8');
//   //   await plantImages();
//   //   console.log('image');
//   //   console.log(image);
//   res.send(buffer);
// });

// export default handler;
