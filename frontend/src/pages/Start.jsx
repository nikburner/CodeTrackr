import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Calendar, TrendingUp, Code, AlertCircle, Github, Link as LinkIcon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const featureVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
      title: "Unified Coding Profiles Dashboard",
      description: "Analyze all your coding profiles (LeetCode, CodeChef, CodeForces) in one comprehensive dashboard with performance metrics and insights."
    },
    {
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      title: "Contest Reminders & Calendar",
      description: "Never miss a coding contest with automated reminders and a unified calendar showing all upcoming contests across platforms."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
      title: "Performance Analytics",
      description: "Track your progress over time with detailed analytics and visualizations of your problem-solving patterns and contest performance."
    },
    {
      icon: <Code className="h-6 w-6 text-blue-500" />,
      title: "Multi-Platform Integration",
      description: "Connect your CodeChef, LeetCode, and CodeForces accounts for centralized tracking and analysis."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">CPier</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium">Home</a>
                  <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium">Features</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">Login</a>
              <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300">Sign Up</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        className="pt-32 pb-12 md:pt-40 md:pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
              variants={itemVariants}
            >
              <span className="block">Elevate Your</span>
              <span className="block text-blue-600 dark:text-blue-400">Competitive Coding</span>
            </motion.h1>
            <motion.p
              className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
              variants={itemVariants}
            >
              CPier unifies your competitive coding profiles, tracks your progress, and keeps you updated on all upcoming contests across platforms - all in one place.
            </motion.p>
            <motion.div
              className="mt-8 sm:flex sm:justify-center"
              variants={itemVariants}
            >
              <div className="rounded-md shadow">
                <a href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300">
                  Get Started Free
                </a>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 dark:text-blue-400 dark:bg-gray-800 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300">
                  Explore Features
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Your Complete Competitive Coding Companion
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              All the tools you need to excel in coding competitions and track your progress.
            </p>
          </div>

          <div className="mt-16 space-y-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={featureVariants}
              >
                <div className="relative p-8 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-2xl">
                  <div className="absolute -top-3 -left-3 p-3 bg-white dark:bg-gray-800 rounded-full shadow-md justify-center items-center flex">
                    {feature.icon}
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Simplified like the image */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Support & Privacy
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/suveerprasad/cp-tracker"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
            </div>

            <p className="text-sm text-gray-400">
              © 2025 CPier. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}