const express = require("express");
const app = express();
const port = 214;
const fs = require("fs");

app.use(express.json());

const data = fs.readFileSync("./users.json", "utf8");
const users = JSON.parse(data);
app.get("/", (req, res) => {
  res.send("<h1>Welcome To my First API</h1> /users - get all users <br>\n/users/first - get the first <br> user /users/last - get the last user <br> /users/by_id/:id - get user by ID <br> /users/bystreet/:street - get user by street <br> /users/add - add a new user <br> /users/delete/:id - delete user by ID <br> /users/update/:id - update user by ID");
});

// Filter get all users
app.get("/users", (req, res) => {
  res.send(users);
});
// Filter get first user
app.get("/users/first", (req, res) => {
  if (users.length > 0) {
    res.send(users[0]);
  } else {
    res.status(404).send("No users found");
  }
});
// Filter get last user
app.get("/users/last", (req, res) => {
  if (users.length > 0) {
    res.send(users[users.length - 1]);
  } else {
    res.status(404).send("No users found");
  }
});
// Filter users by name
app.get("/users/byname/:name", (req, res) => {
  const name = req.params.name;
  const user = users.find(
    (user) => user.name.toLowerCase() === name.toLowerCase()
  );
  if (user) {
    res.send(user);
  } else {
    res.status(404).send("User not found");
  }
});
app.get("/users/byusername/:username", (req, res) => {
  const username = req.params.username;
  const user = users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
  if (user) {
    res.send(user);
  } else {
    res.status(404).send("User not found");
  }
});

app.get("/users/bycity/:city", (req, res) => {
  const city = req.params.city;

  // Filter users by city
  const usersInCity = users.filter(
    (user) =>
      user.address && user.address.city.toLowerCase() === city.toLowerCase()
  );

  if (usersInCity.length > 0) {
    res.send(usersInCity);
  } else {
    res.status(404).send("No users found in this city");
  }
});
app.get("/users/bystreet/:street", (req, res) => {
  const street = req.params.street;

  // Filter users by street
  const usersOnStreet = users.filter(
    (user) =>
      user.address && user.address.street.toLowerCase() === street.toLowerCase()
  );

  if (usersOnStreet.length > 0) {
    res.send(usersOnStreet);
  } else {
    res.status(404).send("No users found on this street");
  }
});
// Filter users by id
app.get("/users/by_id/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((user) => user.id === userId);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send("User not found");
  }
});

app.post("/users/add", (req, res) => {
  const newUser = req.body;
  if (!newUser.id || !newUser.name || !newUser.username || !newUser.email) {
    res.status(400).send("Invalid user data");
    return;
  }
  users.push(newUser);
  fs.writeFileSync("./users.json", JSON.stringify(users));
  res.send({ success: true });
});

app.put("/users/update/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  const index = users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    fs.writeFileSync("./users.json", JSON.stringify(users));
    res.send({ success: true });
  } else {
    res.status(404).send("User not found");
  }
});

app.delete("/users/delete/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    users.splice(index, 1);
    fs.writeFileSync("./users.json", JSON.stringify(users));
    res.send({ success: true });
  } else {
    res.status(404).send("User not found");
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port} `);
});
