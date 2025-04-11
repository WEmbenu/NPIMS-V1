import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash,
  Clock,
  MapPin,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Plus,
  Users,
  Camera,
  Download,
} from "lucide-react";
import { casesAPI, personnelAPI } from "../../services/mockAPI";
import usePermission from "../../hooks/usePermission";
import { Button, FormAlert } from "../../components/ui/Form";

// Info Section component
const InfoSection = ({ title, children, className = "", actions = null }) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        {actions}
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

// Timeline component for case updates
const Timeline = ({ updates, assignedOfficer }) => {
  if (!updates || updates.length === 0) {
    return <p className="text-sm text-gray-500 italic">No updates recorded</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {updates.map((update, index) => (
          <li key={update.id}>
            <div className="relative pb-8">
              {index !== updates.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                ></span>
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                    <FileText className="h-4 w-4 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-900">{update.notes}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      By:{" "}
                      {assignedOfficer?.firstName ||
                        `Officer #${update.officer}`}
                    </p>
                  </div>
                  <div className="text-right text-xs whitespace-nowrap text-gray-500">
                    <time dateTime={update.date}>
                      {new Date(update.date).toLocaleString()}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Evidence list component
const EvidenceList = ({ evidence }) => {
  if (!evidence || evidence.length === 0) {
    return <p className="text-sm text-gray-500 italic">No evidence recorded</p>;
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {evidence.map((item) => (
          <li key={item.id} className="py-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {item.type === "CCTV Footage" ? (
                  <Camera className="h-5 w-5 text-indigo-600" />
                ) : (
                  <FileText className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{item.type}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Collected on: {item.collectedDate}
                </p>
              </div>
              {item.file && (
                <div className="ml-3">
                  <button className="text-xs text-primary-600 hover:text-primary-800 flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Person card component (for suspects and victims)
const PersonCard = ({ person, type }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <User className="h-4 w-4" />
          </div>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{person.name}</p>
          <p className="text-xs text-gray-500">
            {type}: {person.type}
          </p>
          {person.description && (
            <p className="text-xs text-gray-600 mt-1">{person.description}</p>
          )}
          {person.contact && (
            <p className="text-xs text-gray-500 mt-1">
              Contact: {person.contact}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component
const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = usePermission();

  const [caseData, setCaseData] = useState(null);
  const [assignedOfficer, setAssignedOfficer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    notes: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch case data and assigned officer details
  useEffect(() => {
    const fetchCase = async () => {
      setLoading(true);
      try {
        const caseResponse = await casesAPI.getById(id);

        if (caseResponse.success) {
          setCaseData(caseResponse.data);

          // Fetch assigned officer details if available
          if (caseResponse.data.assignedTo) {
            try {
              const officerResponse = await personnelAPI.getById(
                caseResponse.data.assignedTo
              );
              if (officerResponse.success) {
                setAssignedOfficer(officerResponse.data);
              }
            } catch (error) {
              console.error("Error fetching assigned officer:", error);
            }
          }
        } else {
          setError("Failed to load case data");
        }
      } catch (error) {
        setError("An error occurred while loading case data");
        console.error("Error fetching case:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  // Handle case deletion
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this case?")) {
      return;
    }

    try {
      const response = await casesAPI.delete(id);

      if (response.success) {
        navigate("/cases");
      } else {
        setError("Failed to delete case");
      }
    } catch (error) {
      setError("An error occurred while deleting case");
      console.error("Error deleting case:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding a case update
  const handleAddUpdate = async (e) => {
    e.preventDefault();

    if (!formData.notes.trim()) {
      return;
    }

    setUpdateLoading(true);
    try {
      const response = await casesAPI.addUpdate(id, {
        notes: formData.notes,
        officer: assignedOfficer?.id || 1, // Default to 1 if no assigned officer
        date: new Date().toISOString(),
      });

      if (response.success) {
        // Update the case data with the new update
        setCaseData((prevData) => ({
          ...prevData,
          updates: [...prevData.updates, response.data],
        }));

        // Clear the form
        setFormData({ notes: "" });
      } else {
        setError("Failed to add update");
      }
    } catch (error) {
      setError("An error occurred while adding update");
      console.error("Error adding update:", error);
    } finally {
      setUpdateLoading(false);
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
  if (error || !caseData) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <FormAlert
            type="error"
            title="Error"
            message={error || "Case not found"}
            className="mb-4"
          />
          <Button variant="default" onClick={() => navigate("/cases")}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Cases List
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
              {caseData.title}
            </h1>
            <div className="mt-1 flex items-center flex-wrap gap-2">
              <span className="text-sm text-gray-500">
                Case #: {caseData.caseNumber}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  caseData.status === "Active"
                    ? "bg-blue-100 text-blue-800"
                    : caseData.status === "Closed"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {caseData.status}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  caseData.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : caseData.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {caseData.priority} Priority
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {caseData.type}
              </span>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex space-x-3">
            {can("cases", "update") && (
              <Link
                to={`/cases/${id}/edit`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Link>
            )}

            {can("cases", "delete") && (
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
          {/* Case Information */}
          <div className="lg:col-span-1">
            <InfoSection title="Case Information">
              <dl className="divide-y divide-gray-200">
                <PropertyItem label="Case Number" value={caseData.caseNumber} />
                <PropertyItem label="Status" value={caseData.status} />
                <PropertyItem label="Priority" value={caseData.priority} />
                <PropertyItem label="Type" value={caseData.type} />
                <PropertyItem
                  label="Location"
                  value={caseData.location}
                  icon={MapPin}
                />
                <PropertyItem
                  label="Reported Date"
                  value={new Date(caseData.reportedDate).toLocaleString()}
                  icon={Clock}
                />
                <PropertyItem
                  label="Assigned To"
                  value={
                    assignedOfficer
                      ? `${assignedOfficer.rank} ${assignedOfficer.firstName} ${assignedOfficer.lastName}`
                      : `Officer #${caseData.assignedTo}`
                  }
                  icon={User}
                />
              </dl>
            </InfoSection>

            {/* Case Description */}
            <InfoSection title="Description" className="mt-6">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {caseData.description}
              </p>
            </InfoSection>

            {/* Involved Parties */}
            <InfoSection
              title="Suspects"
              className="mt-6"
              actions={
                can("cases", "update") && (
                  <button className="text-xs text-primary-600 hover:text-primary-800 flex items-center">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Suspect
                  </button>
                )
              }
            >
              {caseData.suspects && caseData.suspects.length > 0 ? (
                <div className="space-y-3">
                  {caseData.suspects.map((suspect) => (
                    <PersonCard
                      key={suspect.id}
                      person={suspect}
                      type="Suspect"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No suspects recorded
                </p>
              )}
            </InfoSection>

            <InfoSection
              title="Victims"
              className="mt-6"
              actions={
                can("cases", "update") && (
                  <button className="text-xs text-primary-600 hover:text-primary-800 flex items-center">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Victim
                  </button>
                )
              }
            >
              {caseData.victims && caseData.victims.length > 0 ? (
                <div className="space-y-3">
                  {caseData.victims.map((victim) => (
                    <PersonCard key={victim.id} person={victim} type="Victim" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No victims recorded
                </p>
              )}
            </InfoSection>
          </div>

          {/* Case Updates and Evidence */}
          <div className="lg:col-span-2">
            <InfoSection
              title="Case Updates"
              actions={
                caseData.status !== "Closed" &&
                can("cases", "update") && (
                  <button
                    className="text-xs text-green-600 hover:text-green-800 flex items-center"
                    onClick={() => {
                      // This would open a confirmation modal in a real app
                      alert(
                        "Case close functionality would be implemented here"
                      );
                    }}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Close Case
                  </button>
                )
              }
            >
              <Timeline
                updates={caseData.updates}
                assignedOfficer={assignedOfficer}
              />

              {/* Add update form */}
              {caseData.status !== "Closed" && can("cases", "update") && (
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Add Update
                  </h4>
                  <form onSubmit={handleAddUpdate}>
                    <textarea
                      name="notes"
                      rows={3}
                      className="form-textarea w-full"
                      placeholder="Enter case update notes..."
                      value={formData.notes}
                      onChange={handleChange}
                      required
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {updateLoading ? (
                          <>
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
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1.5" />
                            Add Update
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </InfoSection>

            <InfoSection
              title="Evidence"
              className="mt-6"
              actions={
                can("cases", "update") && (
                  <button className="text-xs text-primary-600 hover:text-primary-800 flex items-center">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Evidence
                  </button>
                )
              }
            >
              <EvidenceList evidence={caseData.evidence} />
            </InfoSection>

            {/* Related Cases (if any) */}
            <InfoSection title="Related Cases" className="mt-6">
              <p className="text-sm text-gray-500 italic">
                No related cases found
              </p>
            </InfoSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
