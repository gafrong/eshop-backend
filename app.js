const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


app.use(cors());
app.options('*', cors());

//Middlewear
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/uploads', express.static(__dirname + '/uploads'));

//Routes
const productsRoutes= require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');
const videosRoutes = require('./routes/videos');
const adminRoutes = require('./routes/admin/auth');
const videoCommentRoutes = require('./routes/video-comments');
const bookmarkRoutes = require('./routes/bookmark');

const api = process.env.API_URL;

//Routers
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/videos`, videosRoutes);
app.use(`${api}/admin`, adminRoutes);
app.use(`${api}/videocomments`, videoCommentRoutes);
app.use(`${api}/bookmarks`, bookmarkRoutes);


mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log('Database connection is ready...')
})
.catch((err)=>{
    console.log(err);
})

// Development
app.listen(process.env.PORT, ()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`);
})

// Production
// var server = app.listen(process.env.PORT || 3000, function() {
//     var port = server.address().port;
//     console.log("Express is working on port " + port)
// })