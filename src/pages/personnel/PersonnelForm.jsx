import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import {
  Form,
  FormSection,
  FormRow,
  FormGroup,
  Input,
  Select,
  Textarea,
  RadioGroup,
  SubmitButton,
  Button,
  FormAlert,
} from "../../components/ui/Form";
import { personnelAPI } from "../../services/mockAPI";

const PersonnelForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // Form state
  const [formData, setFormData] = useState({
    badgeNumber: "",
    rank: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationalId: "",
    phone: "",
    email: "",
    address: "",
    department: "",
    station: "",
    joiningDate: "",
    status: "Active",
    specializedTraining: [],
  });

  // Form processing state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Options for select fields
  const [options, setOptions] = useState({
    ranks: [
      { value: "Officer", label: "Officer" },
      { value: "Sergeant", label: "Sergeant" },
      { value: "Lieutenant", label: "Lieutenant" },
      { value: "Captain", label: "Captain" },
      { value: "Inspector", label: "Inspector" },
      { value: "Chief Inspector", label: "Chief Inspector" },
      { value: "Commissioner", label: "Commissioner" },
    ],
    departments: [
      { value: "General Duties", label: "General Duties" },
      { value: "Criminal Investigations", label: "Criminal Investigations" },
      { value: "Traffic", label: "Traffic" },
      { value: "Community Affairs", label: "Community Affairs" },
      { value: "Administration", label: "Administration" },
    ],
    stations: [
      { value: "Kinshasa Central", label: "Kinshasa Central" },
      { value: "Lubumbashi Main", label: "Lubumbashi Main" },
      { value: "Goma Central", label: "Goma Central" },
      { value: "Bukavu Police Station", label: "Bukavu Police Station" },
      { value: "Matadi Police Station", label: "Matadi Police Station" },
    ],
    statuses: [
      { value: "Active", label: "Active" },
      { value: "On Leave", label: "On Leave" },
      { value: "Suspended", label: "Suspended" },
      { value: "Retired", label: "Retired" },
    ],
  });

  // Fetch personnel data for editing
  useEffect(() => {
    if (isEditing) {
      const fetchPersonnel = async () => {
        setLoading(true);
        try {
          const response = await personnelAPI.getById(id);
          if (response.success) {
            setFormData(response.data);
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
    }
  }, [id, isEditing]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle specialized training multiselect
  const handleTrainingChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          specializedTraining: [...prev.specializedTraining, value],
        };
      } else {
        return {
          ...prev,
          specializedTraining: prev.specializedTraining.filter(
            (item) => item !== value
          ),
        };
      }
    });
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
        response = await personnelAPI.update(id, formData);
      } else {
        response = await personnelAPI.create(formData);
      }

      if (response.success) {
        setSuccess(
          isEditing
            ? "Personnel record updated successfully"
            : "Personnel record created successfully"
        );

        // Redirect after a brief delay
        setTimeout(() => {
          navigate(`/personnel/${response.data.id}`);
        }, 1500);
      } else {
        setError(response.message || "An error occurred");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error saving personnel:", error);
    } finally {
      setLoading(false);
    }
  };

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
              {isEditing ? "Edit Personnel" : "Add New Personnel"}
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
            title="Basic Information"
            description="Personnel identification and personal details"
          >
            <FormRow>
              <FormGroup label="Badge Number" htmlFor="badgeNumber" required>
                <Input
                  id="badgeNumber"
                  name="badgeNumber"
                  value={formData.badgeNumber}
                  onChange={handleChange}
                  placeholder="e.g. NPC-001"
                  required
                />
              </FormGroup>

              <FormGroup label="Rank" htmlFor="rank" required>
                <Select
                  id="rank"
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  options={options.ranks}
                  placeholder="Select rank"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow className="mt-4">
              <FormGroup label="First Name" htmlFor="firstName" required>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </FormGroup>

              <FormGroup label="Last Name" htmlFor="lastName" required>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </FormGroup>

              <FormGroup label="Gender" htmlFor="gender" required>
                <RadioGroup
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow className="mt-4">
              <FormGroup label="Date of Birth" htmlFor="dateOfBirth" required>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup label="National ID" htmlFor="nationalId" required>
                <Input
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="National identification number"
                  required
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          {/* Contact Information */}
          <FormSection
            title="Contact Information"
            description="Phone, email, and address details"
            className="mt-6"
          >
            <FormRow>
              <FormGroup label="Phone Number" htmlFor="phone" required>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +243812345678"
                  required
                />
              </FormGroup>

              <FormGroup label="Email Address" htmlFor="email" required>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. name@police.cd"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup
              label="Address"
              htmlFor="address"
              className="mt-4"
              required
            >
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full residential address"
                required
              />
            </FormGroup>
          </FormSection>

          {/* Employment Information */}
          <FormSection
            title="Employment Information"
            description="Department, station, and status details"
            className="mt-6"
          >
            <FormRow>
              <FormGroup label="Department" htmlFor="department" required>
                <Select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  options={options.departments}
                  placeholder="Select department"
                  required
                />
              </FormGroup>

              <FormGroup label="Station" htmlFor="station" required>
                <Select
                  id="station"
                  name="station"
                  value={formData.station}
                  onChange={handleChange}
                  options={options.stations}
                  placeholder="Select station"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow className="mt-4">
              <FormGroup label="Joining Date" htmlFor="joiningDate" required>
                <Input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup label="Status" htmlFor="status" required>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={options.statuses}
                  placeholder="Select status"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup label="Specialized Training" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                {[
                  "Basic Police Training",
                  "Criminal Investigation",
                  "Traffic Management",
                  "Community Policing",
                  "Firearms",
                  "Tactical Response",
                  "Forensics",
                  "Cybercrime",
                  "Hostage Negotiation",
                  "Public Relations",
                  "First Aid/Medical",
                  "Counter-Terrorism",
                ].map((training) => (
                  <div key={training} className="flex items-center">
                    <input
                      id={`training-${training}`}
                      name="specializedTraining"
                      type="checkbox"
                      value={training}
                      checked={formData.specializedTraining.includes(training)}
                      onChange={handleTrainingChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label
                      htmlFor={`training-${training}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {training}
                    </label>
                  </div>
                ))}
              </div>
            </FormGroup>
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
              {isEditing ? "Update Personnel" : "Create Personnel"}
            </SubmitButton>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PersonnelForm;
