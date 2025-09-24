const contest = require('../models/contest');
const Contest = require('../models/contest')
const Enrollment = require('../models/enrollment')
const Problem = require('../models/problems')
const Notification = require('../models/notifications')
const User = require('../models/user')


async function addContest(req, res) {
    try {
        const { name, startDate, endDate, duration, problems,createdBy } = req.body;
        

        const adjustedStartDate = new Date(new Date(startDate).getTime() - 5.5 * 60 * 60 * 1000);
        const adjustedEndDate = new Date(new Date(endDate).getTime() - 5.5 * 60 * 60 * 1000);

        // Create a new Contest document
        const contest = new Contest({
            name,
            startDate: adjustedStartDate,
            endDate: adjustedEndDate,
            duration,
            problems,
            createdBy
        });

        // Save the contest to the database
        await contest.save();

        const users = await User.find({ usertype: 'student' }, '_id');

        // Prepare bulk write operations for notifications
        const bulkOps = users.map(user => ({
            insertOne: {
                document: {
                    userId: user._id,
                    usertype: 'student',
                    message: `New Contest ${name} Has Been Created`,
                    objectId: contest._id,
                    read: false
                }
            }
        }));

        // Perform bulk write to create notifications
        await Notification.bulkWrite(bulkOps);
        // const notification = await Notification.create({ usertype : "student", message : `New Contest ${name} Has Been Created`,objectId : contest._id});
        // const totalUnread = await Notification.countDocuments({ read: false , usertype : "student"});

        const note = {
            message : `New Contest ${name} Has Been Created`,
            usertype: 'student',
            
            // totalUnread,
        }
        const io = req.app.get('socketio');
        io.emit('databaseChange', note);

        res.status(201).json({ message: 'Contest created successfully', contest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getContests = async (req,res)=>{

    try{
        const {userId} = req.params;
        const contests = await Contest.find({createdBy:userId}).sort({createdAt:-1});      
        return res.status(200).json({contests})
    }
    catch(err){
        return res.status(400).json({msg : err.message})
    }
}


const getCompletedContests = async (req, res) => {
  try {

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const { userId } = req.params;
    const currentTimestamp = new Date().getTime();

      const completedContests = await Contest.find({
          createdBy: userId,
          endDate: { $lt: currentTimestamp }
      })
      .sort({ createdAt: -1 })
      .skip(skip).limit(Number(limit));

      const total = await Contest.find({
        createdBy: userId,
        endDate: { $lt: currentTimestamp }
    }).countDocuments();

      return res.status(200).json({completedContests,total});
  } catch (err) {
      return res.status(400).json({ msg: err.message });
  }
}

const getOngoingContests = async (req, res) => {
  try {
    
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
      const { userId } = req.params;
      const currentTimestamp = new Date().getTime();

      const availableContests = await Contest.find({
          createdBy: userId,
          endDate: { $gte: currentTimestamp }
      })
      .sort({ createdAt: -1 })
      .skip(skip).limit(Number(limit));

      const total = await Contest.find({
        createdBy: userId,
        endDate: { $gte: currentTimestamp }
    }).countDocuments();
      return res.status(200).json({availableContests,total});
  } catch (err) {
      return res.status(400).json({ msg: err.message });
  }
}



async function deleteContest(req, res) {
    const contestId = req.params.id;

    try {
        // Find the contest by ID and delete it
        const deletedContest = await Contest.findByIdAndDelete(contestId);

        if (!deletedContest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        await Enrollment.deleteMany({ contestId });
        // await Notification.deleteMany({ objectId: contestId });
        // await Submission.deleteMany({ contestId });



        res.json({ message: 'Contest deleted successfully' ,deletedContest});
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete contest',error });
    }
}

const getContest = async (req, res) => {
    try {
      const { id } = req.params;
      const contest = await Contest.findById(id);
      if (!contest) {
        return res.status(404).json({ error: 'Contest not found' });
      }
      const problems = await Contest.findById(id).populate('problems');
      const problems_ = problems.problems;
      res.status(200).json({ contest,problems : problems_});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contest' });
    }
  };


const updateContest = async (req, res) => {
    try {
      const { name, startDate, endDate, duration, problems } = req.body;

      const adjustedStartDate = new Date(new Date(startDate).getTime() - 5.5 * 60 * 60 * 1000);
      const adjustedEndDate = new Date(new Date(endDate).getTime() - 5.5 * 60 * 60 * 1000);
      const updatedContest = await Contest.findByIdAndUpdate(
        req.params.id,
        {
            name, startDate : adjustedStartDate, endDate : adjustedEndDate, duration, problems
        },
        { new: true, runValidators: true }
      );
      if (!updatedContest) return res.status(404).json({ msg: "Contest not found" });
      return res.status(200).json({ contest: updatedContest });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  };
  

const getAvilabalContests = async (req, res) => {
  try {
    const { studentId } = req.params;
    const currentDate = new Date();

    // Fetch only the contests that are currently ongoing
    //sort by createdAt

    const contests = await Contest.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    })
    .sort({ createdAt: -1 })

    ;

    const contestIds = contests.map(contest => contest._id.toString());

    // Fetch enrollments for the student in the ongoing contests
    const enrollments = await Enrollment.find({
      studentId,
      contestId: { $in: contestIds }
    }, 'contestId createdAt').populate('contestId', 'duration');

    // Calculate the contests to remove based on the duration and createdAt
    const contestIdsToRemove = new Set(enrollments.filter(enrollment => {
      return enrollment.createdAt.getTime() + enrollment.contestId.duration * 60000 < currentDate.getTime();
    }).map(enrollment => enrollment.contestId._id.toString()));

    // Filter available contests by removing the contests that have ended for the student
    const availableContests_ = contests.filter(contest => !contestIdsToRemove.has(contest._id.toString()));

    res.status(200).json({ availableContests_ });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available contests' });
  }
};

const searchContests = async (req, res) => {
    try {
        const { name } = req.query;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        // Construct query object
        const query = {};
        if (name) query.name = new RegExp(name, 'i');
        const contests = await Contest.find(query).skip(skip).limit(Number(limit));
        const total = await Contest.find(query).countDocuments();
        return res.status(200).json({contests,total})
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getUpcomingContests = async (req, res) => {
  try {
    const currentTimestamp = new Date().getTime();
    const upcomingContests = await Contest.find({
      startDate: { $gt: currentTimestamp }
    })
    .sort({ createdAt: -1})

    return res.status(200).json({ upcomingContests});
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

const getContestLocation = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    const currentTimestamp = new Date().getTime();
    if (currentTimestamp < contest.startDate) {
      return res.status(200).json({ location: 'upcoming' });
    } else{
      return res.status(200).json({ location: 'available' });
    } 
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contest' });
  }
};


  

module.exports = {
  getContests,
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
}