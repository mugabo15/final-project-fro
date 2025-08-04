import React, { useRef, useEffect, useState, useCallback } from "react";
import ur from "../../assets/UR.png";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { request } from "http";

interface TranscriptProps {
    data: {
        id: number;
        program: string;
        referenceNo: string;
        yearOfStudyName: string;
        yearOfStudyYear: string | number;
        hodSignatureImage?: string;
        deanSignatureImage?: string;
        schoolStampImage?: string;
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

interface StudentInfo {
    fullNames: string;
    passphoto: string;
    department: string;
    school: string;
}

interface DecodedToken {
    id: string;
    exp: number;
    [key: string]: any;
}

// API Configuration - you can move this to a separate config file
const API_BASE_URL = "http://localhost:7000";

const TranscriptDesign: React.FC<TranscriptProps> = ({ data }) => {
    const printRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    
    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Enhanced authentication check
    const getAuthToken = useCallback((): string | null => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return null;
        }

        try {
            const decodedToken = jwtDecode<DecodedToken>(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('requestId');
                navigate('/login');
                return null;
            }
            return token;
        } catch (error) {
            console.error('Token validation error:', error);
            localStorage.removeItem('authToken');
            navigate('/login');
            return null;
        }
    }, [navigate]);

    // Improved API call with better error handling
    const fetchStudentInfo = useCallback(async () => {
        const token = getAuthToken();
        if (!token) return;

        const requestId = localStorage.getItem("requestId");
        if (!requestId) {
            toast.error("Request ID not found");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/transcript-request/transcript/${requestId}`,
                {
                    headers: {
                        'Content-Type': 'application/json', // Fixed content type
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            setStudentInfo({
                fullNames: json.fullNames,
                passphoto: json.passphoto,
                department: json.department?.name || '',
                school: json.school?.name || ''
            });
        } catch (error) {
            console.error("Failed to fetch student info:", error);
            toast.error("Failed to load student information");
        } finally {
            setIsLoading(false);
        }
    }, [getAuthToken]);

    useEffect(() => {
        fetchStudentInfo();
    }, [fetchStudentInfo]);

    // Enhanced dean approval with better error handling
    const handleDeanApprove = async () => {
        const token = getAuthToken();
        if (!token) return;

        const requestId = localStorage.getItem("requestId");
        if (!requestId) {
            toast.error("Request ID not found");
            return;
        }

        setIsApproving(true);
        try {
            const decodedToken = jwtDecode<DecodedToken>(token);
            const userId = decodedToken?.id;

            if (!userId) {
                throw new Error("User ID not found in token");
            }

            const payload = {
                requestId: Number(requestId),
                transcriptId: Number(data.id),
            };

            const response = await fetch(
                `${API_BASE_URL}/transcript-request/transcript/dean-approve/${userId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Approval failed");
            }

            toast.success("Transcript successfully approved by Dean.");
            // Refresh student info after approval
            await fetchStudentInfo();
        } catch (error: any) {
            console.error("Dean approval error:", error);
            toast.error(`Approval failed: ${error.message}`);
        } finally {
            setIsApproving(false);
        }
    };

    // Enhanced PDF generation with performance monitoring
 const generatePDFAndUpload = async () => {
    if (!printRef.current) {
        toast.error("Transcript content not found");
        return;
    }

    const token = getAuthToken();
    if (!token) return;

    setIsGeneratingPDF(true);
    const startTime = Date.now();

    try {
        // Step 1: Capture screenshot
        toast.info("Capturing transcript...", { autoClose: 2000 });
        const captureStart = Date.now();

        const canvas = await html2canvas(printRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            imageTimeout: 5000,
            removeContainer: true
        });

        console.log(`Screenshot captured in ${Date.now() - captureStart}ms`);

        // Step 2: Create single-page PDF
        toast.info("Creating PDF...", { autoClose: 2000 });
        const pdfStart = Date.now();

        const imgData = canvas.toDataURL("image/jpeg", 0.9);
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
        const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

        const imgProps = pdf.getImageProperties(imgData);
        const imgRatio = imgProps.width / imgProps.height;
        const a4Ratio = pdfWidth / pdfHeight;

        let imgWidth: number;
        let imgHeight: number;

        if (imgRatio > a4Ratio) {
            // Image is wider relative to A4 -> fit width
            imgWidth = pdfWidth;
            imgHeight = pdfWidth / imgRatio;
        } else {
            // Image is taller -> fit height
            imgHeight = pdfHeight;
            imgWidth = pdfHeight * imgRatio;
        }

        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;

        pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);

        const blob = pdf.output("blob");
        console.log(`PDF created in ${Date.now() - pdfStart}ms, size: ${(blob.size / 1024).toFixed(2)}KB`);

        // Step 3: Upload
        toast.info("Uploading PDF...", { autoClose: 3000 });
        const uploadStart = Date.now();
        const requestId = localStorage.getItem("requestId");
        const formData = new FormData();
        formData.append("fileurl", blob, `transcript_${data.referenceNo}.pdf`);

        await axios.patch(
            `${API_BASE_URL}/transcript-request/transcript/upload-file/${requestId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                timeout: 30000,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        console.log(`Upload progress: ${percentCompleted}%`);
                    }
                }
            }
        );

        console.log(`Upload completed in ${Date.now() - uploadStart}ms`);
        const totalTime = Date.now() - startTime;
        toast.success(`PDF generated and uploaded successfully! (${(totalTime / 1000).toFixed(1)}s)`);

    } catch (error: any) {
        console.error("PDF generation or upload failed", error);
        const totalTime = Date.now() - startTime;

        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            toast.error(`Upload timeout after ${(totalTime / 1000).toFixed(1)}s. Please try again.`);
        } else if (error.response?.status === 413) {
            toast.error("File too large. Please try with a smaller transcript.");
        } else {
            toast.error(`Failed after ${(totalTime / 1000).toFixed(1)}s: ${error.message}`);
        }
    } finally {
        setIsGeneratingPDF(false);
    }
};



    // Enhanced print function
    const handleExport = () => {
        if (!printRef.current) {
            toast.error("Transcript content not found");
            return;
        }

        try {
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                throw new Error("Popup blocked");
            }

            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Transcript - ${studentInfo?.fullNames || ''}</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; }
                        @media print { body { margin: 0; padding: 0; } }
                        .no-print { display: none !important; }
                    </style>
                </head>
                <body>
                    ${printRef.current.innerHTML}
                </body>
                </html>
            `;

            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        } catch (error) {
            console.error("Print failed:", error);
            toast.error("Failed to open print dialog");
        }
    };

