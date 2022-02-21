
const multer = require('multer')
const util = require('util');



const storage = multer.diskStorage({
  //destinarion for files
  destination: function (request, file, callback) {
    callback(null, 'public/uploads/images');
  },

  //add back the extension
  filename: function(request, file, callback){
    callback(null, Date.now() + "Ethirek");
    
  }, 
})

// var uploadFiles = multer({ storage: storage }).array("images", 6);
var upload = multer({ storage: storage });
var uploadFiles = upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 6 }])

console.log(uploadFiles)
var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;
