import { motion } from 'framer-motion';
import { Shield, Database, Lock, Calendar, User } from 'lucide-react';

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

export default function PP() {
  return (
 <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
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
              <span className="block">CPier</span>
              <span className="block text-blue-600 dark:text-blue-400">Privacy Policy</span>
            </motion.h1>
            <motion.p
              className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
              variants={itemVariants}
            >
              Last updated: {new Date().toLocaleDateString()}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-8">
            {/* Introduction */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Introduction</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                CPier ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service that integrates with Google Calendar API and stores your competitive programming profiles.
              </p>
            </div>

            {/* Data Collection */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Database className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data We Collect</h2>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Personal Information:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Email address</li>
                  <li>Name</li>
                  <li>Coding platform usernames (LeetCode, CodeChef, CodeForces, etc.)</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Google Calendar Data:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Read/write access to create and manage coding contest events</li>
                  <li>Calendar metadata for proper event placement</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Usage Data:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Problem-solving statistics</li>
                  <li>Contest performance metrics</li>
                  <li>Feature usage patterns</li>
                </ul>
              </div>
            </div>

            {/* Data Usage */}
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Data</h2>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>To provide and maintain our service</li>
                <li>To analyze your competitive programming performance and generate visualizations</li>
                <li>To create and manage coding contest events in your Google Calendar</li>
                <li>To notify you about upcoming contests and platform updates</li>
                <li>To improve our service and develop new features</li>
              </ul>
            </div>

            {/* Data Storage & Security */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Lock className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Storage & Security</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Data encryption in transit (SSL/TLS) and at rest (AES-256)</li>
                <li>Secure database storage with restricted access</li>
                <li>Regular security audits and vulnerability testing</li>
                <li>Google OAuth 2.0 for calendar access with limited scope permissions</li>
              </ul>
            </div>

            {/* Google API Compliance */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Google API Compliance</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                CPier's use and transfer to any other app of information received from Google APIs will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Limited Use Disclosure:</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700 dark:text-blue-300">
                  <li>We only use Google Calendar data to provide and improve calendar event management features</li>
                  <li>We do not transfer Google Calendar data to third parties except as necessary to provide our service</li>
                  <li>We do not use Google Calendar data for advertising</li>
                  <li>We do not allow humans to read your Google Calendar data except with your consent for support purposes</li>
                </ul>
              </div>
            </div>

            {/* User Rights */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-300">
                You have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Access, update, or delete your personal information</li>
                <li>Revoke Google Calendar access at any time through your Google account settings</li>
                <li>Export your data in a machine-readable format</li>
                <li>Opt-out of non-essential communications</li>
              </ul>
            </div>

            {/* Changes to Policy */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Changes to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at developer91185@gmail.com.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>   
  );
}