import React, { useState } from 'react';

// Define types for form data
interface FormData {
  regnumber: string;
  requestedbyId: number;
  schoolId: number;
  departmentId: number;
  assignedToId: number;
  reason: string;
  description: string;
  levelOfStudy: string;
}

const RecomandationLetter = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    regnumber: '',
    requestedbyId: 0,
    schoolId: 0,
    departmentId: 0,
    assignedToId: 0,
    reason: '',
    description: '',
    levelOfStudy: '',
  });

  // Allow errors to be string messages for each field
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Dropdown options
  const schools = [
    { id: 1, name: 'School of Science' },
    { id: 2, name: 'School of Business' },
    { id: 3, name: 'School of Arts' },
  ];

  const departments = [
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Accounting' },
    { id: 3, name: 'Physics' },
  ];

  const levelsOfStudy = [
    { value: 'Undergraduate', label: 'Undergraduate' },
    { value: 'Graduate', label: 'Graduate' },
    { value: 'PhD', label: 'PhD' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value} = e.target;
    // Convert to number for fields that expect numbers
    const numberFields = ['requestedbyId', 'schoolId', 'departmentId', 'assignedToId'];
    setFormData({
      ...formData,
      [name]: numberFields.includes(name)
        ? value === '' ? 0 : Number(value)
        : value,
    });
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.regnumber) newErrors.regnumber = 'Registration Number is required';
    if (!formData.requestedbyId)
      newErrors.requestedbyId = 'Requested By ID is required';
    if (!formData.schoolId) newErrors.schoolId = 'School ID is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department ID is required';
    if (!formData.assignedToId) newErrors.assignedToId = 'Assigned To ID is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2); // Move to form step
    } else if (currentStep === 2 && validateStep2()) {
      console.log('Form submitted:', formData);
      alert('Document request submitted successfully!');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {/* <div className="w-1/4 bg-[#00A1DE] text-white p-6 flex flex-col justify-center items-center">
        <img src="/path-to-logo.png" alt="MINUZA Logo" className="w-32 mb-4" />
        <h2 className="text-xl font-bold">Welcome</h2>
        <p className="text-sm text-center mt-2">
          Provide your info and manage everything with a single tap
        </p>
      </div> */}

      {/* Main Content */}
      <div className="w-3/4 h-auto p-6 flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4">Request Recommendation Letter</h1>
        <p className="text-gray-500 mb-6">Follow the steps below to request your document.</p>

        {/* Timeline / Step Indicator */}
        <div className="mb-8 flex items-center justify-between max-w-md ">
          <button
            onClick={() => setCurrentStep(1)}
            className={`px-4 py-2 rounded-full ${
              currentStep === 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Document Info
          </button>
          <div className="flex-grow border-t-2 border-gray-300 mx-2"></div>
          <button
            onClick={() => setCurrentStep(2)}
            disabled={currentStep < 2}
            className={`px-4 py-2 rounded-full ${
              currentStep === 2
                ? 'bg-green-600 text-white'
                : currentStep > 1
                ? 'bg-gray-200 text-gray-700 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Request Form
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md  space-y-6">
          {/* Step 1: Document Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">About the Recommendation Letter</h2>
              <p className="text-gray-700">
                A recommendation letter is a formal document written by a faculty member or employer that verifies your skills, performance, character, and achievements.
              </p>
              <p className="text-gray-700">
                Please make sure you understand the requirements before submitting your request.
              </p>
              <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Next: Fill Request Form
              </button>
            </div>
          )}

          {/* Step 2: Request Form */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Registration Number */}
              <div>
                <label htmlFor="regnumber" className="block text-sm font-medium">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="regnumber"
                  name="regnumber"
                  value={formData.regnumber}
                  onChange={handleChange}
                  placeholder="E.g. REG123456"
                  className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                    errors.regnumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.regnumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.regnumber}</p>
                )}
              </div>

              {/* Requested By ID */}
              {/* <div>
                <label htmlFor="requestedbyId" className="block text-sm font-medium">
                  Requested By ID
                </label>
                <input
                  type="number"
                  id="requestedbyId"
                  name="requestedbyId"
                  value={formData.requestedbyId || ''}
                  onChange={handleChange}
                  placeholder="Enter ID"
                  className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                    errors.requestedbyId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.requestedbyId && (
                  <p className="text-red-500 text-xs mt-1">{errors.requestedbyId}</p>
                )}
              </div> */}

              {/* School ID */}
              {/* <div>
                <label htmlFor="schoolId" className="block text-sm font-medium">
                  School
                </label>
                <select
                  id="schoolId"
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                    errors.schoolId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select School</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                {errors.schoolId && (
                  <p className="text-red-500 text-xs mt-1">{errors.schoolId}</p>
                )}
              </div> */}

              {/* Department ID */}
              {/* <div>
                <label htmlFor="departmentId" className="block text-sm font-medium">
                  Department
                </label>
                <select
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                    errors.departmentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>
                )}
              </div> */}

              {/* Assigned To ID */}
                <div>
                <label htmlFor="assignedToId" className="block text-sm font-medium">
                  Assigned To
                </label>
                <select
                  id="assignedToId"
                  name="assignedToId"
                  value={formData.assignedToId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none ${
                  errors.assignedToId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Person</option>
                  {/* Example options, replace with real data as needed */}
                  <option value={1}>Dr. John Doe</option>
                  <option value={2}>Prof. Jane Smith</option>
                  <option value={3}>Ms. Emily Brown</option>
                </select>
                {errors.assignedToId && (
                  <p className="text-red-500 text-xs mt-1">{errors.assignedToId}</p>
                )}
                </div>

              {/* Reason */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium">
                  Reason
                </label>
                <input
                  type="text"
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="For scholarship application"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none border-gray-300"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Need it urgently"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none border-gray-300"
                ></textarea>
              </div>

              {/* Level of Study */}
              <div>
                <label htmlFor="levelOfStudy" className="block text-sm font-medium">
                  Level of Study
                </label>
                <select
                  id="levelOfStudy"
                  name="levelOfStudy"
                  value={formData.levelOfStudy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none border-gray-300"
                >
                  <option value="">Select Level</option>
                  {levelsOfStudy.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-2 mt-4 text-white bg-green-800 rounded-lg hover:bg-green-700"
              >
                Submit Request
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RecomandationLetter;