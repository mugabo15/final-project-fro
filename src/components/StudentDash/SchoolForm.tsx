import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import PaymentModal from "./PaymentForm";

interface DecodedToken {
  id: number;
  exp: number;
}

export enum DocumentTypeEnum {
  TRANSCRIPT = "transcript",
  RECOMMENDATION = "recommendation",
  TO_WHOM = "to whom",
  CERTIFICATE_OF_ATTENDANCE = "certificate of attendance",
  PROOF_OF_ENGLISH = "proof of english",
  INTERNSHIP = "internship",
  DEGREE_DIPLOMA = "degree diploma",
}

const DocumentRequestForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    documentType: "transcript",
    price: 1000,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    documentId: 0,
    price: 0,
    documentType: "",
  });

  const documentOptions = [
    { value: DocumentTypeEnum.TRANSCRIPT, label: "Transcript", price: 1000 },
    {
      value: DocumentTypeEnum.RECOMMENDATION,
      label: "Recommendation Letter",
      price: 5000,
    },
    {
      value: DocumentTypeEnum.TO_WHOM,
      label: "To Whom It May Concern",
      price: 2000,
    },
    {
      value: DocumentTypeEnum.CERTIFICATE_OF_ATTENDANCE,
      label: "Certificate of Attendance",
      price: 3000,
    },
    {
      value: DocumentTypeEnum.PROOF_OF_ENGLISH,
      label: "Proof of English",
      price: 4000,
    },
    {
      value: DocumentTypeEnum.INTERNSHIP,
      label: "Internship Letter",
      price: 6000,
    },
    {
      value: DocumentTypeEnum.DEGREE_DIPLOMA,
      label: "Degree/Diploma",
      price: 10000,
    },
  ];

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        navigate("/login");
        return;
      }
    } catch (err) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "documentType") {
      const selected = JSON.parse(value);
      setFormData((prev) => ({
        ...prev,
        documentType: selected.type,
        price: selected.price,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("⚠️ You must be logged in to submit this form.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const userId = (jwtDecode(token) as DecodedToken).id;
      console.log("form data", formData);
      const response = await axios.post(
        `http://localhost:7000/recomandation-request/${userId}`,
        {
          ...formData,
          // date: new Date(formData.date).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response &&&&&&&&&&&&&", response.data);

      // Open payment modal with document details
      setPaymentModal({
        isOpen: true,
        documentId: response.data.id || Date.now(),
        price: formData.price,
        documentType: formData.documentType,
      });

      setMessage("✅ Document request submitted successfully!");
      toast.success("Document request submitted successfully!");

      // Reset form
      setFormData({
        documentType: "transcript",
        // date: "",
        // program: "",
        // level: "",
        // courseName: "",
        price: 1000,
      });

      // if (onSuccess) onSuccess();
    } catch (error: any) {
      setMessage(
        `❌ Failed to submit document request. ${
          error.response?.data?.message || ""
        }`
      );
      toast.error(`${error.response?.data?.message || "Submission failed."}`);
    } finally {
      setLoading(false);
    }
  };

  const closePaymentModal = () => {
    setPaymentModal({
      isOpen: false,
      documentId: 0,
      price: 0,
      documentType: "",
    });
  };

  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Document Request
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              name="documentType"
              value={JSON.stringify({
                type: formData.documentType,
                price: formData.price,
              })}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {documentOptions.map((doc) => (
                <option
                  key={doc.value}
                  value={JSON.stringify({ type: doc.value, price: doc.price })}
                >
                  {doc.label} - {doc.price.toLocaleString()} RWF
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            {/* <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program
              </label>
              <input
                type="text"
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}
            {/* <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <input
                type="text"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div> */}

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium w-full transition-colors"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes("successfully")
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
        </form>
      </div>

      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={closePaymentModal}
        documentId={paymentModal.documentId}
        price={paymentModal.price}
        documentType={paymentModal.documentType}
      />
    </>
  );
};

export default DocumentRequestForm;
