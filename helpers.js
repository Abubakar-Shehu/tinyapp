const bcrypt = require("bcryptjs");

// An helper function to help generate random alphanumeric string that is 6 characters long. Returns a string.
const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';

  for (let i = 0; i < 6; i++) {
    str += characters.charAt(Math.floor(Math.random() * characters.length));
  };

  return str;
};

// An helper function to help verify a users email is in the database. Returns a boolean.
const getUserByEmail = (email, database) => {
  for (const userId in database) {
    if (database[userId].email === email)  {
      return database[userId];
    }
  }
  return false;
};

// An helper function to help verify if a users email and password are already in the database. Returns the user object if true and a false boolean if not.
const duplicateUser = (email, password, database) => {
  for (const userId in database) {
    if (database[userId].email === email && bcrypt.compareSync(password, database[userId].password)) {
      return database[userId];
    }
  }
  return false;
};

// An helper function that checks if a user is authorised to view urls by verifying if they were the ones who created it. Returns an object.
const urlsForUser = (user_id, database) => {
  let returnedObjects = {};
  for (const addedURL in database) {
    if(database[addedURL].userID === user_id) {
      returnedObjects[addedURL] = database[addedURL];
    }
  }
  return returnedObjects;
};


module.exports = { getUserByEmail, duplicateUser, urlsForUser, generateRandomString };