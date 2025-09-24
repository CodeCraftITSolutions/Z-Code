const Problem = require('../models/problems')
const User = require('../models/user')
const Submission = require('../models/submission')

const difficultyOrder = {
    'easy': 1,
    'medium': 2,
    'hard': 3
};


const addProblem = async (req, res) => {
    try {
        const { name, category, description, difficulty, testCases, grade, initialCode, programmingLanguage, examples, isPractice, createdBy } = req.body;

        const added = await User.findById(createdBy);

        const existingName = await Problem.findOne({ name });

        if (existingName) {
            return res.status(403).json({ msg: 'Problem with same name existing' })
        }

        const problem = await Problem.create({
            name,
            category,
            description,
            difficulty : difficultyOrder[difficulty.toLowerCase()],
            testCases,
            grade,
            initialCode,
            programmingLanguage,
            examples,
            isPractice,
            createdBy,
            addedBy: added.username
        })

        return res.status(201).json({ problem })


    }

    catch (err) {
        return res.status(400).json({ msg: 'Error Occured', error: err.message })
    }

}

const getProblems = async (req, res) => {
    // try{
    //     const { page = 1, limit = 10 } = req.query;
    //     const skip = (page - 1) * limit;
    //     console.log(skip)
    //     const problems = await Problem.find().skip(skip).limit(Number(limit));
    // const total = await Problem.countDocuments();

    //     return res.status(200).json({problems,total})
    // }
    // catch(err){
    //     return res.status(400).json({msg : err.message})
    // }
    try {
        const { page = 1, limit = 10, sortField = 'updatedAt', sortOrder = 'desc' } = req.query;
        const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
        const problems = await Problem.find()
        .collation({ locale: 'en', strength: 2 })
          .sort(sortOptions)
          .skip((page - 1) * limit)
          .limit(parseInt(limit));
        const total = await Problem.countDocuments();
        res.json({ problems, total });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching problems', error });
    }
}

const deleteProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(400).json({ error: "problem not found" })
        await Problem.findByIdAndDelete(req.params.id);
        await Submission.deleteMany({ problemId: req.params.id });

        return res.status(200).json({ msg: "problem deleted successfully" })
    }
    catch (err) {

        return res.status(400).json({ error: err.message })

    }
}

const getProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id.toString());

        return res.status(200).json({ problem })
    }
    catch (err) {
        return res.status(400).json({ msg: err.message })
    }
}

const updateInitialCode = async (req, res) => {

    try {
        // Find the problem by ID
        const problem = await Problem.findById(req.params.id);


        if (!problem) {
            return res.status(404).json({ msg: 'Problem not found' });
        }

        // Update initialCode and programmingLanguage if provided in the request body
        if (req.body.initialCode) {
            problem.initialCode = req.body.initialCode;
        }
        if (req.body.programmingLanguage) {
            problem.programmingLanguage = req.body.programmingLanguage;
        }

        // Save the updated problem
        await problem.save();

        // Return the updated problem in the response
        return res.status(200).json({ problem });
    } catch (err) {
        // Handle errors
        return res.status(400).json({ msg: err.message });
    }
};

const updateProblem = async (req, res) => {
    try {
        const { name, category, description, difficulty, testCases, grade, initialCode, examples,isPractice , customCategory} = req.body;
        const updatedProblem = await Problem.findByIdAndUpdate(
            req.params.id,
            {
                name,
                category,
                description,
                difficulty : difficultyOrder[difficulty.toLowerCase()],
                testCases,
                grade,
                initialCode,
                examples,
                isPractice,
                customCategory
            },
            { new: true, runValidators: true }
        );
        if (!updatedProblem) return res.status(404).json({ msg: "Problem not found" });
        return res.status(200).json({ problem: updatedProblem });
    } catch (err) {
        return res.status(400).json({ msg: err.message });
    }
};

const getPracticeProblems = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortField = 'updatedAt', sortOrder = 'desc'  } = req.query;

        const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (page - 1) * limit;

        const problems = await Problem.find({ isPractice: true })
        .collation({ locale: 'en', strength: 2 })
          .sort(sortOptions)
        .skip(skip).limit(Number(limit));
        const total = await Problem.find({ isPractice: true }).countDocuments();

        return res.status(200).json({ problems, total });
    } catch (err) {
        return res.status(400).json({ msg: err.message });
    }
}


const searchProblems = async (req, res) => {
    try {
        const { name } = req.query;
        const { page = 1, limit = 10, sortField = 'updatedAt', sortOrder = 'desc' } = req.query;
        const skip = (page - 1) * limit;
        const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

        // Construct query object
        const query = {};
        if (name) {
            query.$or = [
                { name: new RegExp(name, 'i') },
                { category: new RegExp(name, 'i') },
                { addedBy: new RegExp(name, 'i') }
            ];
        }

        const problems = await Problem.find(query)
        .collation({ locale: 'en', strength: 2 })
            .sort(sortOptions)
            .skip(skip).limit(Number(limit));
        const total = await Problem.countDocuments(query);

        return res.status(200).json({ problems, total });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const searchPracticeProblems = async (req, res) => {
    try {
        const { name } = req.query;
        const { page = 1, limit = 10 , sortField = 'name', sortOrder = 'asc'} = req.query;
        const skip = (page - 1) * limit;
        const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
        const query = { isPractice: true };
        if (name) {
            query.$or = [
                { name: new RegExp(name, 'i') },
                { category: new RegExp(name, 'i') },
            ];
        }

        const problems = await Problem.find(query)
        .collation({ locale: 'en', strength: 2 })
            .sort(sortOptions)
        .skip(skip).limit(Number(limit));
        const total = await Problem.countDocuments(query);

        return res.status(200).json({ problems, total });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};



module.exports = { addProblem, getProblems, getProblem, updateInitialCode, deleteProblem, updateProblem, getPracticeProblems, searchProblems, searchPracticeProblems }