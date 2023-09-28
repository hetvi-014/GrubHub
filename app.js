const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./model/user.js");
const Product = require("./model/product.js");

const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

//for connecting to database
mongoose.connect("mongodb://localhost:27017/grub-hub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//mongoose.set("useFindAndModify", false);

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Define routes for index.html, login.html, and register.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});
// Define your routes here
app.get("/products/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the product in the database by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new product
app.post("/products/add", async (req, res) => {
  console.log("add req recived" + req.body);
  try {
    console.log(req.body)
    const product = new Product(req.body);
    await product.save();
    console.log("product saved sucessfully");
    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding product", error });
  }
});

app.put("/products/edit/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating product", error });
  }
});

// Remove a product by ID
app.delete("/products/remove/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndRemove(productId);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error removing product", error });
  }
});

// Get a list of all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error retrieving products", error });
  }
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
// Registration route
app.post("/register", async (req, res) => {
  console.log("request Recieved Register");
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    console.log(`user ${username} saved`);
    res.redirect(`/login`);
  } catch (error) {
    console.log("error registering user");
    res.status(500).send("Error registering user");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("request Recieved Login");

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send("<h1>Invalid username or password</h1>");
  }

  req.session.user = user;
  res.redirect("/dashboard");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
