const { get } = require("mongoose");
const Submission = require("../models/submission");
const Problem = require("../models/problems");
const Contest = require("../models/contest");

const postSubmission = async (req, res) => {
  try {
    const { problemId, code, language, grade, userId, testCases, results, status, contestId } = req.body;
    const submission = await Submission.create({
      problemId,
      code,
      language,
      grade,
      userId,
      status,
      submittedAt: new Date(),
      testCases,
      results,
      contestId

    });

    return res.status(201).json({ submission });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}


const getSubmission = async (req, res) => {
  try {
    // Get userId, problemId, and contestId from the request query
    const { userId, problemId, contestId } = req.query;
    const query = { userId, problemId };
    if (contestId) {
      query.contestId = contestId;
    }
    const submission = await Submission.find(query);
    return res.status(200).json({ submission });
  } catch (err) {
    // Handle any errors
    return res.status(400).json({ error: err.message });
  }
}

const getTotalGradeForContest = async (req, res) => {
  try {
    const { userId, contestId } = req.params;

    // Find the contest and its problems
    const contest = await Contest.findById(contestId);
    const problems = contest.problems;

    // Initialize total grade to 0
    let totalGrade = 0;

    // Loop through each problem and sum up the highest grades
    for (const problemId of problems) {
      const highestGrade = await getHighestGrade(userId, problemId, contestId);
      totalGrade += highestGrade;
    }

    res.status(200).json({ totalGrade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHighestGrade = async (userId, problemId, contestId) => {
  const submissions = await Submission.find({ problemId, userId, contestId });
  if (submissions.length === 0) {
    return 0;
  }
  const highestGrade = submissions.reduce((prev, current) => {
    return prev.grade > current.grade ? prev : current;
  });
  return highestGrade.grade;
}


// const getTotalGradeForContest = async (req, res) => {
//   try {
//     const { userId, contestId } = req.params;

//     // Query submissions for the student and contest
//     const submissions = await Submission.find({ userId, contestId });

//     const contest = await Contest.findById(contestId);
//     const problems = contest.problems;
//     console.log(problems);


//     // Group submissions by problem ID
//     const submissionGroups = {};
//     submissions.forEach(submission => {
//       if (!submissionGroups[submission.problemId]) {
//         submissionGroups[submission.problemId] = [];
//       }
//       submissionGroups[submission.problemId].push(submission);
//     });

//     // Calculate highest grade for each problem
//     const highestGrades = {};
//     for (const [problemId, submissions] of Object.entries(submissionGroups)) {
//       const highestGrade = Math.max(...submissions.map(submission => submission.grade));
//       highestGrades[problemId] = highestGrade;
//     }

//     // Sum highest grades for each problem
//     let totalGrade = 0;
//     for (const grade of Object.values(highestGrades)) {
//       totalGrade += grade;
//     }

//     res.status(200).json({ totalGrade });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getHighestGrade = async (userId, problemId, contestId ) => {


//   const submissions = await Submission.find({ problemId, userId, contestId });
//   if (submissions.length === 0) {
//     return 0;
//   }
//   const highestGrade = submissions.reduce((prev, current) => {
//     return prev.grade > current.grade ? prev : current;    
//   });
//   return highestGrade.grade;
// }



const getSingleSubmission = async (req, res) => {
  try {
    const { id: submissionId } = req.params;
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    return res.status(200).json({ submission });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

const isProblemSolved = async (req, res) => {
  try {
    const { userId, problemId, contestId } = req.params;

    if (!userId || !problemId) {
      return res.status(400).json({ error: 'User ID and problem ID are required' });
    }

    // Find all submissions for the user, problem, and contest
    const submissions = await Submission.find({ userId, problemId, contestId });

    if (submissions.length === 0) {
      // If no submissions found, the problem is not solved
      return res.status(200).json({ isSolved: false });
    }

    // Find the submission with the highest grade
    const highestGradeSubmission = submissions.reduce((prev, current) => {
      return prev.grade > current.grade ? prev : current;
    });

    // Retrieve the problem's details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Compare the highest grade submission with the problem's grade
    const isSolved = highestGradeSubmission.grade === problem.grade;
    return res.status(200).json({ isSolved });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}






module.exports = {
  postSubmission,
  getSubmission,
  getSingleSubmission,
  getTotalGradeForContest,
  isProblemSolved,
}