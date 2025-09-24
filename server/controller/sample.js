const Sample = require('../models/sample');

const getSamples = async (req, res) => {
    try {
        const samples = await Sample.find();
        res.json({samples, message: 'Samples fetched successfully'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const createSample = async (req, res) => {
    try {

        const {name, age} = req.body;
        const sample = await Sample.create({name, age});
        res.json({msg: 'Sample created successfully',Object: sample});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const getSample = async (req, res) => {
    try {
        const {id} = req.params;
        const sample = await Sample.findById(id);
        if(!sample) return res.status(404).json({message: 'Sample not found'});
        res.json({sample, message: 'Sample fetched successfully'});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const updateSample = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, age} = req.body;
        const sample = await Sample.findByIdAndUpdate(id, {name, age}, {new: true});
        if(!sample) return res.status(404).json({message: 'Sample not found'});
        res.json({sample, message: 'Sample updated successfully'});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const deleteSample = async (req, res) => {
    try {
        const {id} = req.params;
        const sample = await Sample.findByIdAndDelete(id);
        if(!sample) return res.status(404).json({message: 'Sample not found'});
        res.json({message: 'Sample deleted successfully'});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getSamples,
    createSample,
    getSample,
    updateSample,
    deleteSample
}
