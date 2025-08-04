import React, { useRef, useEffect, useState } from "react";
import ur from "../../assets/UR.png";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";


interface TranscriptProps {
    data: {
        id: number;
        program: string;
        referenceNo: string;
        yearOfStudyName: string;
        yearOfStudyYear: string | number;
        hodSignatureImage?: string;
        schoolStampImage?: string;
        deanSignatureImage?: string;
        marks: {
            semesters: {
                semester1: Record<string, { credit: number; mark: number; grade: string }>;
                semester2: Record<string, { credit: number; mark: number; grade: string }>;
            };
            totalCredits: number;
            annualAverage: number;
            currentFailedModules: string[];
            remark: string;
        };
    };
    studentName?: string;
    department?: string;
    school?: string;
    transcriptId?: string;
}

const TranscriptDesign: React.FC<TranscriptProps> = ({
    data
}) => {
    const printRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();


    // State for student info
    type StudentInfo = {
        fullNames: string;
        passphoto: string;
        department: string;
        school: string;
    };
    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
    const token = localStorage.getItem('authToken');
    if (!token) {
        navigate('/login');
        return;
    }
    const handleHODApprove = async () => {
            const token = localStorage.getItem("authToken");
            const requestId = localStorage.getItem("requestId");
            const transcriptId = data.id;
    
            if (!token) {
                alert("No authentication token found. Please log in again.");
                navigate('/login');
                return;
            }
    
            try {
                const decodedToken: any = jwtDecode(token);
                const userId = decodedToken?.id;
    
                // Example payload data, adjust as needed
                const payload = {
                requestId: Number(requestId),
                transcriptId: Number(transcriptId),
                
                };
    
                const res = await fetch(`http://localhost:7000/transcript-request/transcript/hod-approve/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
                });
    
                if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Approval failed");
                }
    
                // alert("Transcript successfully approved by Dean.");
                // Use toast instead of alert
                toast.success("Transcript successfully approved by Dean.");
            } catch (error: any) {
                console.error("Dean approval error:", error);
                toast.error(`Approval failed: ${error.message}`);
            }
        };
    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const requestId = localStorage.getItem("requestId");
                if (!requestId) return;
                const res = await fetch(`http://localhost:7000/transcript-request/transcript/${requestId}`, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) return;
                const json = await res.json();
                setStudentInfo({ fullNames: json.fullNames, passphoto: json.passphoto, department: json.department.name, school: json.school.name });
                console.log("Student Info:", json);

            } catch (err) {
                // handle error
            }
        };
        fetchStudentInfo();
    }, []);

    if (!data) {
        return (
            <div className="bg-white text-black p-6 font-serif max-w-4xl mx-auto text-center">
                <p className="text-lg font-semibold">No transcript data available.</p>
            </div>
        );
    }

    const {

        referenceNo,
        yearOfStudyName,
        yearOfStudyYear,
        marks
    } = data;

    const semesters = marks?.semesters || { semester1: {}, semester2: {} };
    const totalCredits = marks?.totalCredits ?? 0;
    const annualAverage = marks?.annualAverage ?? 0;
    const currentFailedModules = marks?.currentFailedModules ?? [];
    const remark = marks?.remark ?? "";

    const semester1Modules = Object.entries(semesters.semester1 || {});
    const semester2Modules = Object.entries(semesters.semester2 || {});
    const maxRows = Math.max(semester1Modules.length, semester2Modules.length);

    const renderCombinedModules = () => {
        const rows = [];
        for (let i = 0; i < maxRows; i++) {
            const sem1Module = semester1Modules[i];
            const sem2Module = semester2Modules[i];

            rows.push(
                <tr key={i} className="border border-gray-400">
                    {/* First Semester */}
                    <td className="border border-gray-400 px-2 py-1 text-sm">
                        {sem1Module ? sem1Module[0] : ''}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-sm text-center">
                        {sem1Module ? sem1Module[1].credit : ''}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-sm text-center">
                        {sem1Module ? sem1Module[1].mark.toFixed(2) : ''}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-sm text-center font-semibold">
                        {sem1Module ? sem1Module[1].grade : ''}
                    </td>
                    {/* Second Semester */}
                    <td className="border border-gray-400 px-2 py-1 text-sm">
                        {sem2Module ? sem2Module[0] : ''}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-sm text-center">
                        {sem2Module ? sem2Module[1].credit : ''}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-sm text-center">
                        {sem2Module ? sem2Module[1].mark.toFixed(2) : ''}
                    </td>
                    <td className="border border-gray-400 px-2 py-1 text-sm text-center font-semibold">
                        {sem2Module ? sem2Module[1].grade : ''}
                    </td>
                </tr>
            );
        }
        return rows;
    };

    const handleExport = () => {
        if (!printRef.current) return;
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    return (
        <div>

            <div ref={printRef}>
                {/* Header */}
                <div className="bg-white text-black p-6 border font-serif max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
                    <div className="flex items-start mb-2 border-b-2 border-gray-400 ">
                        <div className="w-24 h-24">
                            <img src={ur} alt="" />
                        </div>
                        <div className="flex-1 text-center">
                            <h1 className="text-lg font-bold mb-1">UNIVERSITY OF RWANDA</h1>
                            <h2 className="text-base font-bold mb-2">COLLEGE OF SCIENCE AND TECHNOLOGY</h2>
                        </div>
                    </div>
                    <div className="text-center py-2 mb-2">
                        <h3 className="text-sm font-bold">{studentInfo?.school.toUpperCase()}</h3>
                    </div>
                    <div className="flex justify-between mb-2">
                        <div className="flex-1">
                            {/* Document Title */}
                            <div className="mb-2">
                                <h4 className="text-sm font-bold">PROVISIONAL STATEMENT OF RESULTS</h4>
                                <h4 className="text-sm">UR/CST/SoICT/IS/{new Date().getFullYear()}</h4>
                            </div>
                            {/* Student Info */}
                            <div className="mb-2">
                                <p className="text-sm mb-1"><strong>DEPARTMENT:</strong> {studentInfo ? studentInfo.department.toUpperCase() : ""}</p>
                                <p className="text-sm mb-2"><strong>PROGRAM:</strong> BSc {studentInfo ? studentInfo.department.toUpperCase() : ""}</p>
                                <div className="flex mb-2">
                                    <div className="w-full">
                                        <table className="w-full border border-gray-400">
                                            <tr>
                                                <td className="border border-gray-400 px-2 py-1 text-sm font-semibold bg-gray-100">Name</td>
                                                <td className="border border-gray-400 px-2 py-1 text-sm font-semibold bg-gray-100">Reference Number</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-2 py-1 text-sm">
                                                    {studentInfo?.fullNames ? studentInfo.fullNames.toUpperCase() : ""}
                                                </td>
                                                <td className="border border-gray-400 px-2 py-1 text-sm">{referenceNo}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="">
                                    <table className="w-full border border-gray-400"></table>
                                </div>
                            </div>
                        </div>
                        <div className="w-24 h-32 flex-shrink-0 flex items-center justify-center">
                            {studentInfo?.passphoto ? (
                                <img
                                    src={studentInfo.passphoto}
                                    alt="Student"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs text-gray-500">Photo</span>
                            )}
                        </div>
                    </div>
                    {/* Academic Results */}
                    <div className="mb-2">
                        <table className="w-full border border-gray-400">
                            <thead>
                                <tr>
                                    <td colSpan={8} className="text-sm font-semibold bg-gray-100">
                                        <div className="flex justify-between w-full px-2 py-1">
                                            <span className="text-start">{yearOfStudyName}</span>
                                            <span className="text-end">{yearOfStudyYear}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="bg-gray-100">
                                    <th colSpan={4} className="border border-gray-400 px-2 py-1 text-sm font-semibold">FIRST TRIMESTER</th>
                                    <th colSpan={4} className="border border-gray-400 px-2 py-1 text-sm font-semibold">SECOND TRIMESTER</th>
                                </tr>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-400 px-2 py-1 text-xs font-semibold">MODULE CODENAME</th>
                                    <th className="border border-gray-400 px-2 py-1 text-xs font-semibold">CREDIT</th>
                                    <th className="border border-gray-400 px-2 py-1 text-xs font-semibold">MARKS</th>
                                    <th className="border border-gray-400 px-2 py-1 text-xs font-semibold">GRADE</th>
                                    <th className="border border-gray-400 px-2 py-1 text-xs font-semibold">MODULE CODENAME</th>
                                    <th className="border border-gray-400 px-2 py-1 text-xs font-semibold">CREDIT</th>
                                    <th className="border border-gray-400 px-2 py-1 text-xs font-semibold">MARKS</th>
                                    <th className="border border-gray-400 px-2 py-1 text-xs font-semibold">GRADE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderCombinedModules()}
                            </tbody>
                        </table>
                    </div>
                    {/* Summary */}
                    <div className="mb-2">
                        <table className="w-full border border-gray-400">
                            <tr>
                                <td className="border border-gray-400 px-2 py-1 text-sm font-semibold bg-gray-100">Total Credit</td>
                                <td className="border border-gray-400 px-2 py-1 text-sm text-center">{totalCredits}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-400 px-2 py-1 text-sm font-semibold bg-gray-100">Annual Average Marks (%)</td>
                                <td className="border border-gray-400 px-2 py-1 text-sm text-center">{annualAverage.toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-400 px-2 py-1 text-sm font-semibold bg-gray-100">Failed Modules to RETAKE</td>
                                <td className="border border-gray-400 px-2 py-1 text-sm text-center">
                                    {currentFailedModules.length > 0 ? currentFailedModules.join(", ") : "None"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-400 px-2 py-1 text-sm font-semibold bg-gray-100">Remarks</td>
                                <td className="border border-gray-400 px-2 py-1 text-sm text-center">{remark}</td>
                            </tr>
                        </table>
                    </div>
                    {/* Signatures */}
                    <div className="flex justify-between mt-8 text-xs">
                        <div className="">
                            <div className="mb-8"></div>
                            <p>HOD</p>
                            <p>DEPARTMENT OF {studentInfo?.department ? studentInfo.department.toUpperCase() : ""}</p>
                            {/* <p>{new Date().toLocaleDateString()}</p> */}
                            <div>
                                {data?.hodSignatureImage ? (
                                    <img src={data?.hodSignatureImage} alt="HOD Signature" className="w-20 h-20 object-cover" />
                                ) : (
                                    <span className="text-xs text-gray-500">No Signature</span>
                                )}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="mb-2">
                                <p>DEAN</p>
                            <p>{studentInfo?.school}</p>
                                <div className="w-28 h-28 flex items-center justify-center mb-2">
                                    {data?.schoolStampImage ? (
                                        <img src={data.schoolStampImage} alt="School Stamp" className="w-20 h-20 object-cover" />
                                    ) : (
                                        <span className="text-xs text-gray-500 mr-2">No Stamp</span>
                                    )}
                                    {data?.deanSignatureImage ? (
                                        <img src={data.deanSignatureImage} alt="Dean Signature" className="w-20 h-20 object-cover" />
                                    ) : (
                                        <span className="text-xs text-gray-500 ml-2">No Dean Signature</span>
                                    )}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-4">

                <button
                    onClick={handleExport}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Export / Print
                </button>
                <button onClick={handleHODApprove} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Approve</button>

            </div>
        </div>
    );
};

export default TranscriptDesign;