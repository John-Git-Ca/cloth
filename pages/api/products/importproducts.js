// import nc from 'next-connect';
// import multer from 'multer';
// import path from 'path';
// import xlsx from 'xlsx';
// import db from '../../../utils/db';
// import Product from '../../../models/Product';

// const handler = nc();

// const storage = multer.diskStorage({
//   destination: './public/uploads/',
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const checkFileType = (file, cb) => {
//   if (
//     file.originalname.includes('.xlsx') ||
//     file.originalname.include('.xls')
//   ) {
//     console.log('file extension match');
//     return cb(null, true);
//   } else {
//     console.log('file extension not match');
//     cb('Upload images only!');
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   },
// });

// handler.use(upload.single('products'));

// const products = [];

// const importFromFile = (req) => {
//   const spreadsheet = xlsx.readFile(`./public/uploads/${req.file.filename}`);
//   const sheets = spreadsheet.SheetNames;
//   const sheet = spreadsheet.Sheets[sheets[0]];
//   let i = 2;
//   let excelRowsObjArr = xlsx.utils.sheet_to_row_object_array(sheet);
//   console.log(excelRowsObjArr.length);
//   console.log(sheet['A' + i].v);
//   while (i <= excelRowsObjArr.length) {
//     const product = {
//       name: sheet['A' + i].v,
//       slug: sheet['B' + i].v,
//       images: [
//         sheet['C' + i].v,
//         sheet['D' + i].v,
//         sheet['E' + i].v,
//         sheet['F' + i].v,
//         sheet['G' + i].v,
//       ],
//       brand: sheet['H' + i].v,
//       category: sheet['I' + i].v,
//       description: sheet['J' + i].v,
//       price: sheet['K' + i].v,
//       countInStock: sheet['L' + i].v,
//     };
//     if (product.name) {
//       products.push(product);
//     }
//     i++;
//   }
//   console.log('while loop end');
// };
// handler.post(async (req, res) => {
//   importFromFile(req);
//   console.log('heir?e');
//   await db.connectDB();
//   await Product.insertMany(products);
//   //   await db.disconnectDB();
//   console.log(products.length);
//   res.send(req.file);
// });

// export default handler;
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
