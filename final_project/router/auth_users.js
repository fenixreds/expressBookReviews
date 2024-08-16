const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename=users.filter((user)=>{
    return user.username===username;
  });

  if(userswithsamename.length>0){
    return true;
  }else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers=users.filter((user)=>{
    return(user.username===username && user.password===password);
  })

  if(validusers.length>0){
    return true;
  }else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username=req.body.username;
  const password=req.body.password;

  if(!username||!password){
    return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username,password)){
    let accessToken=jwt.sign({
      data: password
    },'access', {expiresIn:3600});

    req.session.authorization={
      accessToken, username
    }
    return res.status(200).send("User successfully logged in")
  }
  else{
    return res.status(208).json({message: "invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const review=req.body.review;

  const book=books[isbn]
  const user=req.session.authorization.username;
  

  // const findUserReview=(username)=>{
  //   for (let index = 1; index < Object.keys(books).length+1; index++) {
  //     const book = books[index];
      
      
  //     if(book.reviews[username]){
  //       return true;
  //     }else{
  //       return false;
  //     }
  //   }
  // }
 
  if(book){
    if(review){

        book["reviews"][user]=review;
        books[isbn]=book;
        //console.log(books[isbn]);
        return res.send("Review added successfully");        
    }
    else{
      res.send("Complete the field review")
    }
 
  }
  else{
    res.send("Unable to find book!");
  }

  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const book=books[isbn]
  const user=req.session.authorization.username;

  if(book){
    if(book["reviews"][user]){
      delete books[isbn]["reviews"][user];
      console.log(books[isbn]["reviews"]);
      
      return res.send("Review was deleted successfully");
    }
    else{
      return res.send("Unable to find the review")
    }

  }
  else{
    return res.send("Unable to find book!");
  }
  

}) 

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
