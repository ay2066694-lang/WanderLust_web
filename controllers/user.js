const User = require("../models/user.js");

//signup form
module.exports.signUpForm = (req, res)=>{
    res.render("users/signup.ejs");
}

//Signup route
module.exports.signUp = async (req ,res)=>{
   try {
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to waonderlust!");
        res.redirect("/listings");
    });
   } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
   }
}


//login form
module.exports.loginForm = (req, res)=>{
    res.render("users/login.ejs");
}


//logIn
module.exports.logIn = async (req ,res)=>{
   req.flash("success", "Welcome back to WanderLust!");
   let redirectUrl = res.locals.redirectUrl || "/listings"
   res.redirect(redirectUrl);
};


//logOut
module.exports.logOut = (req ,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "Logged out!");
        res.redirect("/listings");
    })
};