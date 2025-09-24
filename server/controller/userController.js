const User = require('../models/user');
const Lecturer = require('../models/lecturer');
const student = require('../models/student');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const Notification = require('../models/notifications');
const Otp = require('../models/otp');

const crypto = require('crypto');

function generateSecureOTP(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    let OTP = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charsLength);
        OTP += chars[randomIndex];
    }

    return OTP;
}
const sendOtp = async (req, res) => {
    try {
        const { username, email, password, usertype, registrationNumber } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (!usertype) {
            return res.status(400).json({ error: 'User type is not given' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be atleast 6 characters long' });
        }
        //lower case email

        const availableLecturer = await Lecturer.findOne({ email: email.toLowerCase() });
        const availableStudent = await student.findOne({ email: email.toLowerCase() });
        if (availableStudent || availableLecturer) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const availableLecturer_ = await Lecturer.findOne({ username: username.toLowerCase() });
        const availableStudent_ = await student.findOne({ username: username.toLowerCase() });
        if (availableStudent_ || availableLecturer_) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const availableRegNo = await student.findOne({ regNo: registrationNumber });
        if (availableRegNo) {
            return res.status(400).json({ error: 'Registration Number already exists' });
        }

        const otp = generateSecureOTP(6);

        await Otp.deleteMany({ email: email.toLowerCase() });
        await Otp.create({ email: email.toLowerCase(), otp, expiry: Date.now() + 5*60 * 1000 });







        let transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            },
            // host: smtpHost,
            // port: smtpPort,
            // secure: false
        });

        let mailOptions = {
            // from: "farhadfd818@gmail.com",
            from : process.env.MAIL_USERNAME,
            to: email,
            subject: 'Account Verification',
            text: `OTP is ${otp}  This OTP will expire in 5 minutes`
        };

        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log(err);
                return res.status(400).json({ error: `${err}` });

            } else {
                return res.status(200).json({ msg: `Verify with the otp send to the email` });
            }
        });


        // return sendOtp(email)
        // return res.json({msg: 'User created successfully', otp});
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }



}


const google = async (req, res) => {

    try {
        const { username, email, password, usertype, registrationNumber } = req.body;
        hashedPassword = await bcrypt.hash(password, 10);

        const exisitngUser = await User.findOne({ email: email.toLowerCase() });
        if (exisitngUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        let user;
        if (usertype === 'lecturer') {

            user = await User.create({ username, email: email.toLowerCase(), password: hashedPassword, usertype });
            const lectr = await Lecturer.create({ username, email: email.toLowerCase(), password: hashedPassword, userId: user._id });
            const admin = await User.findOne({ usertype: 'admin' });
            const notification = await Notification.create({ usertype: "admin", message: `New Lecturer ${username} Has Been Created`, userId: admin._id });
            const totalUnread = await Notification.countDocuments({ read: false, usertype: 'admin' });

            const note = {
                message: `New Lecturer ${username} Has Been Created`,
                usertype: 'admin',
                totalUnread
            }
            const io = req.app.get('socketio');
            io.emit('databaseChange', note);
            io.emit('lecturercreated');

        } else {

            user = await User.create({ username, email: email.toLowerCase(), password: hashedPassword, usertype });
            const stdnt = await student.create({ username, email: email.toLowerCase(), password: hashedPassword, userId: user._id, regNo: registrationNumber });
            const io = req.app.get('socketio')
            io.emit('studentcreated');



        }

        const token = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN,
            {
                expiresIn: '1d'
            }
        );

        if (req.cookies[`${user._id}`]) {
            req.cookies[`${user._id}`] = '';
        }

        res.cookie(String(user._id), token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            sameSite: 'lax'
        });

        req.cookies.remo
        req.cookies[`${user._id}`] = token;

        return res.status(200).json({ msg: 'User created successfully', user });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }

}




const signup = async (req, res) => {

    try {
        const { username, email, password, usertype, OTP, registrationNumber } = req.body;

        hashedPassword = await bcrypt.hash(password, 10);

        if (!OTP) {
            return res.status(400).json({ error: 'Please enter the OTP' });
        }
        const otp = await Otp.findOne({ email: email.toLowerCase() });
        console.log(otp);
        if (!otp) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        if (OTP !== otp.otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        if(otp.expiry < Date.now()){
            return res.status(400).json({ error: 'OTP expired' });
        }



        else {



            if (usertype === 'lecturer') {

                const user = await User.create({ username, email: email.toLowerCase(), password: hashedPassword, usertype });
                const lectr = await Lecturer.create({ username, email: email.toLowerCase(), password: hashedPassword, userId: user._id });
                const admin = await User.findOne({ usertype: 'admin' });
                const notification = await Notification.create({ usertype: "admin", message: `New Lecturer ${username} Has Been Created`, userId: admin._id });
                const totalUnread = await Notification.countDocuments({ read: false, usertype: 'admin' });

                const note = {
                    message: `New Lecturer ${username} Has Been Created`,
                    usertype: 'admin',
                    totalUnread,
                    userId: admin._id
                }
                const io = req.app.get('socketio');
                io.emit('databaseChange', note);
                io.emit('lecturercreated');



            } else {

                const user = await User.create({ username, email: email.toLowerCase(), password: hashedPassword, usertype });
                const stdnt = await student.create({ username, email: email.toLowerCase(), password: hashedPassword, userId: user._id, regNo: registrationNumber });
                const io = req.app.get('socketio')
                io.emit('studentcreated');
            }
        }

        return res.status(200).json({ msg: 'User created successfully' });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }

}


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN,
            {
                expiresIn: '1d'
            }
        );


        if (req.cookies[`${user._id}`]) {
            req.cookies[`${user._id}`] = '';
        }



        // Set the new cookie
        res.cookie(String(user._id), token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            sameSite: 'lax'
        });

        req.cookies.remo
        req.cookies[`${user._id}`] = token;

        let userType = '';
        if (user.usertype === 'lecturer') {
            userType = 'lecturer';
        } else if (user.usertype === 'student') {
            userType = 'student';
        } else {
            userType = 'admin';
        }

        return res.status(200).json({ msg: userType, user });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



