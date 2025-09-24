import React, { useState, useEffect } from "react";
import { FaFileExcel } from "react-icons/fa";
import SyncLoader from "react-spinners/ClipLoader";
import * as XLSX from "xlsx";
import { backendUrl } from "../../../config";
import { toast } from "react-toastify";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const GeneratePdf = ({ contest }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/enrollment/contest/${contest._id}/enrolled-students-grades`);
        const data = await response.json();
        setStudents(data.studentsWithGrades);
      } catch (error) {
        toast.error("Error fetching students with grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [contest._id]);

  const formatDuration = (minutes) => {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;

    let durationString = "";

    if (days > 0) {
      durationString += `${days}d `;
    }

    if (hours > 0 || days > 0) {
      durationString += `${hours}h `;
    }

    if (mins > 0 || (hours === 0 && days === 0)) {
      durationString += `${mins}m`;
    }

    return durationString.trim();
  };

  const handleGenerateExcelClick = () => {
    if (!students || students.length === 0) {
      toast.error("No students enrolled in this contest");
      return;
    }

    // Prepare the students data for the Excel sheet
    const studentsData = students.map((student) => ({
      Rank: student.rank,
      Name: student.username,
      "Reg No": student.regNo,
      Grade: parseFloat(student.totalGrade).toFixed(2),
    }));

    const contestDetails = [
      ["Contest Details"],
      ["Contest Name:", contest.name],
      ["Start Date:", new Date(contest.startDate).toLocaleString([], { month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true })],
      ["End Date:", new Date(contest.endDate).toLocaleString([], { month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true })],
      ["Duration:", formatDuration(contest.duration)],
    ];

    // Create a new workbook and append the sheets
    const workbook = XLSX.utils.book_new();
    const studentsSheet = XLSX.utils.json_to_sheet(studentsData, { header: ["Rank", "Name", "Reg No", "Grade"] });
    XLSX.utils.book_append_sheet(workbook, studentsSheet, "Students");

    const contestDetailsSheet = XLSX.utils.aoa_to_sheet(contestDetails);
    XLSX.utils.book_append_sheet(workbook, contestDetailsSheet, "Contest Details");

    // Write the workbook to a file
    XLSX.writeFile(workbook, `${contest.name}.xlsx`);
  };

  return (
    loading ? (
      <div className="fixed inset-0 bg-gray-100 opacity-50 flex justify-center items-center">
        <SyncLoader color="red" loading={true} size={120} css={override} />
      </div>
    ) : (
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
        onClick={handleGenerateExcelClick}
      >
        <FaFileExcel className="mr-2" /> Generate Report
      </button>
    )
  );
};

export default GeneratePdf;