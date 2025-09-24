const Enrollment = require('../models/enrollment');
const Student = require('../models/student');
const Submission = require('../models/submission');
const Contest = require('../models/contest');

const getEnrolledStudentsWithGrades = async (req, res) => {
  try {
    const { contestId } = req.params;
    const {
      sortField = 'totalGrade',
      sortOrder = 'desc'
    } = req.query; 

    // Find all enrollments for the given contestId
    const enrollments = await Enrollment.find({ contestId });

    // Extract student IDs from the enrollments
    const studentIds = enrollments.map(enrollment => enrollment.studentId);

    // Query the Student collection to get details of enrolled students with pagination
    const students = await Student.find({ _id: { $in: studentIds } })
      .collation({ locale: 'en', strength: 2 })
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })

    // Calculate total grades for each student in the contest
    const studentsWithGrades = await Promise.all(students.map(async (student) => {
      const contest = await Contest.findById(contestId);
      const problems = contest.problems;

      let totalGrade = 0;

      // Loop through each problem and sum up the highest grades
      for (const problemId of problems) {
        const highestGrade = await getHighestGrade(student.userId, problemId, contestId);
        totalGrade += highestGrade;
      }

      return {
        regNo: student.regNo,
        username: student.username,
        totalGrade
      };
    }));

    const rankedStudents = [...studentsWithGrades];

    rankedStudents.sort((a, b) => b.totalGrade - a.totalGrade);
    let rank = 1;
    for (let i = 0; i < rankedStudents.length; i++) {
      if (i > 0 && rankedStudents[i].totalGrade === rankedStudents[i - 1].totalGrade) {
        rankedStudents[i].rank = rankedStudents[i - 1].rank;
      } else {
        rankedStudents[i].rank = rank;
      }
      rank++;
    }

    if (sortField === 'totalGrade') {
      studentsWithGrades.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.totalGrade - b.totalGrade;
        } else {
          return b.totalGrade - a.totalGrade;
        }
      });
    }

    res.status(200).json({
      studentsWithGrades,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled students with grades' });
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


const search = async (req, res) => {
  try {
    const name = req.query.name;
    const { contestId } = req.params;
    const {
      sortField = 'totalGrade',
      sortOrder = 'desc'
    } = req.query; // Add pagination parameters

    // Find all enrollments for the given contestId
    const enrollments = await Enrollment.find({ contestId });

    // Extract student IDs from the enrollments
    const studentIds = enrollments.map(enrollment => enrollment.studentId);

    const query = { _id: { $in: studentIds } };
    if (name) {
      query.$or = [
        { username: new RegExp(name, 'i') },
        { regNo: new RegExp(name, 'i') },
      ];
    }

    // Query the Student collection to get details of enrolled students with pagination
    const students = await Student.find(query)
      .collation({ locale: 'en', strength: 2 })
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });

    // Calculate total grades for each student in the contest
    const studentsWithGrades = await Promise.all(students.map(async (student) => {
      const contest = await Contest.findById(contestId);
      const problems = contest.problems;

      let totalGrade = 0;

      // Loop through each problem and sum up the highest grades
      for (const problemId of problems) {
        const highestGrade = await getHighestGrade(student.userId, problemId, contestId);
        totalGrade += highestGrade;
      }

      return {
        regNo: student.regNo,
        username: student.username,
        totalGrade
      };
    }));

    const rankedStudents = [...studentsWithGrades];

    rankedStudents.sort((a, b) => b.totalGrade - a.totalGrade);
    let rank = 1;
    for (let i = 0; i < rankedStudents.length; i++) {
      if (i > 0 && rankedStudents[i].totalGrade === rankedStudents[i - 1].totalGrade) {
        rankedStudents[i].rank = rankedStudents[i - 1].rank;
      } else {
        rankedStudents[i].rank = rank;
      }
      rank++;
    }

    if (sortField === 'totalGrade') {
      studentsWithGrades.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.totalGrade - b.totalGrade;
        } else {
          return b.totalGrade - a.totalGrade;
        }
      });
    }

    res.status(200).json({
      studentsWithGrades,
    });
  } catch (error) {

    res.status(500).json({ error: 'Failed to fetch enrolled students with grades' });
  }
};


const getEnrolledStudents = async (req, res) => {
  try {
    const { contestId } = req.params;

    // Find all enrollments for the given contestId
    const enrollments = await Enrollment.find({ contestId });

    // Extract student IDs from the enrollments
    const studentIds = enrollments.map(enrollment => enrollment.studentId);

    // Query the Student collection to get details of enrolled students
    const enrolledStudents = await Student.find({ _id: { $in: studentIds } });

    res.status(200).json({ enrolledStudents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled students' });
  }
};

const createEnrollment = async (req, res) => {
  try {
    const { studentId, contestId } = req.body;

    // Create a new enrollment document
    const enrollment = await Enrollment.create({
      studentId,
      contestId
    });

    res.status(201).json({ enrollment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
};

const getEnrolledStudent = async (req, res) => {

  try {
    const { studentId, contestId } = req.params;
    const enrollment = await Enrollment
      .findOne({ studentId, contestId })
      .populate('studentId');
    res.status(200).json({ enrollment });
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled student' });
  }
}

const getEnrollmentTime = async (req, res) => {
  try {
    const { userId, contestId } = req.params;

    // Find the student by the user ID
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentId = student._id;

    // Find the enrollment by studentId and contestId
    const enrollment = await Enrollment.findOne({ studentId, contestId });

    if (!enrollment) {
      return res.status(301).json({ error: 'Enrollment not found' });
    }

    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    const duration = Math.min(contest.duration, (new Date(contest.endDate).getTime() - new Date(enrollment.createdAt).getTime()) / 60000)

    res.status(200).json({ createdAt: enrollment.createdAt, duration });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollment time' });
  }
};

const getEnrolledContests = async (req, res) => {
  try {
    const { userId } = req.params;
    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const contests = await Contest.find({});
    const contestIds = contests.map(contest => contest._id);
    const enrollments = await Enrollment.find({
      studentId: student._id,
      contestId: { $in: contestIds }
    }).populate('contestId');

    const currentDate = new Date();
    const availableContests = enrollments.filter(enrollment => {
      const endDate = new Date(enrollment.contestId.endDate);
      return currentDate > endDate || currentDate.getTime() > enrollment.createdAt.getTime() + enrollment.contestId.duration * 60000;
    }).map(enrollment => enrollment.contestId);

    res.status(200).json({ contests: availableContests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled contests' });
  }
};




module.exports = {
  getEnrolledStudentsWithGrades,
  getEnrolledStudents,
  createEnrollment,
  getEnrolledStudent,
  getEnrollmentTime,
  getEnrolledContests,
  search
};
