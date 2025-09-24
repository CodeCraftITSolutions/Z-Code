const Notification = require("../models/notifications");


const getAllNotifications = async (req, res) => {
    try {
        const {usertype,userId} = req.query;
        const notifications = await Notification.find({usertype,userId}).sort({ createdAt: -1 });
        res.status(200).json({notifications});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalUnreadNotifications = async (req, res) => {
    try {
        const {usertype,userId} = req.query;
        const notifications = await Notification.find({usertype,userId}).sort({ createdAt: -1 });
        const totalUnread = await Notification.countDocuments({ read: false , usertype,userId });
        res.status(200).json({ totalUnread,notifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    const { id } = req.params;
    const {usertype,userId} = req.query;
    try {
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        const notifications = await Notification.find({usertype,userId}).sort({ createdAt: -1 });
        res.status(200).json({notifications});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    const { id } = req.params;
    const {usertype,userId} = req.query;

    try {
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        const notifications = await Notification.find({usertype,userId}).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Notification deleted successfully',notifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAllNotifications = async (req, res) => {
    try {
        const {usertype,userId} = req.query;
        await Notification.deleteMany({usertype,userId});
        res.status(200).json({ message: 'All notifications deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const readAllNotifications = async (req, res) => {
    try {
        // Extract the usertype from the query parameters
        const { usertype,userId } = req.query;

        // Update all notifications for the given usertype to mark them as read
        await Notification.updateMany({ usertype,userId }, { $set: { read: true } });
        const notifications = await Notification.find({usertype,userId}).sort({ createdAt: -1 });

        

        // Send a success response
        res.status(200).json({ message: 'All notifications marked as read' ,notifications});
    } catch (error) {
        // Handle any errors and send a failure response
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllNotifications,
    getTotalUnreadNotifications,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
    readAllNotifications,
};