const AsyncHandler = require("express-async-handler");
const User = require("../../models/userModel");
const generateToken = require("../../config/generateToken");
// const { all } = require("../userRoutes");


const registerUser = AsyncHandler(
    async (req, res) => {
        const { name, email, password, picture } = req.body;
        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please Enter All the Fields");

        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400);
            throw new Error("User already Exists");
        }
        const user = await User.create({
            name,
            email,
            password,
            picture,
        })
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                picture: user.picture,
                token: generateToken(user._id),
            })

        }
        else {
            res.status(400);
            throw new Error("Failed to Create User");
        }
    }
);

const authUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email , password);
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            picture : user.picture,
            token: generateToken(user._id),
        })
    }
    else {
        res.status(400);
        throw new Error("Invalid Email or Password");
    }
});

const allUsers = AsyncHandler(async(req, res)=>{
    const keyword = req.query.search ? {
        $or : [
            {name : {$regex: req.query.search, $options: "i"}},
            {email : {$regex: req.query.search, $options : "i"}},
        ]
    }:{}

    const users = await User.find(keyword).find({_id : {$ne : req.user._id}});
    res.send(users);
}
);

module.exports = { registerUser, authUser, allUsers };