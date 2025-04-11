import {
  personnelData,
  casesData,
  resourcesData,
  stationsData,
  rolesData,
  usersData,
  incidentsData,
  intelligenceData,
  approvalsData,
  wantedPersonsData,
  delay,
  apiResponse,
} from "../utils/mockData";

// Helper function to filter data based on search term
const filterBySearch = (data, search, fields) => {
  if (!search) return data;

  const searchLower = search.toLowerCase();
  return data.filter((item) =>
    fields.some((field) => {
      const value = field
        .split(".")
        .reduce((obj, key) => obj && obj[key], item);
      return value && String(value).toLowerCase().includes(searchLower);
    })
  );
};

// Helper function to sort data
const sortData = (data, sortBy, sortDirection) => {
  if (!sortBy) return data;

  return [...data].sort((a, b) => {
    const aValue =
      sortBy.split(".").reduce((obj, key) => obj && obj[key], a) || "";
    const bValue =
      sortBy.split(".").reduce((obj, key) => obj && obj[key], b) || "";

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });
};

// Helper function to paginate data
const paginateData = (data, page = 1, perPage = 10) => {
  const startIndex = (page - 1) * perPage;
  const paginatedData = data.slice(startIndex, startIndex + perPage);

  return {
    data: paginatedData,
    page,
    per_page: perPage,
    total: data.length,
    total_pages: Math.ceil(data.length / perPage),
  };
};

// Personnel API
// Personnel API
export const personnelAPI = {
  // Get all personnel with filtering, sorting, and pagination
  getAll: async (params = {}) => {
    const {
      search = "",
      sort_by = "lastName",
      sort_direction = "asc",
      page = 1,
      per_page = 10,
      department = null,
      station = null,
      status = null,
    } = params;

    await delay();

    // Filter data based on search term and other filters
    let filteredData = [...personnelData];

    // Apply search
    if (search) {
      filteredData = filterBySearch(filteredData, search, [
        "firstName",
        "lastName",
        "badgeNumber",
        "email",
        "department",
        "station",
      ]);
    }

    // Apply department filter
    if (department) {
      filteredData = filteredData.filter(
        (person) => person.department === department
      );
    }

    // Apply station filter
    if (station) {
      filteredData = filteredData.filter(
        (person) => person.station === station
      );
    }

    // Apply status filter
    if (status) {
      filteredData = filteredData.filter((person) => person.status === status);
    }

    // Sort data
    const sortedData = sortData(filteredData, sort_by, sort_direction);

    // Paginate data
    const paginatedResult = paginateData(sortedData, page, per_page);

    return apiResponse(paginatedResult);
  },

  // Get a single personnel by ID
  getById: async (id) => {
    await delay();

    const person = personnelData.find((p) => p.id === parseInt(id));

    if (!person) {
      return apiResponse(null, false, "Personnel not found");
    }

    return apiResponse(person);
  },

  // Create new personnel
  create: async (data) => {
    await delay();

    // Generate a new ID (would be handled by the database in a real app)
    const newId = Math.max(...personnelData.map((p) => p.id)) + 1;

    const newPerson = {
      id: newId,
      ...data,
      assignments: data.assignments || [],
      specializedTraining: data.specializedTraining || [],
    };

    personnelData.push(newPerson);

    return apiResponse(newPerson);
  },

  // Update personnel
  update: async (id, data) => {
    await delay();

    const index = personnelData.findIndex((p) => p.id === parseInt(id));

    if (index === -1) {
      return apiResponse(null, false, "Personnel not found");
    }

    // Update person data
    const updatedPerson = {
      ...personnelData[index],
      ...data,
    };

    personnelData[index] = updatedPerson;

    return apiResponse(updatedPerson);
  },

  // Delete personnel
  delete: async (id) => {
    await delay();

    const index = personnelData.findIndex((p) => p.id === parseInt(id));

    if (index === -1) {
      return apiResponse(null, false, "Personnel not found");
    }

    // Remove person
    personnelData.splice(index, 1);

    return apiResponse({ id });
  },

  // Get departments list
  getDepartments: async () => {
    await delay();

    // Extract unique departments
    const departments = [
      ...new Set(personnelData.map((p) => p.department)),
    ].map((dept) => ({
      name: dept,
      count: personnelData.filter((p) => p.department === dept).length,
    }));

    return apiResponse(departments);
  },
};

