//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//Step-1.1 : install mongoose and require it in your app.js
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

/*Step-1 : Save Composed Posts with MongoDB - You should be able to go to the compose page and 
add a new post which will be added to your database as a new document.*/

//Step-1.2 : connect to a new database called blogDB
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

//Step-1.3 :  create a new postSchema that contains a title and content
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

//Step-1.4 : create a new mongoose model using the schema to define your posts collection
const Post = mongoose.model("Post", postSchema);

/* After delting "let posts = [];"" array replace this with step-2 
Step-2 : Get the Home Page to Render the Posts 
- When you go to localhost:3000,you should see the posts you created in the compose page. 
- To find all the posts in the posts collection and render that in the home.ejs file */

app.get("/", function(req, res){
  Post.find({})
  .then(function(posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })
  .catch(function(err){
    console.log(err);
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  /*Step-1.5 : Inside the app.post() method for your "/compose" route, 
  create a new post document using your mongoose model. */
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  /* Step-1.5 : post.save() method to save the document to the database instead of 
  "posts.push(post)" - pushing to the posts array 

  Step-3 : Fix the bug - Add a callback to the save method to only redirect to the home page 
  once save is complete with no errors. */

  post.save()
  .then(function(){
      res.redirect("/");
  })
  .catch(function(err){
    console.log(err);
  });
});

/*Step-4 : Render the correct blog post based on post _id - When you click on Read More, 
it should take you to the post.ejs page rendering the correct post using the post._id 

Step-4.1 : In the app.post() method for the "/post" route, change the express route parameter 
to postId instead of post name. */

app.get("/posts/:postId", function(req, res){

  //Step-4.2 : a constant to store the postId parameter value
  const requestedPostId = req.params.postId;

  /* Step-4.3: Instead of this forEach method, use below findOne() method
  posts.forEach(function(post){
    const storedTitle  = _.lowerCase(post.title);
    if (requestedTitle === storedTitle){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

  Step-4.3 : findOne() method to find the post with a matching id in the posts collection. 
  Once a matching post is found, you can render its title and content in the post.ejs page */

  Post.findOne({_id: requestedPostId})
  .then(function(post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  })
  .catch(function(err){
    console.log(err);
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
