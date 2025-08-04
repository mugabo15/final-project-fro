import bgImage from '../assets/bgImage.jpg';
import logo from '../assets/logo1.png';
import AllServices from './allservice';
import { motion } from 'framer-motion';
import Login from './login';
import SignUpForm from './register';
import React from 'react';

const LandingPage = () => {
  const [showLogin, setShowLogin] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('home');

  return (
    <div className="min-h-screen w-full font-sans">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 bg-white`}
        id="main-navbar"
      >
        {/* <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div> */}
        <div className={`container mx-auto px-6 py-4 `}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Unidoc Logo" className="h-12" />
              <span className="text-xl font-bold text-blue-600">UNIDOC REQUEST SYSTEM</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab('home')}
                className={`font-medium ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`font-medium ${activeTab === 'about' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`font-medium ${activeTab === 'faqs' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              >
                FAQs
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`font-medium ${activeTab === 'docs' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              >
                Documentation
              </button>
            </nav>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-900 pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        <div className="relative z-10 container mx-auto px-6  md:py-32">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Streamline Your Document Requests
                </h1>
                <p className="text-xl text-blue-100 mb-8 max-w-lg">
                  A comprehensive solution for managing, tracking, and fulfilling academic document requests with efficiency and transparency.
                </p>
                <div className="flex space-x-4">
                  <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg transition duration-300">
                    Get Started
                  </button>
                  <button className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-gray-900 transition duration-300">
                    Learn More
                  </button>
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2  rounded-xl shadow-2xl overflow-hidden">
              <div className="flex border-b  border-gray-200 bg-white">
                <button
                  className={`flex-1 py-4 font-medium ${showLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 py-4 font-medium ${!showLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setShowLogin(false)}
                >
                  Register
                </button>
              </div>
              <div className="p-6">
                {showLogin ? <Login /> : <SignUpForm />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage document requests efficiently
            </p>
          </div>
          <AllServices />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Automated Request Processing",
                desc: "Reduce manual work with our automated request handling system.",
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                  </svg>
                )
              },
              {
                title: "Real-Time Tracking",
                desc: "Monitor your request status in real-time with detailed updates.",
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                )
              },
              {
                title: "Secure Document Handling",
                desc: "Enterprise-grade security for all your sensitive documents.",
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                )
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition duration-300"
              >
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your documents processed quickly
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Submit Request",
                desc: "Fill out our simple form with your document requirements.",
                step: "1"
              },
              {
                title: "Track Progress",
                desc: "Monitor your request status through each processing stage.",
                step: "2"
              },
              {
                title: "Receive Documents",
                desc: "Download your completed documents securely when ready.",
                step: "3"
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl mr-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                </div>
                <p className="text-gray-600 pl-16">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your Document Requests?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Join thousands of students and administrators using Unidoc to streamline their document workflows.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 shadow-lg transition duration-300">
              Get Started Now
            </button>
            <button className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logo} alt="Unidoc Logo" className="h-8 mr-2" />
                <span className="font-bold">UNIDOC</span>
              </div>
              <p className="text-gray-400">
                The complete solution for academic document request management.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@unidoc.edu</li>
                <li>+250 788 123 456</li>
                <li>Kigali, Rwanda</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Unidoc Request System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;