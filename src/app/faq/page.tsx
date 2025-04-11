'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password."
    },
    {
      question: "Can I take tests without creating an account?",
      answer: "Yes! You can take tests as a guest without creating an account. However, your results won't be saved after your session ends. To track your progress over time, we recommend creating an account."
    },
    {
      question: "What is Study Mode?",
      answer: "Study Mode is a pressure-free way to review questions. In this mode, there's no timer, and you can see explanations for each answer. It's perfect for learning rather than testing yourself."
    },
    {
      question: "How is my score calculated?",
      answer: "Your score is calculated as the percentage of questions you answered correctly. For example, if you answer 8 out of 10 questions correctly, your score would be 80%."
    },
    {
      question: "Can I review my past test results?",
      answer: "Yes, if you're logged in. Your test history is available on your dashboard, showing your scores, time taken, and other statistics for each test you've completed."
    },
    {
      question: "How do I customize test settings?",
      answer: "Before starting a test, you can visit the Test Settings page where you can choose a subject category, toggle the timer on/off, enable/disable answer randomization, and select study mode if desired."
    },
    {
      question: "What does the Wrong Answers Collection show?",
      answer: "The Wrong Answers Collection displays questions you've answered incorrectly most frequently. It helps you identify patterns in your mistakes and focus your studying on areas that need improvement."
    },
    {
      question: "How do I switch between light and dark mode?",
      answer: "You can toggle between light and dark mode by clicking the theme icon in the header. Your preference will be saved for future visits."
    },
    {
      question: "Can I export my test history?",
      answer: "Yes, logged-in users can export their test history as a PDF from the dashboard. Look for the 'Export Data' button in the test history section."
    },
    {
      question: "How do I report a bug or suggest a feature?",
      answer: "You can use the feedback form available in the sidebar to report issues or suggest improvements. We appreciate your input to help make the app better!"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Frequently Asked Questions</h1>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <button
                    className="flex justify-between items-center w-full text-left focus:outline-none"
                    onClick={() => toggleItem(index)}
                  >
                    <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                    <span className="ml-6 flex-shrink-0">
                      {openItem === index ? (
                        <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  </button>
                  {openItem === index && (
                    <div className="mt-2 pr-12">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">Still have questions?</p>
              <Link 
                href="/feedback" 
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}