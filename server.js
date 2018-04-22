//Express App setup 
const express = require('express');
const morgan =  require('morgan');
const blogPostsRouter = require('./blogPostsRouter');
const app = express();

//Log the http layer
app.use(morgan('common'));
//Blog-post Router 
app.use('/blog-posts', blogPostsRouter);

//Set up port 
app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});












