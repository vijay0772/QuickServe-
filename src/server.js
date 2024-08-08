const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = 3003;

// Directly specifying MongoDB URI and JWT Secret
const MONGODB_URI = "mongodb://localhost:27017/QuickServe";
const JWT_SECRET = "vijay123";  // Ensure this secret remains consistent across the application lifecycle

// Security Enhancements
app.use(helmet());
app.use(cors());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Error connecting to MongoDB:", err));

// Define user schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  persona: { type: String, required: true } // Adding persona to the schema
}, { collection: 'users' }); // Explicitly specify the collection name

const User = mongoose.model("User", userSchema);

app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password, persona } = req.body; // Change from 'name' to 'username'
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name: username, // Correctly map 'username' from the request to 'name' in the database
        email,
        password: hashedPassword,
        persona
      });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Failed to register user." });
    }
  });
  

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign({ userId: user._id, persona: user.persona, username: user.name }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token, userId: user._id, persona: user.persona, username: user.name });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

app.get("/api/user-info", async (req, res) => {
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new Error("No token provided");

      const token = authHeader.split(' ')[1];
      console.log("Token received for verification:", token);
      
      console.log("Using JWT_SECRET for verification:", JWT_SECRET);
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded token:", decoded);

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json({ name: user.name, email: user.email, persona: user.persona });
  } catch (error) {
      console.error("Error fetching user info:", error);
      if (error instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({ message: "Invalid Token", error: error.message });
      }
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Additional Route to fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from the results
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update user details
app.patch("/api/users/:id", async (req, res) => {
  try {
    const { name, email, persona, isActive } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email, persona, isActive }, { new: true }).select('-password');
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete a user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
