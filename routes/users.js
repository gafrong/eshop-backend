const { register, login, getUsers, getUserId, postNewUser, deleteUser, getUserCount, updateUser, followUser, unfollowUser } = require('../controllers/user');
const express = require('express');
const router = express.Router();
const { validateRegisterRequest, validateLoginRequest, isRequestValidated } = require('../validators/auth');
const { requireSignin } = require('../common-middleware/');

router.get('/', getUsers);
router.get('/:id', getUserId);
router.post(`/`, postNewUser);
router.post('/login', validateLoginRequest, isRequestValidated, login);
router.post('/register', validateRegisterRequest, isRequestValidated, register);
router.put('/:id', updateUser)
router.delete(`/:id`, deleteUser);
router.get(`/get/count`, getUserCount);

router.post('/profile', requireSignin, (req, res)=>{
    res.status(200).json({user: 'profile'})
});
router.put('/follow', followUser, requireSignin);
router.put('/unfollow', unfollowUser, requireSignin);

module.exports = router;