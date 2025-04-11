import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any form errors when user starts typing
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!credentials.email.trim()) {
      setFormError("Email is required");
      return;
    }

    if (!credentials.password) {
      setFormError("Password is required");
      return;
    }

    try {
      const result = await login(credentials);

      if (result.success) {
        // Redirect to dashboard on successful login
        navigate("/");
      } else {
        setFormError(result.error || "Authentication failed");
      }
    } catch (error) {
      setFormError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Error message */}
        {(formError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{formError || error}</span>
          </div>
        )}
        {/* Email field */}
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
              value={credentials.email}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Password field */}
        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="form-input pr-10"
              value={credentials.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        {/* Remember me and Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </a>
          </div>
        </div>
        {/* Submit button */}
        <div>
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </div>
        {/* For demo purposes - quick login buttons */}

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Demo accounts</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <button
              type="button"
              className="btn btn-outline text-sm"
              onClick={() => {
                setCredentials({
                  email: "commissioner@police.cd",
                  password: "password",
                });
              }}
            >
              <Shield className="h-4 w-4 mr-1.5 text-blue-600" />
              National Commissioner (Full Access)
            </button>
            <button
              type="button"
              className="btn btn-outline text-sm"
              onClick={() => {
                setCredentials({
                  email: "province@police.cd",
                  password: "password",
                });
              }}
            >
              <MapPin className="h-4 w-4 mr-1.5 text-purple-600" />
              Provincial Commissioner
            </button>
            <button
              type="button"
              className="btn btn-outline text-sm"
              onClick={() => {
                setCredentials({
                  email: "station@police.cd",
                  password: "password",
                });
              }}
            >
              <Briefcase className="h-4 w-4 mr-1.5 text-green-600" />
              Station Commander
            </button>
            <button
              type="button"
              className="btn btn-outline text-sm"
              onClick={() => {
                setCredentials({
                  email: "officer@police.cd",
                  password: "password",
                });
              }}
            >
              <User className="h-4 w-4 mr-1.5 text-gray-600" />
              Police Officer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