const googlelogin = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ error: "Please Signup First" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN,
            {
                expiresIn: '1d'
            }
        );


        if (req.cookies[`${user._id}`]) {
            req.cookies[`${user._id}`] = '';
        }



        // Set the new cookie
        res.cookie(String(user._id), token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            sameSite: 'lax'
        });

        req.cookies.remo
        req.cookies[`${user._id}`] = token;

        let userType = '';
        if (user.usertype === 'lecturer') {
            userType = 'lecturer';
        } else if (user.usertype === 'student') {
            userType = 'student';
        } else {
            userType = 'admin';
        }

        return res.status(200).json({ msg: userType, user });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};








const verifyToken = (req, res, next) => {
    const cookie = req.headers.cookie;


    if (!cookie) {
        res.status(401).json({ error: 'Cookie Expired Please login again' });
        return;
    }
    const token = cookie.split('=')[1];
    if (token == null) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }




    jwt.verify(String(token), process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            cookie.split(';').forEach(cookie => {
                const name = cookie.split('=')[0].trim();
                res.clearCookie(name, { path: '/' });
            });
            res.status(403).json({ error: 'Invalid Token' });
            return
            // return;
        }
        else {
            // res.status(200).json({msg: 'success'});
            req.id = user.id;
            next();


        }


    })


}

const getUser = async (req, res) => {
    const cookie = req.headers.cookie;
    try {
        const userId = req.id;
        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }

        const user = await User.findById(userId, '-password');
        if (!user) {
            res.clearCookie(String(req.id));
            req.cookies[`${req.id}`] = '';
            return res.status(404).json({ error: 'User not found' });

        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const refreshToken = async (req, res, next) => {
    const cookie = req.headers.cookie;
    if (!cookie) {
        return res.status(401).json({ error: 'Cookie expired please login again' });
    }
    const token = cookie.split('=')[1];
    if (token == null) {
        return res.status(401).json({ error: 'Token not found' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            cookie.split(';').forEach(cookie => {
                const name = cookie.split('=')[0].trim();
                res.clearCookie(name, { path: '/' });
            });
            return res.status(403).json({ error: 'Authentication Failed' });
        }

        res.clearCookie(`${user.id}`)
        req.cookies[`${user.id}`] = '';


        const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
            expiresIn: '7d'
        })


        res.cookie(String(user.id), token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            sameSite: 'lax'
        })


        req.id = user.id;
        next();
    })


}


const forgotPassword =
    async (req, res) => {
        const { email } = req.body;
        try {
            if (!email) {
                return res.status(400).json({ error: 'Email is mandatory' });
            }
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'User does not exist' });
            }

            const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
                expiresIn: '1d'
            })

            let transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                    clientId: process.env.OAUTH_CLIENTID,
                    clientSecret: process.env.OAUTH_CLIENT_SECRET,
                    refreshToken: process.env.OAUTH_REFRESH_TOKEN
                },
                // host: smtpHost,
                // port: smtpPort,
                // secure: false
            });

            let mailOptions = {
                // from: "farhadfd818@gmail.com",
                from : process.env.MAIL_USERNAME,
                to: email,
                subject: 'Reset Password',
                text: `This link will expire in 5 minutes\nhttps://zee-code-3234074b267f.herokuapp.com/reset/${token}`
            };

            transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ error: `${err}` });
                } else {
                    return res.status(200).json({ msg: `Check your email for the password reset link` });
                }
            });

        }

        catch (err) {
            res.status(500).json({ error: err.message });
        }



    }


const resetPassword =
    async (req, res) => {
        const { password } = req.body;
        const token = req.params.token;
        if (!password) {
            return res.status(400).json({ error: 'Password is mandatory' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be atleast 6 characters long' });
        }
        if (!token) {
            return res.status(400).json({ error: 'Token is mandatory' });
        }
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(400).json({ error: 'User does not exist' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({ msg: 'Password reset successfully' });
        }
        catch (err) {
            return res.status(500).json({ error: "Invalid Token" });
        }
    }


const logout = (req, res, next) => {

    const cookie = req.headers.cookie;
    if (!cookie) {
        return res.status(401).json({ error: 'Session Expired Please login again' });
    }
    const token = cookie.split('=')[1];
    if (token == null) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.id = user.id;
    })
    res.clearCookie(String(req.id));
    req.cookies[`${req.id}`] = '';
    return res.status(200).json({ msg: 'Logged out successfully' });


}




module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    verifyToken,
    getUser,
    sendOtp,
    logout,
    refreshToken,
    google,
    googlelogin
}