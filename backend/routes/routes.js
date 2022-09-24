const express = require('express');
const router = express.Router();
const {upload, unlinkFiles} = require('../services/upload-helper');

const NoticeController = require('../controllers/notice-controller');
const MessageController = require('../controllers/message-controller');
const GalleryController = require('../controllers/gallery-controller');
const EventController = require('../controllers/event-controller');
const AuthController = require('../controllers/auth-controller');
const MarketController = require('../controllers/market-controller');
const HousingController = require('../controllers/housing-controller');

router.post('/auth/login', AuthController.login);
router.put('/auth/:username',AuthController.updateUser);
router.delete('/auth/:username',AuthController.deleteUser);
router.post('/auth/myaccount/lock/:username', AuthController.comparePws);
router.get('/auth/myactivity/comments/:username', AuthController.getCommentByUser)
router.post('/signup', AuthController.createAccount);
router.get('/signup/:username',AuthController.findUsername);

router.post('/contact',MessageController.sendEmail);

router.post('/notice', upload.array("files",10), NoticeController.createPost);
router.get('/notice', NoticeController.findAllPost);
router.get('/notice/:username', NoticeController.findByUser);
router.get('/notice/posts/:_id', NoticeController.findOnePost);
router.put('/notice/:_id', upload.array("files",10),NoticeController.updatePost);
router.delete('/notice/:_id/:username', NoticeController.deletePost);
router.delete('/notice', NoticeController.deleteAllPost);
router.get('/notice/comments/:_id', NoticeController.findAllComments);
router.post('/notice/comments/:_id', NoticeController.addComment);
router.put('/notice/comments/:_id/:_cid', NoticeController.updateComment);
router.delete('/notice/comments/:_id/:_cid', NoticeController.deleteComment);
router.put('/notice/views/:_id',NoticeController.updateViews);

router.post('/events',EventController.createEvent);
router.get('/events', EventController.getAllEvent);
router.delete('/events', EventController.deleteEvent);
router.put('/events', EventController.updateEvent);

router.post('/gallery',upload.array("imgCollection",10),GalleryController.createGallery);
router.get('/gallery',GalleryController.getFiles);
router.get('/gallery/:_id',GalleryController.getOneFile);
router.delete('/gallery/:_id',GalleryController.deleteOneFile);


router.post('/market', upload.array("files",10), MarketController.createPost);
router.get('/market', MarketController.findAllPost);
router.get('/market/:username', MarketController.findByUser);
router.get('/market/posts/:_id', MarketController.findOnePost);
router.put('/market/:_id', upload.array("files",10),MarketController.updatePost);
router.delete('/market/:_id/:username', MarketController.deletePost);
router.delete('/market', MarketController.deleteAllPost);
router.get('/market/comments/:_id', MarketController.findAllComments);
router.post('/market/comments/:_id', MarketController.addComment);
router.put('/market/comments/:_id/:_cid', MarketController.updateComment);
router.delete('/market/comments/:_id/:_cid', MarketController.deleteComment);
router.put('/market/views/:_id',MarketController.updateViews);


router.post('/housing',  upload.array("files",10), HousingController.createPost);
router.get('/housing', HousingController.findAllPost);
router.get('/housing/:username', HousingController.findByUser);
router.get('/housing/posts/:_id', HousingController.findOnePost);
router.put('/housing/:_id', upload.array("files",10),HousingController.updatePost);
router.delete('/housing/:_id/:username', HousingController.deletePost);
router.delete('/housing', HousingController.deleteAllPost);
router.get('/housing/comments/:_id', HousingController.findAllComments);
router.post('/housing/comments/:_id', HousingController.addComment);
router.put('/housing/comments/:_id/:_cid', HousingController.updateComment);
router.delete('/housing/comments/:_id/:_cid', HousingController.deleteComment);
router.put('/housing/views/:_id',HousingController.updateViews);


module.exports = router