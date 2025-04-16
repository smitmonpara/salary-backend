const fs = require("fs");
const multer = require("multer");
const { ApiError } = require("../utils/api_error");

function uploader(
    folderPath,
    fileName,
    mimetype,
    mimeTypeErrorMsg
) {
    const fileFilter = (_req, file, callback) => {
        if (mimetype.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new ApiError(400, mimeTypeErrorMsg), false);
        }
    }
    const storage = multer.diskStorage({
        destination(_req, _file, callback) {
            const path = folderPath;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }
            callback(null, path);
        },
        filename(_req, file, callback) {
            const fileNameGenerated = fileName(file);
            callback(null, fileNameGenerated);
        },
    });
    return multer({ storage, fileFilter });
}

const imageFolderPath = "./public";
const imageGenerateFileName = (file) => {
    return `${Date.now()}-${file.originalname}`;
};
const imageMimetype = ["image/jpg", "image/jpeg", "image/png"];
const imageMimetypeErrorMsg = "Image uploaded is not of type jpg/jpeg or png";

const imageUploader = uploader(imageFolderPath, imageGenerateFileName, imageMimetype, imageMimetypeErrorMsg);

function deleteFile(files) {
    if (!files) return;
    if (Array.isArray(files)) {
        for (const file of files) {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        }
        return;
    }
    if (fs.existsSync(files)) {
        fs.unlinkSync(files);
    }
}

module.exports = {
    imageUploader,
    deleteFile,
}
