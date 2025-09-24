const express = require('express')
const router = express.Router()
const {postSubmission,getSubmission, getSingleSubmission,getTotalGradeForContest,isProblemSolved} = require('../controller/submissionController');

router.post('/', postSubmission);
router.get('/', getSubmission);
router.get('/:id', getSingleSubmission);
router.get('/:userId/:contestId/total-grade', getTotalGradeForContest);
router.get('/is-solved/:userId/:problemId/:contestId', isProblemSolved);


module.exports = router