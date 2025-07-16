const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID, "They should equal")
  });
  it('the user it returns should have an email property', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedEmail = "user@example.com";
    assert.strictEqual(user.email, expectedEmail, "user with email is returned");
  });
});

// LLM tests

describe('urlsForUser', () => {
  const urlDatabase = {
    "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user123" },
    "9sm5xK": { longURL: "http://www.google.com", userId: "user456" },
    "7a5Kx2": { longURL: "http://www.example.com", userId: "user123" },
  };

  it('should return an empty object if the user has no URLs', () => {
    const result = urlsForUser("user789", urlDatabase);
    assert.deepEqual(result, {});
  });

  it('should return an empty object if the urlDatabase is empty', () => {
    const result = urlsForUser("user123", {});
    assert.deepEqual(result, {});
  });

  it('should not return URLs that do not belong to the specified user', () => {
    const result = urlsForUser("user456", urlDatabase);
    const notExpected = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user123" },
      "7a5Kx2": { longURL: "http://www.example.com", userId: "user123" },
    };
    Object.keys(notExpected).forEach(key => {
      assert.notProperty(result, key);
    });
  });
});