// Cases API
export const casesAPI = {
  // Get all cases with filtering, sorting, and pagination
  getAll: async (params = {}) => {
    const {
      search = "",
      sort_by = "reportedDate",
      sort_direction = "desc",
      page = 1,
      per_page = 10,
      status = null,
      type = null,
      priority = null,
      assigned_to = null,
    } = params;

    await delay();

    // Filter data based on search term and other filters
    let filteredData = [...casesData];

    // Apply search
    if (search) {
      filteredData = filterBySearch(filteredData, search, [
        "title",
        "caseNumber",
        "description",
        "location",
      ]);
    }

    // Apply status filter
    if (status) {
      filteredData = filteredData.filter((case_) => case_.status === status);
    }

    // Apply type filter
    if (type) {
      filteredData = filteredData.filter((case_) => case_.type === type);
    }

    // Apply priority filter
    if (priority) {
      filteredData = filteredData.filter(
        (case_) => case_.priority === priority
      );
    }

    // Apply assigned officer filter
    if (assigned_to) {
      filteredData = filteredData.filter(
        (case_) => case_.assignedTo === parseInt(assigned_to)
      );
    }

    // Sort data
    const sortedData = sortData(filteredData, sort_by, sort_direction);

    // Paginate data
    const paginatedResult = paginateData(sortedData, page, per_page);

    return apiResponse(paginatedResult);
  },

  // Get a single case by ID
  getById: async (id) => {
    await delay();

    const case_ = casesData.find((c) => c.id === parseInt(id));

    if (!case_) {
      return apiResponse(null, false, "Case not found");
    }

    return apiResponse(case_);
  },

  // Create new case
  create: async (data) => {
    await delay();

    // Generate a new ID (would be handled by the database in a real app)
    const newId = Math.max(...casesData.map((c) => c.id)) + 1;

    const newCase = {
      id: newId,
      ...data,
      suspects: data.suspects || [],
      victims: data.victims || [],
      evidence: data.evidence || [],
      updates: data.updates || [],
    };

    casesData.push(newCase);

    return apiResponse(newCase);
  },

  // Update case
  update: async (id, data) => {
    await delay();

    const index = casesData.findIndex((c) => c.id === parseInt(id));

    if (index === -1) {
      return apiResponse(null, false, "Case not found");
    }

    // Update case data
    const updatedCase = {
      ...casesData[index],
      ...data,
    };

    casesData[index] = updatedCase;

    return apiResponse(updatedCase);
  },

  // Delete case
  delete: async (id) => {
    await delay();

    const index = casesData.findIndex((c) => c.id === parseInt(id));

    if (index === -1) {
      return apiResponse(null, false, "Case not found");
    }

    // Remove case
    casesData.splice(index, 1);

    return apiResponse({ id });
  },

  // Get case types
  getTypes: async () => {
    await delay();

    // Extract unique case types
    const types = [...new Set(casesData.map((c) => c.type))].map((type) => ({
      name: type,
      count: casesData.filter((c) => c.type === type).length,
    }));

    return apiResponse(types);
  },

  // Add evidence to case
  addEvidence: async (caseId, evidenceData) => {
    await delay();

    const caseIndex = casesData.findIndex((c) => c.id === parseInt(caseId));

    if (caseIndex === -1) {
      return apiResponse(null, false, "Case not found");
    }

    // Generate new evidence ID
    const newEvidenceId =
      Math.max(...casesData[caseIndex].evidence.map((e) => e.id), 0) + 1;

    const newEvidence = {
      id: newEvidenceId,
      ...evidenceData,
      collectedDate:
        evidenceData.collectedDate || new Date().toISOString().split("T")[0],
    };

    // Add evidence to the case
    casesData[caseIndex].evidence.push(newEvidence);

    return apiResponse(newEvidence);
  },

  // Add case update
  addUpdate: async (caseId, updateData) => {
    await delay();

    const caseIndex = casesData.findIndex((c) => c.id === parseInt(caseId));

    if (caseIndex === -1) {
      return apiResponse(null, false, "Case not found");
    }

    // Generate new update ID
    const newUpdateId =
      Math.max(...casesData[caseIndex].updates.map((u) => u.id), 0) + 1;

    const newUpdate = {
      id: newUpdateId,
      ...updateData,
      date: updateData.date || new Date().toISOString(),
    };

    // Add update to the case
    casesData[caseIndex].updates.push(newUpdate);

    return apiResponse(newUpdate);
  },
};

