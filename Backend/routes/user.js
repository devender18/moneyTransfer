const { Router, response } = require("express");
const router = Router();
const { signup, signin, updateUser } = require("../type");
const mongoose = require("mongoose");
const JWT_Password = require("../config");
const jwt = require("jsonwebtoken");
const { User, Account } = require("./../db/db");
const authMiddleware = require("../middleware");

// signup route
router.post("/signup", async (req, res) => {
  const response = signup.safeParse(req.body);

  if (!response.success) {
    return res.status(411).json({
      msg: "Invalid Inputs",
    });
  }

  const userExist = await User.findOne({
    username: req.body.username,
  });

  if (userExist) {
    return res.status(403).json({
      msg: "Email already taken",
    });
  }

  try{
    const user = new User({
        username: req.body.username,
        // password : req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
    
      let hashedPassword = await user.createHash(req.body.password);
      user.password = hashedPassword;
    
      await user.save();

      await Account.create({
        userId : user._id,
        balance : Math.round(Math.random(1) * 1000, 2)
      })
    
      const userId = user._id;
    
      try {
        const token = jwt.sign(
          {
            userId,
          },
          JWT_Password
        );
    
        res.json({
          message: "User created successfully",
          token: token,
        });
      } catch (err) {
        res.json({
          msg: "something wrong while creating token",
        });
      }
  }catch(error){
    res.json({
        msg : "Error while signing up"
    })
  }
});

// signin route
router.post("/signin", async (req, res) => {
  const response = signin.safeParse(req.body);

  if (!response.success) {
    return res.status(411).json({
      msg: "Invalid Inputs !!",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
  });

  if (!user) {
    return res.status(401).json({
      msg: "User is not registerd",
    });
    // from here we can route to signup page
  } else {
    console.log("inside else");
    try {
      if (await user.validatePassword(req.body.password)) {
        try {
          const userId = user._id;
          const token = jwt.sign(
            {
              userId,
            },
            JWT_Password
          );
          console.log("token generted");
          res.json({
            msg: "Logged in successfully",
            token: token,
          });
        } catch (err) {
          res.json({
            msg: "Error while logging in",
          });
        }
      } else {
        res.status(401).json("can't validate the password");
      }
    } catch (err) {
      res.json({
        msg: "something wrong happend",
      });
    }
  }
});

// update route
router.put("/", authMiddleware, async (req, res) => {
  const response = updateUser.safeParse(req.body);

  if (!response.success) {
    return res.status(403).json({
      msg: "authentication failed!!",
    });
  }

  const userId = req.userId;
  try {
    await User.updateOne(
      {
        _id: userId,
      },
      req.body
    );

    res.json({
      msg: "Updated successfully",
    });
  } catch (error) {
    res.status(411).json({
      msg: "Error while updating information",
    });
  }
});

// get list of user
router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.params.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});
module.exports = router;
