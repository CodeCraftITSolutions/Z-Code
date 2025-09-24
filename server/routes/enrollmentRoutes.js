const express = require('express');
const router = express.Router();

const {
    getEnrolledStudents,
    createEnrollment,
    getEnrolledStudent,
    getEnrollmentTime,
    getEnrolledStudentsWithGrades,
    getEnrolledContests,
    search
} = require('../controller/enrollmentController');

router.get('/search/:contestId', search);
router.get('/:contestId', getEnrolledStudents);
router.get('/:studentId/:contestId', getEnrolledStudent);
router.post('/', createEnrollment);
router.get('/time/:userId/:contestId', getEnrollmentTime);
router.get('/contest/:contestId/enrolled-students-grades', getEnrolledStudentsWithGrades);
router.get('/contest/:userId/enrolled-contests', getEnrolledContests);

module.exports = router;