// Resources API
export const resourcesAPI = {
  // Get all resources with filtering, sorting, and pagination
  getAll: async (params = {}) => {
    const {
      search = "",
      sort_by = "name",
      sort_direction = "asc",
      page = 1,
      per_page = 10,
      type = null,
      status = null,
      location = null,
    } = params;

    await delay();

    // Filter data based on search term and other filters
    let filteredData = [...resourcesData];

    // Apply search
    if (search) {
      filteredData = filterBySearch(filteredData, search, [
        "name",
        "identifier",
        "type",
        "location",
      ]);
    }

    // Apply type filter
    if (type) {
      filteredData = filteredData.filter((resource) => resource.type === type);
    }

    // Apply status filter
    if (status) {
      filteredData = filteredData.filter(
        (resource) => resource.status === status
      );
    }

    // Apply location filter
    if (location) {
      filteredData = filteredData.filter(
        (resource) => resource.location === location
      );
    }

    // Sort data
    const sortedData = sortData(filteredData, sort_by, sort_direction);

    // Paginate data
    const paginatedResult = paginateData(sortedData, page, per_page);

    return apiResponse(paginatedResult);
  },

  // Get a single resource by ID
  getById: async (id) => {
    await delay();

    const resource = resourcesData.find((r) => r.id === parseInt(id));

    if (!resource) {
      return apiResponse(null, false, "Resource not found");
    }

    return apiResponse(resource);
  },

  // Create new resource
  create: async (data) => {
    await delay();

    // Generate a new ID (would be handled by the database in a real app)
    const newId = Math.max(...resourcesData.map((r) => r.id)) + 1;

    const newResource = {
      id: newId,
      ...data,
      specifications: data.specifications || {},
    };

    resourcesData.push(newResource);

    return apiResponse(newResource);
  },

  // Update resource
  update: async (id, data) => {
    await delay();

    const index = resourcesData.findIndex((r) => r.id === parseInt(id));

    if (index === -1) {
      return apiResponse(null, false, "Resource not found");
    }

    // Update resource data
    const updatedResource = {
      ...resourcesData[index],
      ...data,
      specifications: {
        ...resourcesData[index].specifications,
        ...(data.specifications || {}),
      },
    };

    resourcesData[index] = updatedResource;

    return apiResponse(updatedResource);
  },

  // Delete resource
  delete: async (id) => {
    await delay();

    const index = resourcesData.findIndex((r) => r.id === parseInt(id));

    if (index === -1) {
      return apiResponse(null, false, "Resource not found");
    }

    // Remove resource
    resourcesData.splice(index, 1);

    return apiResponse({ id });
  },

  // Get resource types
  getTypes: async () => {
    await delay();

    // Extract unique resource types
    const types = [...new Set(resourcesData.map((r) => r.type))].map(
      (type) => ({
        name: type,
        count: resourcesData.filter((r) => r.type === type).length,
      })
    );

    return apiResponse(types);
  },

  // Request resource assignment
  requestAssignment: async (resourceId, officerId, requestDetails) => {
    await delay();

    const resourceIndex = resourcesData.findIndex(
      (r) => r.id === parseInt(resourceId)
    );

    if (resourceIndex === -1) {
      return apiResponse(null, false, "Resource not found");
    }

    if (resourcesData[resourceIndex].status !== "Available") {
      return apiResponse(
        null,
        false,
        "Resource is not available for assignment"
      );
    }

    // Create approval request (in a real app, this would link to the approvals system)
    const approvalId = Math.max(...approvalsData.map((a) => a.id)) + 1;
    const newApproval = {
      id: approvalId,
      type: "Resource Request",
      referenceNumber: `REQ-2023-${1000 + approvalId}`,
      title: `Resource Assignment Request: ${resourcesData[resourceIndex].name}`,
      description: requestDetails.reason || "Resource assignment request",
      requestedBy: officerId,
      requestDate: new Date().toISOString(),
      status: "Pending",
      currentApprover: requestDetails.supervisorId || null,
      approvalChain: [
        {
          level: 1,
          role: "station_commander",
          status: "Pending",
          approver: requestDetails.supervisorId || null,
          date: null,
        },
      ],
      relatedItem: resourceId,
      comments: [
        {
          user: officerId,
          date: new Date().toISOString(),
          text: requestDetails.reason || "Requesting resource assignment",
        },
      ],
    };

    approvalsData.push(newApproval);

    return apiResponse({
      message: "Assignment request submitted for approval",
      approvalId,
    });
  },
};

