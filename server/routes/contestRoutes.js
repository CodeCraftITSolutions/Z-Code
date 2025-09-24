const express = require('express')
const router = express.Router()

const { getContests,
    addContest,
    deleteContest,
    updateContest,
    getContest,
    getAvilabalContests,
    getCompletedContests,
    getOngoingContests,
    searchContests,
    getUpcomingContests,
    getContestLocation
} = require('../controller/contestController')

router.post('/', addContest)
router.get('/all/:userId', getContests)
router.get('/completed/:userId', getCompletedContests)
router.get('/available-contests/:userId', getOngoingContests)
router.get('/upcoming', getUpcomingContests)
router.get('/search', searchContests);
router.get('/available/:studentId', getAvilabalContests)
router.get('/:id', getContest)
router.delete('/:id', deleteContest)
router.put('/:id', updateContest)
router.get('/location/:contestId', getContestLocation)


module.exports = router