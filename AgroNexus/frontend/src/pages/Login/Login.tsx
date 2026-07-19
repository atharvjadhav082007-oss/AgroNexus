import { Link } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F8FCF8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-150/20 rounded-full blur-3xl -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-left">
        <Link to="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-[#2E7D32] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#2E7D32] to-[#81C784]">
            <Leaf className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">KhetSeva</span>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{" "}
          <Link to="/register" className="font-bold text-[#2E7D32] hover:text-[#1F5F23] transition-colors">
            create a new farmer account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-200/80 shadow-xl rounded-[22px] sm:px-10">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Phone Number
              </label>
              <div className="mt-1.5">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Enter 10-digit number"
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pin" className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Pin Code / Password
              </label>
              <div className="mt-1.5">
                <input
                  id="pin"
                  name="pin"
                  type="password"
                  required
                  placeholder="••••••"
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 font-medium select-none">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-[#2E7D32] hover:text-[#1F5F23]">
                  Forgot Pin?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#2E7D32] hover:bg-[#1F5F23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32] transition-colors"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
