import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash, User } from "lucide-react";
import {
  Form,
  FormSection,
  FormRow,
  FormGroup,
  Input,
  Select,
  Textarea,
  SubmitButton,
  Button,
  FormAlert,
} from "../../components/ui/Form";
import { casesAPI, personnelAPI } from "../../services/mockAPI";

// Component for suspect/victim input fields
const PersonForm = ({ person, index, type, onChange, onRemove }) => {
  return (
    <div className="border border-gray-200 rounded-md p-3 bg-gray-50 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1.5 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-900">
            {type} #{index + 1}
          </h4>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      <FormGroup
        label="Name"
        htmlFor={`${type.toLowerCase()}-${index}-name`}
        required
      >
        <Input
          id={`${type.toLowerCase()}-${index}-name`}
          name="name"
          value={person.name || ""}
          onChange={(e) => onChange(index, "name", e.target.value)}
          placeholder={`${type} name`}
          required
        />
      </FormGroup>

      <FormGroup
        label="Type"
        htmlFor={`${type.toLowerCase()}-${index}-type`}
        className="mt-3"
        required
      >
        <Select
          id={`${type.toLowerCase()}-${index}-type`}
          name="type"
          value={person.type || ""}
          onChange={(e) => onChange(index, "type", e.target.value)}
          options={
            type === "Suspect"
              ? [
                  { value: "Primary", label: "Primary Suspect" },
                  { value: "Accomplice", label: "Accomplice" },
                  { value: "Person of Interest", label: "Person of Interest" },
                ]
              : [
                  { value: "Individual", label: "Individual" },
                  { value: "Organization", label: "Organization" },
                  { value: "Business", label: "Business" },
                ]
          }
          placeholder={`Select ${type.toLowerCase()} type`}
          required
        />
      </FormGroup>

      {type === "Suspect" && (
        <FormGroup
          label="Description"
          htmlFor={`${type.toLowerCase()}-${index}-description`}
          className="mt-3"
        >
          <Textarea
            id={`${type.toLowerCase()}-${index}-description`}
            name="description"
            value={person.description || ""}
            onChange={(e) => onChange(index, "description", e.target.value)}
            placeholder="Physical description, identifying features, etc."
            rows={2}
          />
        </FormGroup>
      )}

      {type === "Victim" && (
        <FormGroup
          label="Contact Information"
          htmlFor={`${type.toLowerCase()}-${index}-contact`}
          className="mt-3"
        >
          <Input
            id={`${type.toLowerCase()}-${index}-contact`}
            name="contact"
            value={person.contact || ""}
            onChange={(e) => onChange(index, "contact", e.target.value)}
            placeholder="Phone number or other contact information"
          />
        </FormGroup>
      )}
    </div>
  );
};

const CaseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // Form state
  const [formData, setFormData] = useState({
    caseNumber: "",
    title: "",
    description: "",
    status: "Active",
    priority: "Medium",
    type: "",
    location: "",
    reportedDate: new Date().toISOString().split("T")[0],
    assignedTo: "",
    suspects: [],
    victims: [],
  });

  // Form processing state
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Personnel list for assignment dropdown
  const [personnel, setPersonnel] = useState([]);

  // Options for select fields
  const [options, setOptions] = useState({
    types: [
      { value: "Assault", label: "Assault" },
      { value: "Theft", label: "Theft" },
      { value: "Robbery", label: "Robbery" },
      { value: "Fraud", label: "Fraud" },
      { value: "Missing Person", label: "Missing Person" },
      { value: "Homicide", label: "Homicide" },
      { value: "Burglary", label: "Burglary" },
      { value: "Vandalism", label: "Vandalism" },
      { value: "Drug-related", label: "Drug-related" },
      { value: "Traffic Violation", label: "Traffic Violation" },
    ],
    statuses: [
      { value: "Active", label: "Active" },
      { value: "Under Investigation", label: "Under Investigation" },
      { value: "Pending", label: "Pending" },
      { value: "Closed", label: "Closed" },
    ],
    priorities: [
      { value: "High", label: "High" },
      { value: "Medium", label: "Medium" },
      { value: "Low", label: "Low" },
    ],
  });

  // Generate case number for new cases
  useEffect(() => {
    if (!isEditing) {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");

      setFormData((prev) => ({
        ...prev,
        caseNumber: `KIN-${year}-${month}${day}-${random}`,
      }));
    }
  }, [isEditing]);

  // Fetch case data for editing and personnel list
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch personnel for assignee dropdown
        const personnelResponse = await personnelAPI.getAll({ per_page: 100 });
        if (personnelResponse.success) {
          setPersonnel(personnelResponse.data.data);
        }

        // If editing, fetch case data
        if (isEditing) {
          setFetchLoading(true);
          const caseResponse = await casesAPI.getById(id);
          if (caseResponse.success) {
            // Format date to YYYY-MM-DD for input field
            const reportedDate = new Date(caseResponse.data.reportedDate)
              .toISOString()
              .split("T")[0];

            setFormData({
              ...caseResponse.data,
              reportedDate,
            });
          } else {
            setError("Failed to load case data");
          }
        }
      } catch (error) {
        setError("An error occurred while loading data");
        console.error("Error fetching data:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle suspect form changes
  const handleSuspectChange = (index, field, value) => {
    setFormData((prev) => {
      const newSuspects = [...prev.suspects];
      newSuspects[index] = {
        ...newSuspects[index],
        [field]: value,
      };
      return {
        ...prev,
        suspects: newSuspects,
      };
    });
  };

  // Handle adding a new suspect
  const handleAddSuspect = () => {
    setFormData((prev) => ({
      ...prev,
      suspects: [
        ...prev.suspects,
        { id: Date.now(), name: "", type: "", description: "" },
      ],
    }));
  };

  // Handle removing a suspect
  const handleRemoveSuspect = (index) => {
    setFormData((prev) => ({
      ...prev,
      suspects: prev.suspects.filter((_, i) => i !== index),
    }));
  };

  // Handle victim form changes
  const handleVictimChange = (index, field, value) => {
    setFormData((prev) => {
      const newVictims = [...prev.victims];
      newVictims[index] = {
        ...newVictims[index],
        [field]: value,
      };
      return {
        ...prev,
        victims: newVictims,
      };
    });
  };

  // Handle adding a new victim
  const handleAddVictim = () => {
    setFormData((prev) => ({
      ...prev,
      victims: [
        ...prev.victims,
        { id: Date.now(), name: "", type: "", contact: "" },
      ],
    }));
  };

  // Handle removing a victim
  const handleRemoveVictim = (index) => {
    setFormData((prev) => ({
      ...prev,
      victims: prev.victims.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;

      if (isEditing) {
        response = await casesAPI.update(id, formData);
      } else {
        // For new cases, add creation timestamp and initial update
        const now = new Date().toISOString();
        const newCase = {
          ...formData,
          reportedDate: formData.reportedDate
            ? new Date(formData.reportedDate).toISOString()
            : now,
          createdBy: 1, // Current user ID (in a real app, would be dynamic)
          updates: [
            {
              id: 1,
              date: now,
              officer: formData.assignedTo || 1,
              notes: "Case created and opened for investigation.",
            },
          ],
        };
        response = await casesAPI.create(newCase);
      }

      if (response.success) {
        setSuccess(
          isEditing ? "Case updated successfully" : "Case created successfully"
        );

        // Redirect after a brief delay
        setTimeout(() => {
          navigate(`/cases/${response.data.id}`);
        }, 1500);
      } else {
        setError(response.message || "An error occurred");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error saving case:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (fetchLoading) {
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

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditing ? "Edit Case" : "Create New Case"}
            </h1>
          </div>
        </div>

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

        <Form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <FormSection
            title="Case Information"
            description="Basic details about the case"
          >
            <FormRow>
              <FormGroup label="Case Number" htmlFor="caseNumber" required>
                <Input
                  id="caseNumber"
                  name="caseNumber"
                  value={formData.caseNumber}
                  onChange={handleChange}
                  placeholder="e.g. KIN-2023-001"
                  required
                  disabled={isEditing} // Case number shouldn't be changed for existing cases
                />
              </FormGroup>

              <FormGroup label="Case Type" htmlFor="type" required>
                <Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={options.types}
                  placeholder="Select case type"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup
              label="Case Title"
              htmlFor="title"
              className="mt-4"
              required
            >
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief descriptive title for the case"
                required
              />
            </FormGroup>

            <FormGroup
              label="Description"
              htmlFor="description"
              className="mt-4"
              required
            >
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the case"
                rows={4}
                required
              />
            </FormGroup>

            <FormRow className="mt-4">
              <FormGroup label="Status" htmlFor="status" required>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={options.statuses}
                  placeholder="Select case status"
                  required
                />
              </FormGroup>

              <FormGroup label="Priority" htmlFor="priority" required>
                <Select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={options.priorities}
                  placeholder="Select priority level"
                  required
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          {/* Location and Time Information */}
          <FormSection
            title="Location & Time"
            description="Where and when the incident occurred"
            className="mt-6"
          >
            <FormRow>
              <FormGroup label="Location" htmlFor="location" required>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location where the incident occurred"
                  required
                />
              </FormGroup>

              <FormGroup label="Reported Date" htmlFor="reportedDate" required>
                <Input
                  id="reportedDate"
                  name="reportedDate"
                  type="date"
                  value={formData.reportedDate}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          {/* Assignment Information */}
          <FormSection
            title="Case Assignment"
            description="Assign the case to an officer"
            className="mt-6"
          >
            <FormGroup label="Assigned Officer" htmlFor="assignedTo" required>
              <Select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                options={personnel.map((p) => ({
                  value: p.id,
                  label: `${p.rank} ${p.firstName} ${p.lastName} (${p.badgeNumber})`,
                }))}
                placeholder="Select officer to assign"
                required
              />
            </FormGroup>
          </FormSection>

          {/* Suspects */}
          <FormSection
            title="Suspects"
            description="Persons suspected of involvement in the case"
            className="mt-6"
          >
            {formData.suspects.length > 0 ? (
              formData.suspects.map((suspect, index) => (
                <PersonForm
                  key={suspect.id || index}
                  person={suspect}
                  index={index}
                  type="Suspect"
                  onChange={handleSuspectChange}
                  onRemove={handleRemoveSuspect}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic mb-3">
                No suspects added yet
              </p>
            )}

            <Button
              type="button"
              variant="default"
              onClick={handleAddSuspect}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Suspect
            </Button>
          </FormSection>

          {/* Victims */}
          <FormSection
            title="Victims"
            description="Persons or entities affected by the case"
            className="mt-6"
          >
            {formData.victims.length > 0 ? (
              formData.victims.map((victim, index) => (
                <PersonForm
                  key={victim.id || index}
                  person={victim}
                  index={index}
                  type="Victim"
                  onChange={handleVictimChange}
                  onRemove={handleRemoveVictim}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic mb-3">
                No victims added yet
              </p>
            )}

            <Button
              type="button"
              variant="default"
              onClick={handleAddVictim}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Victim
            </Button>
          </FormSection>

          {/* Form actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              variant="default"
            >
              Cancel
            </Button>
            <SubmitButton
              loading={loading}
              loadingText={isEditing ? "Updating..." : "Creating..."}
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isEditing ? "Update Case" : "Create Case"}
            </SubmitButton>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CaseForm;
