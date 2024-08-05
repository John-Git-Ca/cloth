import nc from 'next-connect';
import multer from 'multer';
import path from 'path';
import { isAuth } from '../../../utils/auth';

const handler = nc();
handler.use(isAuth);
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Upload images only!');
  }
};

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

handler.use(upload.array('images'));

handler.post((req, res) => {
  const imagePath = req.files.map((file) => {
    return `${file.path}`.replace(/\\/g, '/').substring(6);
  });
  res.send(imagePath);
});

export default handler;
export const config = {
  api: {
    bodyParser: false,
  },
};
