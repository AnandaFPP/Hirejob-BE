const multer = require('multer')
const createError = require('http-errors')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/upload')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+'.png')
    }
  })
  
  const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
      const allowExtension = ['jpg', 'jpeg', 'png']
      const fileExtension = file.mimetype.split('/')[1]
      
      if (allowExtension.includes(fileExtension)) {
        return cb(null, true)
      } else {
        return cb(new createError(400, 'File only allow for jpg, jpeg or png!'), false)
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 2
    }
   })


  module.exports = upload