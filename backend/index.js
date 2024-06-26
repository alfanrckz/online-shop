const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8080;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose
  .connect(
    "mongodb+srv://alfansyuriziaulhaq11:VSUE1NQkctB1XXPh@cluster0.kgdvpxi.mongodb.net/e-commerce-project"
  )
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to mongoDB", err);
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//endpoint register

const User = require("./models/user");
const Order = require("./models/order");

const sendVerificationEmail = async (email, verificationToken) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure the email service or SMTP details here
    service: "gmail",
    auth: {
      user: "alfandevv11@gmail.com",
      pass: "Alfan2911",
    },
  });

  // Compose the email message
  const mailOptions = {
    from: "amazon.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://http://192.168.18.87:8081/verify/${verificationToken}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

//   try {
//     const { name, email, password } = req.body;

//     //check if email already resgistered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     //create new user
//     const newUser = new User({ name, email, password });
//     //generate and store the verification token
//     newUser.verificationToken = crypto.randomBytes(20).toString("hex");

//     //save the user to the database
//     await newUser.save();
//     // console.log("new user created", newUser);
//     res.status(201).json({ message: "Registration successful" });
//     //send verification email to the user
//     sendVerificationEmail(newUser.email, newUser.verificationToken);
//   } catch (error) {
//     console.log("error registering user", error);
//     res.status(500).json({ message: "Registration failed" });
//   }
// });

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered:", email); // Debugging statement
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });

    // Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the user to the database
    await newUser.save();

    // Debugging statement to verify data
    console.log("New User Registered:", newUser);

    // Send verification email to the user
    // Use your preferred email service or library to send the email
    // sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({
      message:
        "Registration successful. Please check your email for verification.",
    });
  } catch (error) {
    console.log("Error during registration:", error); // Debugging statement
    res.status(500).json({ message: "Registration failed" });
  }
});

//endpoint to verification email

// app.get("/verify/:token", async (req, res) => {
//   try {
//     const token = req.params.token;

//     //Find the user witht the given verification token
//     const user = await User.findOne({ verificationToken: token });
//     console.log(token)
//     if (!user) {
//       return res.status(404).json({ message: "Invalid verification token" });
//     }

//     //Mark the user as verified
//     user.verified = true;
//     user.verificationToken = undefined;

//     await user.save();

//     res.status(200).json({ message: "Email verified successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Email Verificatioion Failed" });
//   }
// });

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();
//endpoint login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user is exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //check if password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //generate a token
    const token = jwt.sign({ userId: user._id }, secretKey);
    console.log(token);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
    console.log(error);
  }
});

//endpoint to add new address to the backend

app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;
    console.log(userId, address);
    //find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //add the new address to the user's addresses array
    user.addresses.push(address);
    //save the updated user in the backend
    await user.save();
    res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
});

//endpoint to get all the addressses of a particular user
app.get("/addresses/:userId", async (req, res) => {
  try {
    const  userId  = req.params.userId;
    console.log(userId)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the addresses" });
  }
});

//endpoint to store all the order

app.post("/orders", async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //create an array of product objects from the cart items
    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item?.quantity,
      price: item.price,
      image: item.image,
    }));
    //create a new order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    })
    await order.save()
    res.status(200).json({ message: "Order created successfully" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
});

//get the user profile

app.get("/profile/:userId", async(req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if(!user){
    return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the profile" });
  }
})

app.get("/orders/:userId", async(req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId }).populate("user");
    if(!orders || orders.length === 0){
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json({orders})
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error retrieving the orders" });
  }
})