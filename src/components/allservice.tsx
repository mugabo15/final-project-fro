import  { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';

// Define types
interface Service {
  id: number;
  title: string;
  category: string;
  icon: JSX.Element;
  description: string;
}

// Map icons to each service
const services: Service[] = [
  {
    id: 1,
    title: 'Official Transcripts',
    category: 'Documents',
    icon: <DocumentTextIcon className="w-10 h-10 text-blue-500 mb-4" />,
    description: 'Request your official academic transcripts.',
  },
  {
    id: 2,
    title: 'English Proficient Certificate',
    category: 'Documents',
    icon: <AcademicCapIcon className="w-10 h-10 text-green-500 mb-4" />,
    description: 'Get a certificate verifying your English proficiency.',
  },
  {
    id: 3,
    title: 'To Whom, Recommendation Letters',
    category: 'Documents',
    icon: <EnvelopeIcon className="w-10 h-10 text-purple-500 mb-4" />,
    description: 'Request recommendation or general purpose letters.',
  },
  {
    id: 4,
    title: 'Declaration Certificate',
    category: 'Verification',
    icon: <CheckCircleIcon className="w-10 h-10 text-red-500 mb-4" />,
    description: 'Obtain a declaration certificate for verification purposes.',
  },
];

const AllServices = () => {
  const [search, setSearch] = useState('');

  const filtered = services.filter((service) =>
    service.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10  min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Services</h1>

      <input
        type="text"
        placeholder="Search services..."
        className="w-full max-w-lg mb-8 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search services"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((service) => (
          <Link
            to={`/request/${service.id}`}
            key={service.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition text-center cursor-pointer border border-gray-100 hover:border-blue-300"
          >
            {service.icon}
            <h3 className="font-semibold text-lg text-gray-800">{service.title}</h3>
            <p className="text-sm text-gray-500">{service.category}</p>
            <p className="text-sm text-gray-600 mt-2">{service.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllServices;