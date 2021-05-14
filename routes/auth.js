if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  const express = require('express')
  const router = express.Router()
  const User = require('../models/user')
  const bcrypt = require('bcryptjs')
  const jwt = require('jsonwebtoken')
  const auth =  require('../middleware/auth')
  
  
  //Auth user
  router.post('/', (req, res) => {
   const {  password, email } = req.body
  
   if(!password || !email )
   {
       return res.status(400).json({msg: 'Please enter all field' })
   } 
  
   User.findOne({ email })
   .then(user => {
       if(!user) return res.status(400).json({ msg: 'User does not exists'})
       //Valudate password
       bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials'})
            require('dotenv').config()
            jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                {expiresIn: 3600 },
                (err, token) => {
                    if(err) throw err
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    })
                }
               ) 
        })
  
   })
  
  })
  

  // @route GET /users/user
  // @desc Get user data
  // @access Private
  
  router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
  })
  module.exports = router
  