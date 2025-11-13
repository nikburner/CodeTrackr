import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.3, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { session, signInUser, signInWithGoogle, resetPassword } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user) {
      navigate('/profile');
    }
  }, [session, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data, error } = await signInUser(email, password);
      if (error) {
        setError('Bad credentials');
      } else if (data?.user) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { error } = await resetPassword(resetEmail);
      if (error) {
        setError(error.message);
      } else {
        setResetSent(true);
        setMessage('Password reset link sent to your email!');
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <a href="/" className="inline-flex items-center">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">CPier</span>
            </a>
          </motion.div>
          <motion.h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            {isForgotPassword ? 'Reset Password' : 'Sign in to your account'}
          </motion.h2>
          <motion.p className="mt-2 text-sm text-gray-600 dark:text-gray-400" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            {isForgotPassword ? (
              'Enter your email to receive a reset link'
            ) : (
              <>
                Or{' '}
                <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  create a new account
                </a>
              </>
            )}
          </motion.p>
        </div>

        <motion.div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" variants={containerVariants} initial="hidden" animate="visible">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            {error && (
              <motion.div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                {error}
              </motion.div>
            )}
            {(message || success) && (
              <motion.div className={`mb-4 ${success ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'} border px-4 py-3 rounded-md`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                {success || message}
              </motion.div>
            )}

            {isForgotPassword ? (
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {resetSent ? (
                  <motion.div variants={itemVariants} className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Check your email at <span className="font-medium">{resetEmail}</span> for the password reset link.
                    </p>
                    <button
                      onClick={() => {
                        setIsForgotPassword(false);
                        setResetSent(false);
                        setResetEmail('');
                      }}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Return to login
                    </button>
                  </motion.div>
                ) : (
                  <motion.form onSubmit={handleForgotPassword} variants={containerVariants}>
                    <motion.div variants={itemVariants} className="mb-4">
                      <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="reset-email"
                          type="email"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                          placeholder="you@example.com"
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setResetEmail('');
                          setError('');
                          setMessage('');
                        }}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                      >
                        Back to login
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </motion.div>
            ) : (
              <>
                {/* Google Sign In Button */}
                <motion.div variants={itemVariants}>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition duration-200"
                  >
                    <FcGoogle className="h-5 w-5" />
                    Continue with Google
                  </button>
                </motion.div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <motion.form className="space-y-6" onSubmit={handleLogin} variants={containerVariants}>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                        placeholder="you@example.com"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div className="flex items-center justify-between" variants={itemVariants}>
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsForgotPassword(true);
                          setError('');
                          setMessage('');
                        }}
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      ) : (
                        <LogIn className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </motion.div>
                </motion.form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}