    if (!data) {
        return (
            <div className="bg-white text-black p-6 font-serif max-w-4xl mx-auto text-center">
                <p className="text-lg font-semibold">No transcript data available.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-white text-black p-6 font-serif max-w-4xl mx-auto text-center">
                <p className="text-lg font-semibold">Loading transcript data...</p>
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

    return (
        <div>
            <div ref={printRef} className="w-[794px] min-h-[1123px] bg-white p-10">
                {/* Header */}
                <div className="bg-white text-black p-6 border font-serif max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
                    <div className="flex items-start mb-2 border-b-2 border-gray-400">
                        <div className="w-24 h-24">
                            <img src={ur} alt="University of Rwanda Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 text-center">
                            <h1 className="text-lg font-bold mb-1">UNIVERSITY OF RWANDA</h1>
                            <h2 className="text-base font-bold mb-2">COLLEGE OF SCIENCE AND TECHNOLOGY</h2>
                        </div>
                    </div>
                    
                    <div className="text-center py-2 mb-2">
                        <h3 className="text-sm font-bold">{studentInfo?.school?.toUpperCase() || ''}</h3>
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
                                <p className="text-sm mb-1">
                                    <strong>DEPARTMENT:</strong> {studentInfo?.department?.toUpperCase() || ''}
                                </p>
                                <p className="text-sm mb-2">
                                    <strong>PROGRAM:</strong> BSc {studentInfo?.department?.toUpperCase() || ''}
                                </p>
                                
                                <div className="flex mb-2">
                                    <div className="w-full">
                                        <table className="w-full border border-gray-400">
                                            <thead>
                                                <tr>
                                                    <th className="border border-gray-400 px-2 py-1 text-sm font-semibold bg-gray-100">Name</th>
                                                    <th className="border border-gray-400 px-2 py-1 text-sm font-semibold bg-gray-100">Reference Number</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="border border-gray-400 px-2 py-1 text-sm">
                                                        {studentInfo?.fullNames?.toUpperCase() || ''}
                                                    </td>
                                                    <td className="border border-gray-400 px-2 py-1 text-sm">{referenceNo}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-24 h-32 flex-shrink-0 flex items-center justify-center ml-4">
                            {studentInfo?.passphoto ? (
                                <img
                                    src={studentInfo.passphoto}
                                    alt="Student Photo"
                                    className="w-full h-full object-cover border border-gray-400"
                                />
                            ) : (
                                <div className="w-full h-full border border-gray-400 flex items-center justify-center">
                                    <span className="text-xs text-gray-500">Photo</span>
                                </div>
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
                                    <th className="border border-gray-400 px-2 py-1 text-xs font-semibold">MODULE CODE & NAME</th>
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
                            <tbody>
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
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Signatures */}
                    <div className="flex justify-between mt-8 text-xs">
                        <div className="text-left">
                            <div className="mb-8">
                                {data?.hodSignatureImage && (
                                    <img src={data.hodSignatureImage} alt="HOD Signature" className="w-20 h-12 object-contain mb-2" />
                                )}
                            </div>
                            <p className="font-semibold">HOD</p>
                            <p>DEPARTMENT OF {studentInfo?.department?.toUpperCase() || ''}</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="mb-4">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {data?.schoolStampImage && (
                                        <img src={data.schoolStampImage} alt="School Stamp" className="w-16 h-16 object-contain" />
                                    )}
                                    {data?.deanSignatureImage && (
                                        <img src={data.deanSignatureImage} alt="Dean Signature" className="w-20 h-12 object-contain" />
                                    )}
                                </div>
                            </div>
                            <p className="font-semibold">DEAN</p>
                            <p>{studentInfo?.school?.toUpperCase() || ''}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between mt-4 gap-4">
                <button
                    onClick={handleExport}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={isLoading}
                >
                    Export / Print
                </button>

                <button
                    onClick={handleDeanApprove}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                    disabled={isApproving || isLoading}
                >
                    {isApproving ? 'Approving...' : 'Dean Approve'}
                </button>
                
                <button
                    onClick={generatePDFAndUpload}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
                    disabled={isGeneratingPDF || isLoading}
                >
                    {isGeneratingPDF ? 'Generating...' : 'Generate & Upload PDF'}
                </button>
            </div>
        </div>
    );
};

export default TranscriptDesign;