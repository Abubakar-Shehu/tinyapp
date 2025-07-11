const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

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
    // Write your assert statement here
    assert.strictEqual(user.id, expectedUserID, "They should equal")
  });
  it('the user it returns should have an email property', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedEmail = "user@example.com";
    assert.strictEqual(user.email, expectedEmail, "user with email is returned");
  });
});