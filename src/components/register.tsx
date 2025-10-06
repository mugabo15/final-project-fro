import { useEffect, useState } from "react";
import { data } from "react-router-dom";
import { toast } from "react-toastify";

interface Campus {
  id: number;
  name: string;
}
interface Faculty {
  id: number;
  name: string;
}
interface Department {
  id: number;
  name: string;
}

interface FormData {
  regNumber: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  gender: string;
  // idCardNumber: string;
  // nationality: string;
  // dateOfBirth: string;
  // registrationDate: string;
  email: string;
  password: string;
  confirmPassword: string;
  campusId: string;
  schoolId: string;
  departmentId: string;
  phoneNumber: string;
  // level: string;
  // program: string;
}

interface Errors {
  [key: string]: string | undefined;
}

const SignUpForm = () => {
  const [formData, setFormData] = useState<FormData>({
    regNumber: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    gender: "",
    // idCardNumber: "",
    // nationality: "",
    // dateOfBirth: "",
    // registrationDate: "",
    email: "",
    password: "",
    confirmPassword: "",
    campusId: "",
    schoolId: "",
    departmentId: "",
    phoneNumber: "",
    // level: "",
    // program: "",
  });

  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch campuses on mount
  useEffect(() => {
    fetch("http://localhost:7000/settings")
      .then((res) => res.json())
      .then((data) => {
        // The response is an array of campus objects
        setCampuses(
          Array.isArray(data)
            ? data.map((c: any) => ({ id: c.id, name: c.name }))
            : []
        );
      })
      .catch(() => setCampuses([]));
  }, []);

  // Fetch faculties when campus changes
  useEffect(() => {
    if (formData.campusId) {
      fetch(
        `http://localhost:7000/settings/all/faculties?campusId=${formData.campusId}`
      )
        .then((res) => res.json())
        .then((data) => {
          // If the API returns an array of faculties, use it directly
          // If it returns an object with a 'faculties' property, use that
          let facultiesList: Faculty[] = [];
          if (Array.isArray(data)) {
            facultiesList = data.map((f: any) => ({
              id: f.id,
              name: f.name,
            }));
          } else if (Array.isArray(data.faculties)) {
            facultiesList = data.faculties.map((f: any) => ({
              id: f.id,
              name: f.name,
            }));
          }
          setFaculties(facultiesList);
        })
        .catch(() => setFaculties([]));
    } else {
      setFaculties([]);
      setDepartments([]);
    }
    setFormData((f) => ({ ...f, schoolId: "", departmentId: "" }));
  }, [formData.campusId]);

  // Fetch departments when faculty changes
  useEffect(() => {
    if (formData.schoolId) {
      fetch(
        `http://localhost:7000/settings/Departments/all?facultyId=${formData.schoolId}`
      )
        .then((res) => res.json())
        .then((data) => {
          // If the API returns an array, map it; if it returns { departments: [...] }, use that
          let departmentsList: Department[] = [];
          if (Array.isArray(data)) {
            departmentsList = data.map((d: any) => ({
              id: d.id,
              name: d.name,
            }));
          } else if (Array.isArray(data.departments)) {
            departmentsList = data.departments.map((d: any) => ({
              id: d.id,
              name: d.name,
            }));
          }
          setDepartments(departmentsList);
        })
        .catch(() => setDepartments([]));
    } else {
      setDepartments([]);
    }
    setFormData((f) => ({ ...f, departmentId: "" }));
  }, [formData.schoolId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
    if (name === "password") evaluatePasswordStrength(value);
  };

  const evaluatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    setPasswordStrength(Math.min(score, 5));
  };

  const isValidPassword = (password: string) => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    // if (!formData.fatherName.trim()) newErrors.fatherName = 'Father Name is required';
    // if (!formData.motherName.trim()) newErrors.motherName = 'Mother Name is required';
    if (!formData.gender) newErrors.gender = "Gender is required";
    // if (!formData.idCardNumber.trim()) newErrors.idCardNumber = 'ID Card Number is required';
    // if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
    // if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    // if (!formData.registrationDate) newErrors.registrationDate = 'Registration Date is required';
    // if (!formData.level) newErrors.level = 'Level is required';
    // if (!formData.program) newErrors.program = 'Program is required';

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password =
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // if (!formData.regNumber.trim())
    //   newErrors.regNumber = "Registration Number is required";

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // if (!formData.campusId) newErrors.campusId = 'Please select a campus';
    // if (!formData.schoolId) newErrors.schoolId = 'Please select a faculty';
    // if (!formData.departmentId) newErrors.departmentId = 'Please select a department';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      try {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          regNumber: formData.regNumber,
          // registrationDate: formData.registrationDate,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          gender: formData.gender,
          // idCardNumber: formData.idCardNumber,
          // nationality: formData.nationality,
          // dateOfBirth: formData.dateOfBirth,
          phoneNumber: formData.phoneNumber,
          // level: formData.level,
          // program: formData.program,
          campusId: Number(formData.campusId),
          schoolId: Number(formData.schoolId),
          departmentId: Number(formData.departmentId),
        };

        const res = await fetch(
          "http://localhost:7000/users/register-student",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Registration failed");
        }

        setIsSubmitted(true);
        toast.success("Registration successful!");
      } catch (error: any) {
        setErrors({
          ...errors,
          form: error.message || "Registration failed. Please try again.",
        });
        toast.error("Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Registration Successful
            </h2>
            <p className="mt-2 text-gray-600">
              Your account has been created successfully.
            </p>
          </div>
          <div className="mt-6">
            <a
              // href="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="p-8 lg:p-12 ">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-100">
                Create Account
              </h1>
              <p className="text-gray-100">
                Join our platform to access exclusive features and manage your
                academic profile. Fill in your details to get started
              </p>
            </div>
            {errors.form && (
              <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
                {errors.form}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.firstName ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.lastName ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                {/* Father Name */}
                {/* <div>
                  <label
                    htmlFor="fatherName"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Father Name *
                  </label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.fatherName ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.fatherName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fatherName}
                    </p>
                  )}
                </div> */}
                {/* Mother Name */}
                {/* <div>
                  <label
                    htmlFor="motherName"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Mother Name *
                  </label>
                  <input
                    type="text"
                    id="motherName"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.motherName ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.motherName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.motherName}
                    </p>
                  )}
                </div> */}
                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border text-black ${
                      errors.gender ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
                {/* ID Card Number */}
                {/* <div>
                  <label
                    htmlFor="idCardNumber"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    ID Card Number *
                  </label>
                  <input
                    type="text"
                    id="idCardNumber"
                    name="idCardNumber"
                    value={formData.idCardNumber}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.idCardNumber ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.idCardNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.idCardNumber}
                    </p>
                  )}
                </div> */}
                {/* Nationality */}
                {/* <div>
                  <label
                    htmlFor="nationality"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Nationality *
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.nationality ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.nationality && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nationality}
                    </p>
                  )}
                </div> */}
                {/* Date of Birth */}
                {/* <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.dateOfBirth ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div> */}
                {/* Registration Date */}
                {/* <div>
                  <label
                    htmlFor="registrationDate"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Registration Date *
                  </label>
                  <input
                    type="date"
                    id="registrationDate"
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.registrationDate
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.registrationDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.registrationDate}
                    </p>
                  )}
                </div> */}
                {/* Level */}
                {/* <div>
                  <label
                    htmlFor="level"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Level *
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border text-black ${
                      errors.level ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select Level</option>
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                  </select>
                  {errors.level && (
                    <p className="mt-1 text-sm text-red-600">{errors.level}</p>
                  )}
                </div> */}
                {/* Program */}
                {/* <div>
                  <label
                    htmlFor="program"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Program *
                  </label>
                  <select
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border text-black ${
                      errors.program ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select Program</option>
                    <option value="day">Day</option>
                    <option value="evening">Evening</option>
                  </select>
                  {errors.program && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.program}
                    </p>
                  )}
                </div> */}
                {/* Email */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                {/* Registration Number */}
                <div>
                  <label
                    htmlFor="regNumber"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    id="regNumber"
                    name="regNumber"
                    value={formData.regNumber}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.regNumber ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.regNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.regNumber}
                    </p>
                  )}
                </div>
                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                {/* Campus */}
                <div>
                  <label
                    htmlFor="campusId"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Campus *
                  </label>
                  <select
                    id="campusId"
                    name="campusId"
                    value={formData.campusId}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border text-black ${
                      errors.campusId ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select Campus</option>
                    {campuses.map((campus) => (
                      <option key={campus.id} value={campus.id}>
                        {campus.name}
                      </option>
                    ))}
                  </select>
                  {errors.campusId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.campusId}
                    </p>
                  )}
                </div>
                {/* Faculty */}
                <div>
                  <label
                    htmlFor="schoolId"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Faculty *
                  </label>
                  <select
                    id="schoolId"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border text-black ${
                      errors.schoolId ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                  {errors.schoolId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.schoolId}
                    </p>
                  )}
                </div>
                {/* Department */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="departmentId"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Department *
                  </label>
                  <select
                    id="departmentId"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border text-black  ${
                      errors.departmentId ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.departmentId}
                    </p>
                  )}
                </div>
                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  ) : (
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Password strength:
                        </div>
                        <div className="text-xs font-medium">
                          {passwordStrength <= 1
                            ? "Weak"
                            : passwordStrength <= 3
                            ? "Medium"
                            : "Strong"}
                        </div>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength <= 1
                              ? "bg-red-500 w-1/4"
                              : passwordStrength <= 3
                              ? "bg-yellow-500 w-2/4"
                              : "bg-green-500 w-full"
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-100 mb-1"
                  >
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-100"
                >
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
