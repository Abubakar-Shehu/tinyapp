const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';

  for (let i = 0; i < 6; i++) {
    str += characters.charAt(Math.floor(Math.random() * characters.length));
  };

  return str;
};

const getUserByEmail = (email, database) => {
  for (const userId in database) {
    if (database[userId].email === email)  {
      return database[userId];
    }
  }
  return false;
};

const duplicateUser = (email, password, database) => {
  for (const userId in database) {
    if (database[userId].email === email && bcrypt.compareSync(password, database[userId].password)) {
      return database[userId];
    }
  }
  return false;
};

const urlsForUser = (user_id, database) => {
  let returnedObjects = {};
  for (const addedURL in database) {
    if(database[addedURL].userID === user_id) {
      returnedObjects[addedURL] = database[addedURL];
    }
  }
  return returnedObjects
};

module.exports = { getUserByEmail, duplicateUser, urlsForUser, generateRandomString }