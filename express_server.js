
const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const bcrypt = require("bcryptjs");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ["I-am-a-beginner-spare-me-pls"],
  // Cookie Options
  maxAge: 300 * 1000 // 5 min
}))


// const urlDatabase = {
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
// };

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  // userRandomID: {
  //   id: "userRandomID",
  //   email: "user@example.com",
  //   password: "purple-monkey-dinosaur",
  // },
  // user2RandomID: {
  //   id: "user2RandomID",
  //   email: "user2@example.com",
  //   password: "dishwasher-funk",
  // },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  const registeredUsers = Object.keys(users)
  if (registeredUsers.includes(req.session.user_id)) {
    res.redirect("/urls");
  } else {
    const templateVars = { 
      user: users[req.session.user_id],
      error: ""
   };
    res.render("register", templateVars);
  }
});

app.post("/register", (req, res) => {
  const newUserID = generateRandomString();
  const { email, password } = req.body;

  if (email === '' || password === '') {
    return res.status(400).send('Email or password cannot be empty');
  } else if(duplicateUser(email, password)) {
    const templateVars = {
      user: users[req.session.user_id], 
      error: "Already have an account"
    };
    res.status(403).render("login", templateVars);
  } else if(duplicateEmail(email)) {
    const templateVars = {
      user: null, 
      error: "Email already in use"
    };
    res.status(403).render("register", templateVars);
  } else {
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[newUserID] = {
      id: newUserID,
      email: email,
      password: hashedPassword
    };
    console.log(users)
    res.cookie('user_id', newUserID);
    res.redirect("/urls");
  }
})

app.get("/login", (req, res) => {
  const registeredUsers = Object.keys(users)
  if (registeredUsers.includes(req.session.user_id)) {
    res.redirect("/urls");
  } else {
  const templateVars = { 
    user: users[req.session.user_id],
    error: ""
   };
  res.render("login", templateVars);
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const existingUser = duplicateUser(email, password);

  if(existingUser) {
    res.cookie('user_id', existingUser.id);
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: null, 
      error: "Login failed. Please check your email and password."
    };
    res.status(403).render("login", templateVars);
  }
});

app.get("/urls", (req, res) => {  
  const templateVars = { 
    urls: urlsForUser(req.session.user_id),
    user: users[req.session.user_id],
    error: ""
   };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const registeredUsers = Object.keys(users)
  if (!registeredUsers.includes(req.session.user_id)) {
    res.redirect("/login");
  } else {
  const templateVars = { 
    user: users[req.session.user_id],
   };
  res.render("urls_new", templateVars);
  }
});

app.post("/urls", (req, res) => {
  const registeredUsers = Object.keys(users)
  if (!registeredUsers.includes(req.session.user_id)) {
    const templateVars = {
      urls: urlDatabase,
      user: null, 
      error: "Cannot shorten URL as you are not logged in"
    };
    res.status(403).render("urls_index", templateVars);
  } else {
  let relatedID = generateRandomString();

  urlDatabase[relatedID] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  }
  res.redirect(`/urls/${relatedID}`);
  } 
});

app.get("/urls/:id", (req, res) => {
  const neededURL = req.params.id;
  // console.log(neededURL)
  // console.log(urlDatabase[neededURL].longURL)
  const templateVars = { 
    id: neededURL, 
    longURL: urlDatabase[neededURL].longURL, 
    user: users[req.session.user_id]
   };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortURLId = req.params.id;
  const longURL = urlDatabase[shortURLId];
  if (shortURLId){
    res.redirect(longURL);
  } else {
    res.status(400).send("This short URL does not exist");
  } 
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`); 
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';

  for (let i = 0; i < 6; i++) {
    str += characters.charAt(Math.floor(Math.random() * characters.length));
  };

  return str;
};

const duplicateEmail = (email) => {
  for (const userId in users) {
    if (users[userId].email === email)  {
      return true;
    }
  }
  return false;
}

const duplicateUser = (email, password) => {
  for (const userId in users) {
    if (users[userId].email === email && bcrypt.compareSync(password, users[userId].password)) {
      return users[userId];
    }
  }
  return false;
}

const urlsForUser = (user_id) => {
  let returnedObjects = {};
  for (const addedURL in urlDatabase) {
    if(urlDatabase[addedURL].userID === user_id) {
      returnedObjects[addedURL] = urlDatabase[addedURL];
    }
  }
  return returnedObjects
};