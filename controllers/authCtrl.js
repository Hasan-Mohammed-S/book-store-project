
const bcrypt = require('bcrypt');
const User = require('../models/user');

const SALT_ROUDS = 10;

const signup = async (req, res) => {
  res.render('auth/sign-up.ejs');
};

const register = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send('Invalid input');
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Invalid input');
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, SALT_ROUDS);
    req.body.password = hashedPassword;

  
    const user = await User.create(req.body);

    req.session.user = {
      username: user.username,
      _id: user._id,
    };
    // redirect to homepage
    req.session.save(() => {
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
    res.send('something went wrong');
  }
};

const signin = async (req, res) => {
  res.render('auth/sign-in.ejs');
};

const login = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });

  if (!userInDatabase) {
    return res.send('Invalid credentials');
  }

  if (!bcrypt.compareSync(req.body.password, userInDatabase.password)) {
    return res.send('Invalid credentials');
  }


  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };

  req.session.save(() => {
    res.redirect('/');
  });
};

const signout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

module.exports = {
  signup,
  register,
  signin,
  login,
  signout,
};
