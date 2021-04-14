const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const managerRoutes = require('./routes/manager');
const adminRoutes = require('./routes/admin');
const cookRoutes = require('./routes/cook');
const waiterRoutes = require('./routes/waiter');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const ingredientRoutes = require('./routes/ingredients');
const subcategoryRoutes = require('./routes/mincategory');
const allRoutes = require('./routes/all');
const categoryRoutes = require('./routes/category');
const app = express();

const upload = multer({
  dest:'images'
})
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      return cb (null,`${file.fieldname}_${Date.now()}${file.originalname}`)
      // cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
// const img = upload.single('imageUrl')
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); 
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('imageUrl'));
  app.use('/images', express.static(path.join(__dirname, 'images')));
  
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/images',express.static(path.join(__dirname,'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/manage',managerRoutes);
app.use('/admin',adminRoutes);
app.use('/cook',cookRoutes);
app.use('/waiter',waiterRoutes);
app.use('/cart',cartRoutes);
app.use('/order',orderRoutes);
app.use('/ingredient',ingredientRoutes);
app.use('/subcategory',subcategoryRoutes);
app.use('/all',allRoutes);
app.use('/category',categoryRoutes);


mongoose.connect('mongodb+srv://mauvais:Mauvais7212@cluster0.gbicb.mongodb.net/myProject?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true },)
.then(result =>{
    app.listen(8080);
})
.catch(err=>console.log(err))
