import { useState } from 'react';
import { ChevronRight, FileText, Award, Mail } from 'lucide-react';
import TranscriptRequestForm from './SchoolForm';
import RecommandationRequestForm from './recomandationForm';

// Mock form components for demonstration






const StudentForms: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [selectedForm, setSelectedForm] = useState<'requestForm' | 'howItWorks'>('requestForm');

  const menuItems = [
    { 
      id: 'requestForm', 
      label: 'Request Form', 
      icon: FileText,
      color: 'text-orange-400'
    },
    { 
      id: 'howItWorks', 
      label: 'How It Works', 
      icon: Award,
      color: 'text-orange-400'
    },
    // { 
    //   id: 'toWhom', 
    //   label: 'To Whom It May Concern', 
    //   icon: Mail,
    //   color: 'text-orange-400'
    // },
  ];

  const renderForm = () => {
    switch (selectedForm) {
      case 'requestForm':
        return <TranscriptRequestForm onSuccess={onSuccess} />;
      case 'howItWorks':
        return <RecommandationRequestForm  />;
      
      default:
        return null;
    }
  };

  return (
    <div className=" bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 text-white p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold">Document Request Forms</h1>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = selectedForm === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setSelectedForm(item.id as typeof selectedForm)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 text-left group ${
                  isActive 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-300'}`} />
              </button>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto pt-8">
          <div className="border-t border-gray-700 pt-6">
            {/* <button className="w-full flex items-center gap-3 p-4 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-200">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">S</span>
              </div>
              <span>Settings</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ">
        
       

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default StudentForms;