const express = require('express');
const router = express.Router();

const { 
    getAllNotifications,
    getTotalUnreadNotifications,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
    readAllNotifications,
 } = require('../controller/notificationController');

router.get('/', getAllNotifications);
router.get('/unread', getTotalUnreadNotifications);
router.put('/read', readAllNotifications);
router.put('/:id', markAsRead);
router.delete('/', deleteAllNotifications);
router.delete('/:id', deleteNotification);

module.exports = router;