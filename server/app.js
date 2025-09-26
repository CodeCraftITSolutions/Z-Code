const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
// app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://z-code-1-eqrq.onrender.com']
  : ['http://localhost:5173', 'https://z-code-1-eqrq.onrender.com']; // Add other local origins if necessary

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });



app.use("/api/sample", require("./routes/sample"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/lecturer", require("./routes/lecturerRoutes"));
app.use('/api/problems',require('./routes/problemRoutes'))
app.use('/api/contest',require('./routes/contestRoutes'))
app.use('/api/submission',require('./routes/submissionRoutes'))
app.use('/api/admin',require('./routes/adminRoutes'))
app.use('/api/image',require('./routes/imageRoutes'))
app.use('/api/enrollment',require('./routes/enrollmentRoutes'))
app.use('/api/draft',require('./routes/draftCodesRoutes'))
app.use('/api/notification',require('./routes/notificationRoutes'))





  module.exports = app;