// Stations API
export const stationsAPI = {
  // Get all stations with filtering, sorting, and pagination
  getAll: async (params = {}) => {
    const {
      search = "",
      sort_by = "name",
      sort_direction = "asc",
      page = 1,
      per_page = 10,
      province = null,
      type = null,
    } = params;

    await delay();

    // Filter data based on search term and other filters
    let filteredData = [...stationsData];

    // Apply search
    if (search) {
      filteredData = filterBySearch(filteredData, search, [
        "name",
        "code",
        "address",
        "province",
      ]);
    }

    // Apply province filter
    if (province) {
      filteredData = filteredData.filter(
        (station) => station.province === province
      );
    }

    // Apply type filter
    if (type) {
      filteredData = filteredData.filter((station) => station.type === type);
    }

    // Sort data
    const sortedData = sortData(filteredData, sort_by, sort_direction);

    // Paginate data
    const paginatedResult = paginateData(sortedData, page, per_page);

    return apiResponse(paginatedResult);
  },

  // Get a single station by ID
  getById: async (id) => {
    await delay();

    const station = stationsData.find((s) => s.id === parseInt(id));

    if (!station) {
      return apiResponse(null, false, "Station not found");
    }

    return apiResponse(station);
  },

  // Get personnel assigned to a station
  getStationPersonnel: async (stationId, params = {}) => {
    const { page = 1, per_page = 10 } = params;

    await delay();

    const station = stationsData.find((s) => s.id === parseInt(stationId));

    if (!station) {
      return apiResponse(null, false, "Station not found");
    }

    // Find personnel assigned to the station
    const stationPersonnel = personnelData.filter(
      (p) => p.station === station.name
    );

    // Paginate data
    const paginatedResult = paginateData(stationPersonnel, page, per_page);

    return apiResponse(paginatedResult);
  },

  // Get resources assigned to a station
  getStationResources: async (stationId, params = {}) => {
    const { page = 1, per_page = 10 } = params;

    await delay();

    const station = stationsData.find((s) => s.id === parseInt(stationId));

    if (!station) {
      return apiResponse(null, false, "Station not found");
    }

    // Find resources assigned to the station
    const stationResources = resourcesData.filter(
      (r) => r.location === station.name
    );

    // Paginate data
    const paginatedResult = paginateData(stationResources, page, per_page);

    return apiResponse(paginatedResult);
  },

  // Get provinces list
  getProvinces: async () => {
    await delay();

    // Extract unique provinces
    const provinces = [...new Set(stationsData.map((s) => s.province))].map(
      (province) => ({
        name: province,
        count: stationsData.filter((s) => s.province === province).length,
      })
    );

    return apiResponse(provinces);
  },
};

