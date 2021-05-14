if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth =  require('../middleware/auth')

//Resgister new user

router.get('/', async (req, res) => {
  try {
      const users = await User.find({})
      res.json(users)
  } catch (error) {
      throw error
  }
})

router.post('/', (req, res) => {
 const { name, password, email } = req.body

 if( !name || !password || !email )
 {
     return res.status(400).json({msg: 'Please enter all field' })
 } 

 User.findOne({ email })
  .then(user => {
      if(user) return res.status(400).json({ msg: 'User allready exists'})
  })
  
  const newUser = new User({
      name,
      email,
      password
  })

  //Create salt & hash
  bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) {
              throw(err)
          }
          newUser.password = hash;
          newUser.save()
             .then(user => {
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
})


router.delete('/:id', async (req, res) => {
  try {
      const item = await Item.findById(req.params.id)
      item.remove().then(() => {
          res.json({success: true})
      })
  } catch (error) {
      res.status(404).json({ success:  false })
  }
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