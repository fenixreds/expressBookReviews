const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}


public_users.post("/register", (req,res) => {
  const username=req.body.username;
  const password=req.body.password;

  if(username&&password){
    if(!doesExist(username)){
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "User successfully registered"});
    }else{
      return res.status(404).json({message: "User already exists!"});
    }
  }else{
    return res.status(404).json({message: "You must complete username and password."})
  }
});

// Get the book list available in the shop
public_users.get('/', async(req, res)=> {
  const response=await(JSON.stringify(books,null,4))
  res.send(response);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res)=> {
  const isbn=req.params.isbn;
  const response=await books[isbn]
  res.send(response)
  
 });
  
// Get book details based on author
public_users.get('/author/:author', async(req, res)=> {
  const author=req.params.author;

  async function procesar(index) {
    const book = books[index];
      
      if(book.author===author){
       return res.send(book);
      }
  }


    for (let index = 1; index < Object.keys(books).length+1; index++) {
       await procesar(index);
    } 

  
});

// Get all books based on title
public_users.get('/title/:title',async (req, res)=> {
  const title=req.params.title;

  async function procesar(index) {
    const book = books[index];

    if(book.title===title){
      return res.send(book)
    }
  }

  for (let index = 1; index < Object.keys(books).length+1; index++) {
    await procesar(index);
    
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
