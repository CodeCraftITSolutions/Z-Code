const DraftCodes = require('../models/draftCodes')

const getDraft = async(req,res)=>{
    try{
    const {problemId,userId,contestId} = req.params;
    const draftCodes = await DraftCodes.findOne({problemId,userId,contestId});
    res.status(200).json({draftCodes})
    }catch(err){
        res.status(400).json({ msg : err.message})
    }

}

const createDraft = async (req, res) => {
    const { problemId, userId, contestId } = req.params;
    const { codes } = req.body;  

    try {
        const result = await DraftCodes.findOneAndUpdate(
            { problemId, userId, contestId },  // filter
            { problemId,
                userId,
                contestId,
                codes },  // update
            { new: true, upsert: true, setDefaultsOnInsert: true }  // options
        );

        res.json({ message: 'Draft saved successfully', draft: result });
    } catch (error) {
        res.status(500).json({ message: 'Error saving draft', error });
    }
}
const getDrafts = async(req,res)=>{
    try{

    const drafts = await DraftCodes.find();
    res.status(200).json({drafts})

    }catch(err){
    res.status(400).json({msg : err.message})
    }
    
}

const deleteDraft = async (req, res) => {
    try {
        const { problemId, userId, contestId } = req.params;
        const result = await DraftCodes.findOneAndDelete({ problemId, userId, contestId });
        if (result) {
            res.status(200).json({ message: 'Draft deleted successfully' });
        } else {
            res.status(200).json({ message: 'Draft not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting draft', error });
    }
};

module.exports = {getDraft,createDraft,getDrafts,deleteDraft}