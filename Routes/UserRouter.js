const express = require('express')
const { authenticateToken } = require('../config/JwtToken');
const { register, login, changePassword, register_admin, ResetPassword, New_password,  loginWithOTP, generateAndSendOTP, login_fb, login_google, AddCustomer } = require('../controllers/userController');
const { AddBlogs, AllBlogs, editBlog, UpdateBlogs, AddBlogsCategory, AllCategory, deleteBlogCategory, deleteBlog } = require('../controllers/blogController');


const { sendMessages, deleteChat, getMessages } = require('../controllers/chatController');


const multer = require('multer');
const path = require('path');


const { edit_admin_profile, Update_admin_profile } = require('../controllers/adminController');
const { AddProducts, AllProducts, editProduct, UpdateProducts, deleteProduct } = require('../controllers/productController');
const { Allproviders, editprovider, Updateprovider, deleteprovider } = require('../controllers/providerController');
// Multer configuration
const storage = multer.diskStorage({
    destination: './public/images', // Specify the destination folder
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (optional)
});


const router = express.Router();


// User Auth 
router.post('/register', register);
router.post('/login', login);
router.post('/loginWithOTP',loginWithOTP)
router.post('/generateAndSendOTP',generateAndSendOTP)
router.post('/login_fb',login_fb)
router.post('/login_google',login_google)

// Customer
router.post('/AddCustomer',AddCustomer)
router.post('/sendMessages',upload.single('image'),authenticateToken, sendMessages)
router.get('/getMessages/:userId',authenticateToken, getMessages)
router.post('/deleteChat',authenticateToken, deleteChat)



// Doctor
router.get('/Allproviders', Allproviders)
router.get('/editprovider/:id', editprovider)
router.put('/Updateprovider/:id',  authenticateToken, Updateprovider);
router.delete('/deleteprovider/:id',authenticateToken, deleteprovider)

router.post('/changePassword/:resetToken',authenticateToken,changePassword)


// Blogs
router.post('/AddBlogs',upload.single('image'),authenticateToken,  AddBlogs)
router.get('/AllBlogs', AllBlogs)
router.get('/editBlog/:id', editBlog)
router.put('/UpdateBlogs/:id', upload.single('image'),authenticateToken, UpdateBlogs)
router.post('/AddBlogsCategory',authenticateToken, AddBlogsCategory)
router.get('/AllCategory', AllCategory)
router.delete('/deleteBlogCategory/:id',authenticateToken, deleteBlogCategory)
router.delete('/deleteBlog/:id',authenticateToken, deleteBlog)



// Product
router.post('/AddProducts',upload.single('image'),authenticateToken,  AddProducts)
router.get('/AllProducts', AllProducts)
router.get('/editProduct/:id', editProduct)
router.put('/UpdateProducts/:id', upload.single('image'),authenticateToken, UpdateProducts)
router.delete('/deleteProduct/:id',authenticateToken, deleteProduct)


// admin
router.get('/edit_admin_profile/:id',edit_admin_profile,authenticateToken);
router.put('/Update_admin_profile/:id',upload.single('image'),Update_admin_profile,authenticateToken);
router.post('/register_admin',authenticateToken,register_admin);



// Email Reset Password
router.post('/ResetPassword',ResetPassword);
router.post('/New_password/:token',New_password);



module.exports = router;