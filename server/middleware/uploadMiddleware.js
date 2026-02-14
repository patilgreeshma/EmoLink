import multer from 'multer';
import path from 'path';

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '/server/uploads/'));
    },
    filename(req, file, cb) {
        const name = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, name);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

export default upload;
