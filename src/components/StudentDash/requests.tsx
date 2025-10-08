import { useState } from "react";

const RequestNewDocument: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const [selectedDocType, setSelectedDocType] = useState({ type: "", price: 0 });
  const [requestReason, setRequestReason] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Sample data for previous requests
  const myRequests = [
    { document: "Year 1 transcript", date: "May 19, 2025" },
    { document: "Recommendation letter", date: "May 18, 2025" },
    { document: "Clearance letter", date: "May 17, 2025" },
  ];

  const documentOptions = [
    { value: "transcript", label: "Transcript", price: 5000 },
    { value: "recommendation", label: "Recommendation Letter", price: 5000 },
    { value: "clearance", label: "Clearance Letter", price: 7000 },
    { value: "certificate", label: "Certificate", price: 12000 },
  ];

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: "📊", active: false },
    { name: "My Request", icon: "📝", active: true },
    { name: "Archives", icon: "📁", active: false },
    { name: "Certificates", icon: "🎓", active: false },
  ];

  // Handle file upload
  const handleFileChange = (e: any) => {
    if (e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log({
      documentType: selectedDocType,
      requestReason,
      uploadedFile,
    });
    // Add API call here to submit the request
  };
  if (onSuccess) onSuccess();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static md:translate-x-0 z-30 w-64 md:w-1/5 lg:w-1/6 h-full bg-gradient-to-b from-blue-500 to-blue-600 text-white flex flex-col transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 mb-6 flex justify-center">
          <div className="bg-blue-400 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
            UR
          </div>
        </div>

        {/* Navigation menu */}
        <div className="flex-1 px-2">
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`my-2 py-3 px-4 rounded-md flex items-center ${
                item.active
                  ? "bg-blue-300 bg-opacity-30"
                  : "hover:bg-blue-400 hover:bg-opacity-30"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="text-sm md:text-base">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Logout button */}
        <div className="p-6">
          <div className="flex items-center text-blue-200">
            <span className="mr-2">↪</span>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-3 md:p-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="mr-4 text-gray-500 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>

            <div className="mr-4 hidden sm:block">
              <img
                src="/api/placeholder/40/40"
                alt="Logo"
                className="h-8 md:h-10"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-32 xs:w-48 sm:w-64 bg-gray-50 px-3 py-1.5 rounded-full text-sm"
              />
              <span className="absolute right-3 top-1.5 text-gray-400 text-sm">
                🔍
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <span className="text-blue-500 hidden xs:inline">🔄</span>
            <span className="text-blue-500">🔔</span>
            <span className="text-blue-500 hidden sm:inline">💬</span>
            <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>
            <span className="text-blue-500">👤</span>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-medium mb-4 md:mb-6">
            Request New Document
          </h1>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
            <button className="bg-blue-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center text-sm">
              <span className="mr-1">+</span> New
            </button>
            <button className="border border-gray-300 px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center text-sm">
              <span className="mr-1">🎚️</span> Filter
            </button>
            <button className="border border-gray-300 px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center text-sm ml-auto">
              <span className="mr-1">≡</span>
              <span className="hidden xs:inline">Sort By:</span> Latest
            </button>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-6">Select Document Type</h2>

              <div>
                {/* Document Type Selector */}
                {/* <div className="mb-6">
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Document Type
                    </option>
                    <option value="transcript">Transcript</option>
                    <option value="recommendation">
                      Recommendation Letter
                    </option>
                    <option value="clearance">Clearance Letter</option>
                    <option value="certificate">Certificate</option>
                  </select>
                </div> */}

                <div className="mb-6">
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={JSON.stringify(selectedDocType)} // store as JSON string
                    onChange={(e) =>
                      setSelectedDocType(JSON.parse(e.target.value))
                    }
                  >
                    <option value="" disabled>
                      Select Document Type
                    </option>
                    {documentOptions.map((doc) => (
                      <option
                        key={doc.value}
                        value={JSON.stringify({
                          type: doc.value,
                          price: doc.price,
                        })}
                      >
                        {doc.label} - ${doc.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reason Text Area */}
                <div className="mb-6">
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-32"
                    placeholder="Why you need this Document (optional)"
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                  ></textarea>
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <p className="font-medium mb-3">
                    Upload your payment receipt{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <div className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-center cursor-pointer hover:bg-gray-50">
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        ></path>
                      </svg>
                      Upload the payment receipt
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf"
                    />
                  </div>
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      {/* File uploaded: {uploadedFile.name} */}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>

            {/* My Requests */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-6">My Request</h2>

              <div className="border rounded-lg overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-2 bg-gray-50 p-4 border-b font-medium">
                  <div>document</div>
                  <div className="text-right">date</div>
                </div>

                {/* Table content */}
                {myRequests.map((request, index) => (
                  <div key={index} className="grid grid-cols-2 p-4 border-b">
                    <div className="font-medium">{request.document}</div>
                    <div className="text-right text-gray-500">
                      {request.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-gray-500 italic">
            <p>Request will be reviewed by</p>
            <p>your school administrator</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestNewDocument;
