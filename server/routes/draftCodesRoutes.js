const express = require('express')
const router = express.Router()


const { getDraft, createDraft,getDrafts,deleteDraft} = require('../controller/draftCodeController');

router.put('/:problemId/:userId/:contestId',createDraft);
router.get('/:problemId/:userId/:contestId',getDraft)
router.get('/',getDrafts)
router.delete('/:problemId/:userId/:contestId',deleteDraft)
module.exports = router;

