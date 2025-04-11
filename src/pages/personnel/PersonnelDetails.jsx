import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  AlertTriangle,
} from "lucide-react";
import { personnelAPI } from "../../services/mockAPI";
import usePermission from "../../hooks/usePermission";
import { Button, FormAlert } from "../../components/ui/Form";

// Info Section component
const InfoSection = ({ title, children }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
};

// Property Item component
const PropertyItem = ({ label, value, icon: Icon }) => {
  if (!value) return null;

  return (
    <div className="py-2">
      <dt className="text-sm font-medium text-gray-500 flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-1.5 text-gray-400" />}
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  );
};

// Card List component for lists of items
const CardList = ({ items, emptyMessage = "No items found" }) => {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500 italic">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-md p-3 text-sm border border-gray-200"
        >
          {item}
        </div>
      ))}
    </div>
  );
};

// Main component
const PersonnelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = usePermission();

  const [personnel, setPersonnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch personnel data
  useEffect(() => {
    const fetchPersonnel = async () => {
      setLoading(true);
      try {
        const response = await personnelAPI.getById(id);

        if (response.success) {
          setPersonnel(response.data);
        } else {
          setError("Failed to load personnel data");
        }
      } catch (error) {
        setError("An error occurred while loading personnel data");
        console.error("Error fetching personnel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, [id]);

  // Handle personnel deletion
  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to delete this personnel record?")
    ) {
      return;
    }

    try {
      const response = await personnelAPI.delete(id);

      if (response.success) {
        navigate("/personnel");
      } else {
        setError("Failed to delete personnel record");
      }
    } catch (error) {
      setError("An error occurred while deleting personnel record");
      console.error("Error deleting personnel:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !personnel) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <FormAlert
            type="error"
            title="Error"
            message={error || "Personnel not found"}
            className="mb-4"
          />
          <Button variant="default" onClick={() => navigate("/personnel")}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Personnel List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              {personnel.rank} {personnel.firstName} {personnel.lastName}
            </h1>
            <div className="mt-1 flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                  personnel.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : personnel.status === "On Leave"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {personnel.status}
              </span>
              <span className="text-sm text-gray-500">
                Badge: {personnel.badgeNumber}
              </span>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex space-x-3">
            {can("personnel", "update") && (
              <Link
                to={`/personnel/${id}/edit`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Link>
            )}

            {can("personnel", "delete") && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <Trash className="h-4 w-4 mr-1.5" />
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-1">
            <InfoSection title="Personal Information">
              <div className="flex justify-center mb-4">
                {personnel.photo ? (
                  <img
                    src={personnel.photo}
                    alt={`${personnel.firstName} ${personnel.lastName}`}
                    className="h-32 w-32 rounded-full"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
                    {personnel.firstName.charAt(0)}
                    {personnel.lastName.charAt(0)}
                  </div>
                )}
              </div>

              <dl className="divide-y divide-gray-200">
                <PropertyItem
                  label="Full Name"
                  value={`${personnel.rank} ${personnel.firstName} ${personnel.lastName}`}
                />
                <PropertyItem
                  label="Badge Number"
                  value={personnel.badgeNumber}
                />
                <PropertyItem label="Gender" value={personnel.gender} />
                <PropertyItem
                  label="Date of Birth"
                  value={personnel.dateOfBirth}
                  icon={Calendar}
                />
                <PropertyItem
                  label="National ID"
                  value={personnel.nationalId}
                />
              </dl>
            </InfoSection>

            {/* Contact Information */}
            <InfoSection title="Contact Information" className="mt-6">
              <dl className="divide-y divide-gray-200">
                <PropertyItem
                  label="Phone"
                  value={personnel.phone}
                  icon={Phone}
                />
                <PropertyItem
                  label="Email"
                  value={personnel.email}
                  icon={Mail}
                />
                <PropertyItem
                  label="Address"
                  value={personnel.address}
                  icon={MapPin}
                />
              </dl>
            </InfoSection>
          </div>

          {/* Employment and Training Information */}
          <div className="lg:col-span-2">
            <InfoSection title="Employment Information">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <PropertyItem
                  label="Department"
                  value={personnel.department}
                  icon={Briefcase}
                />
                <PropertyItem
                  label="Station"
                  value={personnel.station}
                  icon={MapPin}
                />
                <PropertyItem
                  label="Joining Date"
                  value={personnel.joiningDate}
                  icon={Calendar}
                />
                <PropertyItem label="Status" value={personnel.status} />
                <PropertyItem
                  label="Supervisor"
                  value={
                    personnel.supervisor
                      ? `ID: ${personnel.supervisor}`
                      : "None"
                  }
                />
              </dl>
            </InfoSection>

            {/* Specialized Training */}
            <InfoSection title="Specialized Training" className="mt-6">
              <CardList
                items={personnel.specializedTraining}
                emptyMessage="No specialized training recorded"
              />
            </InfoSection>

            {/* Current Assignments */}
            <InfoSection title="Current Assignments" className="mt-6">
              {personnel.assignments && personnel.assignments.length > 0 ? (
                <div className="space-y-4">
                  {personnel.assignments
                    .sort((a, b) => {
                      // Sort assignments with no end date (current) first
                      if (!a.endDate && b.endDate) return -1;
                      if (a.endDate && !b.endDate) return 1;

                      // Then sort by start date (most recent first)
                      return new Date(b.startDate) - new Date(a.startDate);
                    })
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        className="bg-gray-50 p-4 rounded-md border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">
                              {assignment.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Start Date: {assignment.startDate}
                            </p>
                            {assignment.endDate && (
                              <p className="text-sm text-gray-500">
                                End Date: {assignment.endDate}
                              </p>
                            )}
                          </div>
                          {!assignment.endDate && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No assignments recorded
                </p>
              )}
            </InfoSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelDetails;