// Authentication and User Management API
export const authAPI = {
  // Login
  login: async (credentials) => {
    await delay();

    const { email, password } = credentials;

    // Find user by email (in a real app, this would include password verification)
    const user = usersData.find((u) => u.email === email);

    if (!user) {
      return apiResponse(null, false, "Invalid credentials");
    }

    // In a real app, we would verify the password hash here
    // For the demo, we'll accept any password

    // Create mock JWT token
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;

    // Update last login time
    user.lastLogin = new Date().toISOString();

    return apiResponse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        station: user.station,
        avatar: user.avatar,
      },
    });
  },

  // Get current user profile
  getProfile: async () => {
    await delay();

    // In a real app, this would use the authenticated user's ID
    // For the demo, we'll return the first user
    const user = { ...usersData[0] };

    // Don't expose sensitive data
    delete user.password;

    return apiResponse(user);
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    await delay();

    const userIndex = usersData.findIndex((u) => u.id === parseInt(userId));

    if (userIndex === -1) {
      return apiResponse(null, false, "User not found");
    }

    // Update only allowed fields
    const updatedUser = {
      ...usersData[userIndex],
      name: profileData.name || usersData[userIndex].name,
      email: profileData.email || usersData[userIndex].email,
      avatar: profileData.avatar || usersData[userIndex].avatar,
    };

    usersData[userIndex] = updatedUser;

    // Don't expose sensitive data
    delete updatedUser.password;

    return apiResponse(updatedUser);
  },

  // Change password
  changePassword: async (userId, passwordData) => {
    await delay();

    const { currentPassword, newPassword } = passwordData;

    const userIndex = usersData.findIndex((u) => u.id === parseInt(userId));

    if (userIndex === -1) {
      return apiResponse(null, false, "User not found");
    }

    // In a real app, we would verify the current password here

    // For the demo, we'll just pretend to update the password
    return apiResponse({ success: true });
  },
};

// Roles and Permissions API
export const rolesAPI = {
  // Get all roles
  getAll: async () => {
    await delay();

    return apiResponse(rolesData);
  },

  // Get a single role by ID
  getById: async (id) => {
    await delay();

    const role = rolesData.find((r) => r.id === parseInt(id));

    if (!role) {
      return apiResponse(null, false, "Role not found");
    }

    return apiResponse(role);
  },

  // Create new role
  create: async (data) => {
    await delay();

    // Generate a new ID
    const newId = Math.max(...rolesData.map((r) => r.id)) + 1;

    const newRole = {
      id: newId,
      ...data,
      permissions: data.permissions || [],
    };

    rolesData.push(newRole);

    return apiResponse(newRole);
  },

  // Update role
  update: async (id, data) => {
    await delay();

    const index = rolesData.findIndex((r) => r.id === parseInt(id));

    if (index === -1) {
      return apiResponse(null, false, "Role not found");
    }

    // Update role data
    const updatedRole = {
      ...rolesData[index],
      ...data,
    };

    rolesData[index] = updatedRole;

    return apiResponse(updatedRole);
  },

  // Delete role
  delete: async (id) => {
    await delay();

    const index = rolesData.findIndex((r) => r.id === parseInt(id));

    if (index === -1) {
      return apiResponse(null, false, "Role not found");
    }

    // Check if any users have this role
    const usersWithRole = usersData.filter(
      (u) => u.role === rolesData[index].name
    );

    if (usersWithRole.length > 0) {
      return apiResponse(
        null,
        false,
        "Cannot delete role that is assigned to users"
      );
    }

    // Remove role
    rolesData.splice(index, 1);

    return apiResponse({ id });
  },

  // Get user permissions
  getUserPermissions: async (userId) => {
    await delay();

    const user = usersData.find((u) => u.id === parseInt(userId));

    if (!user) {
      return apiResponse(null, false, "User not found");
    }

    // Find role for this user
    const role = rolesData.find((r) => r.name === user.role);

    if (!role) {
      return apiResponse([], false, "Role not found");
    }

    return apiResponse(role.permissions);
  },
};
