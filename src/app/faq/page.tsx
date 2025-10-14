'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

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
      answer: "Current there is no password reset option. If you forget your password, please contact support for assistance."
    },
    {
      question: "Can I take tests without creating an account?",
      answer: "Yes! You can take tests as a guest without creating an account. However, your results won't be saved after your session ends. To track your progress over time, we recommend creating an account."
    },
    {
      question: "What is Study Mode?",
      answer: "Study Mode is a pressure-free way to review questions. In this mode, there's no timer, and you can see answer for each questions as soon you select any option. It's perfect for learning rather than testing yourself."
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
      answer: "Currently, there is no option to switch between light and dark mode. The app uses a dark theme by default for better readability in low-light conditions."
    },
    {
      question: "How do I report a bug or suggest a feature?",
      answer: "You can use the feedback form available in the sidebar to report issues or suggest improvements. We appreciate your input to help make the app better!"
    }
  ];

  return (
    <main className="min-h-screen relative">
    <BackgroundGradientAnimation 
              gradientBackgroundStart="rgb(2, 6, 23)" 
              gradientBackgroundEnd="rgb(2, 6, 23)" 
              firstColor="20, 90, 100"       // Darkest Teal
              secondColor="50, 40, 130"      // Deep Indigo
              thirdColor="80, 60, 110"       // Muted Purple
              fourthColor="30, 80, 70"       // Forest Green
              fifthColor="120, 80, 40"       // Muted Amber
              interactive={false}
              containerClassName="fixed inset-0 -z-10"
        />
    <div className="relative z-10">
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 rounded-2xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] overflow-hidden shadow-xl p-2">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-300">Frequently Asked Questions</h1>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <button
                    className="flex justify-between items-center w-full text-left focus:outline-none"
                    onClick={() => toggleItem(index)}
                  >
                    <h3 className="text-lg font-medium text-gray-300">{item.question}</h3>
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
                    <div className="mt-2 pr-6">
                      <p className="text-gray-400">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">Still have questions?</p>
              <Link 
                href="/feedback" 
                className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium rounded-2xl text-white bg-indigo-600/5 border border-white/20 hover:bg-indigo-700"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </main>
  );
}