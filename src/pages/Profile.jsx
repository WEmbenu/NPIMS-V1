import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Clock,
  Lock,
  Camera,
  Save,
} from "lucide-react";
import {
  Form,
  FormSection,
  FormRow,
  FormGroup,
  Input,
  SubmitButton,
  Button,
  FormAlert,
} from "../components/ui/Form";
import useAuthStore from "../store/authStore";
import { authAPI } from "../services/mockAPI";

const Profile = () => {
  const { user, updateProfile } = useAuthStore();

  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    avatar: null,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || null,
      });
    }
  }, [user]);

  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real app, this would include file upload handling for the avatar
      const response = await authAPI.updateProfile(user.id, {
        name: personalInfo.name,
        email: personalInfo.email,
      });

      if (response.success) {
        // Update local state in auth store
        updateProfile({
          name: personalInfo.name,
          email: personalInfo.email,
        });

        setSuccess("Profile updated successfully");
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Validate password strength
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      const response = await authAPI.changePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        setPasswordSuccess("Password changed successfully");

        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordError(response.message || "Failed to change password");
      }
    } catch (error) {
      setPasswordError("An unexpected error occurred");
      console.error("Error changing password:", error);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = () => {
    // In a real app, this would open a file dialog and handle the upload
    alert("Avatar upload would be implemented here");
  };

  if (!user) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <FormAlert
            type="error"
            title="Error"
            message="User information not available. Please log in again."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and update your account information
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <h3 className="text-lg font-medium">Account Information</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    {personalInfo.avatar ? (
                      <img
                        src={personalInfo.avatar}
                        alt="User Avatar"
                        className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-bold border-4 border-white shadow-lg">
                        {personalInfo.name.charAt(0)}
                      </div>
                    )}
                    <button
                      onClick={handleAvatarUpload}
                      className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:text-primary-600"
                      title="Change avatar"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <dl className="space-y-3">
                  <div className="flex items-center">
                    <dt className="flex-shrink-0">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                    </dt>
                    <dd className="text-sm text-gray-900">{user.name}</dd>
                  </div>

                  <div className="flex items-center">
                    <dt className="flex-shrink-0">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    </dt>
                    <dd className="text-sm text-gray-900">{user.email}</dd>
                  </div>

                  <div className="flex items-center">
                    <dt className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-gray-400 mr-2" />
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {user.role
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </dd>
                  </div>

                  <div className="flex items-center">
                    <dt className="flex-shrink-0">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {user.station || "Not assigned"}
                    </dd>
                  </div>

                  <div className="flex items-center">
                    <dt className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    </dt>
                    <dd className="text-sm text-gray-500">
                      Last login: {new Date(user.lastLogin).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Profile Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Form */}
            <FormSection title="Personal Information">
              {error && (
                <FormAlert
                  type="error"
                  title="Error"
                  message={error}
                  onClose={() => setError(null)}
                  className="mb-4"
                />
              )}

              {success && (
                <FormAlert
                  type="success"
                  title="Success"
                  message={success}
                  onClose={() => setSuccess(null)}
                  className="mb-4"
                />
              )}

              <Form onSubmit={handleProfileUpdate}>
                <FormGroup label="Full Name" htmlFor="name" required>
                  <Input
                    id="name"
                    name="name"
                    value={personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    placeholder="Your full name"
                    required
                  />
                </FormGroup>

                <FormGroup
                  label="Email Address"
                  htmlFor="email"
                  className="mt-4"
                  required
                >
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    placeholder="Your email address"
                    required
                  />
                </FormGroup>

                <div className="mt-6 flex justify-end">
                  <SubmitButton loading={loading} loadingText="Updating...">
                    <Save className="h-4 w-4 mr-1.5" />
                    Save Changes
                  </SubmitButton>
                </div>
              </Form>
            </FormSection>

            {/* Password Change Form */}
            <FormSection title="Change Password">
              {passwordError && (
                <FormAlert
                  type="error"
                  title="Error"
                  message={passwordError}
                  onClose={() => setPasswordError(null)}
                  className="mb-4"
                />
              )}

              {passwordSuccess && (
                <FormAlert
                  type="success"
                  title="Success"
                  message={passwordSuccess}
                  onClose={() => setPasswordSuccess(null)}
                  className="mb-4"
                />
              )}

              <Form onSubmit={handlePasswordUpdate}>
                <FormGroup
                  label="Current Password"
                  htmlFor="currentPassword"
                  required
                >
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    required
                  />
                </FormGroup>

                <FormGroup
                  label="New Password"
                  htmlFor="newPassword"
                  className="mt-4"
                  required
                >
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    required
                    minLength={8}
                  />
                </FormGroup>

                <FormGroup
                  label="Confirm New Password"
                  htmlFor="confirmPassword"
                  className="mt-4"
                  required
                >
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    required
                    minLength={8}
                  />
                </FormGroup>

                <div className="mt-6 flex justify-end">
                  <SubmitButton
                    loading={passwordLoading}
                    loadingText="Updating..."
                  >
                    <Lock className="h-4 w-4 mr-1.5" />
                    Change Password
                  </SubmitButton>
                </div>
              </Form>
            </FormSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
