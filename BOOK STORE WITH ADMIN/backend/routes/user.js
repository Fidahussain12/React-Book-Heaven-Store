const router = require("express").Router();
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken }  = require("./userAuth");

//Sign Up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body

        //check username Length is more than 4
        if (username.length < 4) {
            return res
                .status(400)
                .json({ message: "Username Length should be greater than 3" });
        }

        // check username already exists?
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res
                .status(400)
                .json({ message: "Username already exists" });
        }

        // check email already exists?
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res
                .status(400)
                .json({ message: "Email already exists" });
        }

        //check password's length
        if (password.length <= 5) {
            return res
                .status(400)
                .json({ message: "Password's length should be greather than 5" });
        }

        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address || "",
        });
        await newUser.save();
        return res.status(200).json({ message: "SignUp Successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

//sign in
router.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body; // 

        const existingUser = await User.findOne({ email }); // 
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const authClaims = [
            { name: existingUser.username },
            { role: existingUser.role }, // 
        ];

        const token = jwt.sign({ authClaims }, "bookStore123", { expiresIn: "30d" });

        return res.status(200).json({
            id: existingUser._id,
            role: existingUser.role,
            token: token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//get-user-information
router.get("/get-user-information", authenticateToken, async (req, res) =>{
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
});

    //update address
router.put("/update-profile", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { username, email } = req.body;

    // check username length
    if (username && username.length < 4) {
      return res.status(400).json({ message: "Username must be greater than 3 characters" });
    }

    // check username already exists
    const existingUsername = await User.findOne({ username, _id: { $ne: id } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // check email already exists
    const existingEmail = await User.findOne({ email, _id: { $ne: id } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await User.findByIdAndUpdate(id, { username, email });
    return res.status(200).json({ message: "Profile updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
// Update password
router.put("/update-password", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // check new password length
    if (newPassword.length <= 5) {
      return res.status(400).json({ message: "Password length should be greater than 5" });
    }

    const hashPass = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashPass });

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router; 