// Mock data for the NPIMS system to simulate API responses

// Personnel data
export const personnelData = [
  {
    id: 1,
    rank: "Captain",
    badgeNumber: "NPC-001",
    firstName: "Jean",
    lastName: "Kabila",
    gender: "Male",
    dateOfBirth: "1985-06-15",
    nationalId: "DRC19850615M12345",
    phone: "+243812345678",
    email: "jean.kabila@police.cd",
    address: "123 Avenue Lumumba, Kinshasa",
    department: "Investigations",
    station: "Kinshasa Central",
    joiningDate: "2010-03-10",
    status: "Active",
    supervisor: null,
    photo: null,
    specializedTraining: [
      "Criminal Investigation",
      "Firearms",
      "Tactical Response",
    ],
    assignments: [
      {
        id: 101,
        title: "Lead Investigator",
        startDate: "2020-01-15",
        endDate: null,
      },
      {
        id: 102,
        title: "Patrol Officer",
        startDate: "2010-03-10",
        endDate: "2020-01-14",
      },
    ],
  },
  {
    id: 2,
    rank: "Lieutenant",
    badgeNumber: "NPC-002",
    firstName: "Marie",
    lastName: "Tshombe",
    gender: "Female",
    dateOfBirth: "1990-02-20",
    nationalId: "DRC19900220F54321",
    phone: "+243823456789",
    email: "marie.tshombe@police.cd",
    address: "45 Avenue Mobutu, Kinshasa",
    department: "Community Affairs",
    station: "Kinshasa Central",
    joiningDate: "2012-06-05",
    status: "Active",
    supervisor: 1,
    photo: null,
    specializedTraining: ["Community Policing", "Public Relations"],
    assignments: [
      {
        id: 103,
        title: "Community Relations Officer",
        startDate: "2015-08-01",
        endDate: null,
      },
    ],
  },
  {
    id: 3,
    rank: "Sergeant",
    badgeNumber: "NPC-003",
    firstName: "Pierre",
    lastName: "Mulele",
    gender: "Male",
    dateOfBirth: "1988-11-10",
    nationalId: "DRC19881110M67890",
    phone: "+243834567890",
    email: "pierre.mulele@police.cd",
    address: "78 Avenue Patrice, Lubumbashi",
    department: "Traffic",
    station: "Lubumbashi Main",
    joiningDate: "2011-09-15",
    status: "Active",
    supervisor: null,
    photo: null,
    specializedTraining: ["Traffic Management", "Accident Investigation"],
    assignments: [
      {
        id: 104,
        title: "Traffic Section Head",
        startDate: "2018-03-12",
        endDate: null,
      },
    ],
  },
  {
    id: 4,
    rank: "Officer",
    badgeNumber: "NPC-004",
    firstName: "Sophie",
    lastName: "Mobutu",
    gender: "Female",
    dateOfBirth: "1992-08-25",
    nationalId: "DRC19920825F98765",
    phone: "+243845678901",
    email: "sophie.mobutu@police.cd",
    address: "22 Rue Kasai, Goma",
    department: "General Duties",
    station: "Goma Central",
    joiningDate: "2015-04-03",
    status: "On Leave",
    supervisor: 3,
    photo: null,
    specializedTraining: ["Basic Police Training"],
    assignments: [
      {
        id: 105,
        title: "Patrol Officer",
        startDate: "2015-04-03",
        endDate: null,
      },
    ],
  },
  {
    id: 5,
    rank: "Inspector",
    badgeNumber: "NPC-005",
    firstName: "Joseph",
    lastName: "Kasa-Vubu",
    gender: "Male",
    dateOfBirth: "1980-05-30",
    nationalId: "DRC19800530M24680",
    phone: "+243856789012",
    email: "joseph.kasavubu@police.cd",
    address: "56 Boulevard Liberation, Kinshasa",
    department: "Criminal Investigations",
    station: "Kinshasa Central",
    joiningDate: "2005-11-20",
    status: "Active",
    supervisor: null,
    photo: null,
    specializedTraining: [
      "Advanced Criminal Investigation",
      "Hostage Negotiation",
      "Forensics",
    ],
    assignments: [
      {
        id: 106,
        title: "Chief Inspector",
        startDate: "2018-01-10",
        endDate: null,
      },
      {
        id: 107,
        title: "Detective",
        startDate: "2005-11-20",
        endDate: "2018-01-09",
      },
    ],
  },
];

// Case data
export const casesData = [
  {
    id: 1,
    caseNumber: "KIN-2023-001",
    title: "Armed Robbery at Central Market",
    description:
      "Armed robbery at Central Market on April 15, 2023. Three suspects armed with pistols stole cash and valuables.",
    status: "Active",
    priority: "High",
    type: "Robbery",
    location: "Central Market, Kinshasa",
    reportedDate: "2023-04-15T14:30:00",
    assignedTo: 1, // Officer ID
    createdBy: 5,
    suspects: [
      {
        id: 1,
        name: "Unknown Suspect 1",
        description: "Male, approx. 30 years, 180cm, dark clothing",
      },
      {
        id: 2,
        name: "Unknown Suspect 2",
        description: "Male, approx. 25 years, 175cm, red cap",
      },
    ],
    victims: [
      { id: 1, name: "Market Vendor Association", type: "Organization" },
      {
        id: 2,
        name: "Jean Bemba",
        type: "Individual",
        contact: "+243898765432",
      },
    ],
    evidence: [
      {
        id: 1,
        type: "Witness Statement",
        description: "Statement from market security guard",
        collectedDate: "2023-04-15",
      },
      {
        id: 2,
        type: "CCTV Footage",
        description: "Market surveillance camera recording",
        collectedDate: "2023-04-16",
      },
    ],
    updates: [
      {
        id: 1,
        date: "2023-04-16T09:15:00",
        officer: 1,
        notes: "Reviewed CCTV footage, identified possible suspects",
      },
      {
        id: 2,
        date: "2023-04-18T14:00:00",
        officer: 1,
        notes: "Interviewed three witnesses, compiled descriptions",
      },
    ],
  },
  {
    id: 2,
    caseNumber: "LUB-2023-042",
    title: "Vehicle Theft on Avenue Kasavubu",
    description:
      "Toyota Land Cruiser stolen from residential parking at Avenue Kasavubu. Vehicle license: ABC-123.",
    status: "Active",
    priority: "Medium",
    type: "Theft",
    location: "Avenue Kasavubu, Lubumbashi",
    reportedDate: "2023-05-02T08:45:00",
    assignedTo: 3,
    createdBy: 3,
    suspects: [],
    victims: [
      {
        id: 3,
        name: "Claude Masala",
        type: "Individual",
        contact: "+243876543210",
      },
    ],
    evidence: [
      {
        id: 3,
        type: "Victim Statement",
        description: "Statement from vehicle owner",
        collectedDate: "2023-05-02",
      },
    ],
    updates: [
      {
        id: 3,
        date: "2023-05-03T10:30:00",
        officer: 3,
        notes: "Vehicle details circulated to all stations",
      },
    ],
  },
  {
    id: 3,
    caseNumber: "KIN-2023-015",
    title: "Assault at Nightclub Diamond",
    description:
      "Physical assault at Nightclub Diamond. Victim sustained injuries requiring medical attention.",
    status: "Closed",
    priority: "Medium",
    type: "Assault",
    location: "Nightclub Diamond, Kinshasa",
    reportedDate: "2023-03-12T02:15:00",
    assignedTo: 2,
    createdBy: 1,
    suspects: [
      {
        id: 3,
        name: "Patrick Muamba",
        description: "Male, 28 years, club regular",
      },
    ],
    victims: [
      {
        id: 4,
        name: "Antoine Kalonji",
        type: "Individual",
        contact: "+243912345678",
      },
    ],
    evidence: [
      {
        id: 4,
        type: "Medical Report",
        description: "Hospital report detailing injuries",
        collectedDate: "2023-03-12",
      },
      {
        id: 5,
        type: "Witness Statements",
        description: "Statements from 4 witnesses",
        collectedDate: "2023-03-13",
      },
    ],
    updates: [
      {
        id: 4,
        date: "2023-03-14T11:00:00",
        officer: 2,
        notes: "Suspect identified and arrested",
      },
      {
        id: 5,
        date: "2023-03-20T15:30:00",
        officer: 2,
        notes: "Case closed, suspect charged with assault",
      },
    ],
  },
  {
    id: 4,
    caseNumber: "GOM-2023-007",
    title: "Missing Person - Adolescent",
    description:
      "16-year-old female, Marie Lokela, reported missing. Last seen at school on April 20.",
    status: "Active",
    priority: "High",
    type: "Missing Person",
    location: "Goma, North Kivu",
    reportedDate: "2023-04-21T19:00:00",
    assignedTo: 4,
    createdBy: 4,
    suspects: [],
    victims: [
      { id: 5, name: "Marie Lokela", type: "Individual", contact: "N/A" },
    ],
    evidence: [
      {
        id: 6,
        type: "Photographs",
        description: "Recent photographs of missing person",
        collectedDate: "2023-04-21",
      },
      {
        id: 7,
        type: "School Records",
        description: "Attendance and contact information",
        collectedDate: "2023-04-22",
      },
    ],
    updates: [
      {
        id: 6,
        date: "2023-04-22T08:15:00",
        officer: 4,
        notes: "Alert circulated to all stations",
      },
      {
        id: 7,
        date: "2023-04-23T14:40:00",
        officer: 4,
        notes: "Interviewed schoolmates and teachers",
      },
    ],
  },
  {
    id: 5,
    caseNumber: "KIN-2023-022",
    title: "Fraud at National Bank Branch",
    description:
      "Suspected employee fraud at National Bank Kinshasa Branch. Unauthorized transactions detected.",
    status: "Active",
    priority: "Medium",
    type: "Fraud",
    location: "National Bank, Kinshasa",
    reportedDate: "2023-04-05T16:20:00",
    assignedTo: 5,
    createdBy: 1,
    suspects: [
      {
        id: 4,
        name: "Internal Bank Employee",
        description: "Investigation ongoing to identify specific employee(s)",
      },
    ],
    victims: [
      {
        id: 6,
        name: "National Bank",
        type: "Organization",
        contact: "+243234567890",
      },
    ],
    evidence: [
      {
        id: 8,
        type: "Transaction Records",
        description: "Bank statements and transaction logs",
        collectedDate: "2023-04-06",
      },
      {
        id: 9,
        type: "Security Footage",
        description: "Bank security camera recordings",
        collectedDate: "2023-04-06",
      },
    ],
    updates: [
      {
        id: 8,
        date: "2023-04-07T10:00:00",
        officer: 5,
        notes: "Financial audit initiated",
      },
      {
        id: 9,
        date: "2023-04-10T16:15:00",
        officer: 5,
        notes: "Suspicious transaction patterns identified",
      },
    ],
  },
];

// Resources data
export const resourcesData = [
  {
    id: 1,
    type: "Vehicle",
    name: "Toyota Land Cruiser",
    identifier: "NPF-V-001",
    status: "Available",
    location: "Kinshasa Central Station",
    assignedTo: null,
    condition: "Good",
    acquisitionDate: "2022-01-15",
    lastMaintenance: "2023-03-10",
    nextMaintenanceDue: "2023-09-10",
    specifications: {
      model: "Land Cruiser 76",
      year: 2022,
      licensePlate: "DRC-POL-001",
      fuelType: "Diesel",
      capacity: 8,
    },
  },
  {
    id: 2,
    type: "Vehicle",
    name: "Toyota Hilux",
    identifier: "NPF-V-002",
    status: "In Use",
    location: "Goma Central Station",
    assignedTo: 4,
    condition: "Excellent",
    acquisitionDate: "2022-02-20",
    lastMaintenance: "2023-02-15",
    nextMaintenanceDue: "2023-08-15",
    specifications: {
      model: "Hilux Double Cab",
      year: 2022,
      licensePlate: "DRC-POL-002",
      fuelType: "Diesel",
      capacity: 5,
    },
  },
  {
    id: 3,
    type: "Weapon",
    name: "Glock 17",
    identifier: "NPF-W-001",
    status: "Assigned",
    location: "Kinshasa Central Station Armory",
    assignedTo: 1,
    condition: "Excellent",
    acquisitionDate: "2021-11-05",
    lastMaintenance: "2023-01-20",
    nextMaintenanceDue: "2023-07-20",
    specifications: {
      model: "Glock 17 Gen5",
      serialNumber: "PW-12345-G",
      caliber: "9mm",
      type: "Handgun",
    },
  },
  {
    id: 4,
    type: "Equipment",
    name: "Bulletproof Vest",
    identifier: "NPF-E-001",
    status: "Available",
    location: "Lubumbashi Main Station",
    assignedTo: null,
    condition: "Good",
    acquisitionDate: "2022-03-15",
    lastMaintenance: null,
    nextMaintenanceDue: null,
    specifications: {
      model: "Level IIIA",
      size: "Large",
      manufacturer: "SafeGuard Inc.",
    },
  },
  {
    id: 5,
    type: "Equipment",
    name: "Radio Set",
    identifier: "NPF-E-002",
    status: "In Use",
    location: "Kinshasa Central Station",
    assignedTo: 2,
    condition: "Good",
    acquisitionDate: "2022-01-10",
    lastMaintenance: "2023-04-05",
    nextMaintenanceDue: "2023-10-05",
    specifications: {
      model: "SecureComm X5",
      frequency: "UHF",
      range: "5km",
      batteryLife: "24 hours",
    },
  },
];

// Station data
export const stationsData = [
  {
    id: 1,
    name: "Kinshasa Central Police Station",
    code: "KIN-01",
    type: "Headquarters",
    address: "123 Avenue Lumumba, Kinshasa",
    province: "Kinshasa",
    phone: "+243999123456",
    email: "kinshasa.central@police.cd",
    commander: 1, // Officer ID
    staffCount: 125,
    facilities: [
      "Detention Cells",
      "Armory",
      "Investigation Unit",
      "Traffic Unit",
      "Administration",
      "Training Room",
    ],
    jurisdiction: "Central Kinshasa District",
    coordinates: { latitude: -4.325, longitude: 15.322 },
  },
  {
    id: 2,
    name: "Lubumbashi Main Station",
    code: "LUB-01",
    type: "Provincial",
    address: "45 Avenue Mobutu, Lubumbashi",
    province: "Haut-Katanga",
    phone: "+243999234567",
    email: "lubumbashi.main@police.cd",
    commander: 3, // Officer ID
    staffCount: 78,
    facilities: [
      "Detention Cells",
      "Armory",
      "Investigation Unit",
      "Traffic Unit",
      "Administration",
    ],
    jurisdiction: "Lubumbashi Metropolitan Area",
    coordinates: { latitude: -11.665, longitude: 27.479 },
  },
  {
    id: 3,
    name: "Goma Central Station",
    code: "GOM-01",
    type: "Provincial",
    address: "12 Boulevard Lake, Goma",
    province: "North Kivu",
    phone: "+243999345678",
    email: "goma.central@police.cd",
    commander: 4, // Officer ID
    staffCount: 65,
    facilities: [
      "Detention Cells",
      "Armory",
      "Investigation Unit",
      "Administration",
    ],
    jurisdiction: "Goma City and Surroundings",
    coordinates: { latitude: -1.677, longitude: 29.226 },
  },
  {
    id: 4,
    name: "Bukavu Police Station",
    code: "BUK-01",
    type: "Provincial",
    address: "78 Avenue Patrice, Bukavu",
    province: "South Kivu",
    phone: "+243999456789",
    email: "bukavu.main@police.cd",
    commander: null, // No assigned commander
    staffCount: 42,
    facilities: ["Detention Cells", "Armory", "Administration"],
    jurisdiction: "Bukavu City Area",
    coordinates: { latitude: -2.491, longitude: 28.846 },
  },
  {
    id: 5,
    name: "Matadi Police Station",
    code: "MAT-01",
    type: "District",
    address: "34 Port Road, Matadi",
    province: "Kongo Central",
    phone: "+243999567890",
    email: "matadi.station@police.cd",
    commander: null, // No assigned commander
    staffCount: 38,
    facilities: ["Detention Cells", "Administration", "Traffic Unit"],
    jurisdiction: "Matadi Port Area",
    coordinates: { latitude: -5.826, longitude: 13.463 },
  },
];

// Roles and permissions
export const rolesData = [
  {
    id: 1,
    name: "national_commissioner",
    displayName: "National Police Commissioner",
    description: "Highest authority in the national police force",
    permissions: ["*"], // Wildcard for all permissions
  },
  {
    id: 2,
    name: "provincial_commissioner",
    displayName: "Provincial Commissioner",
    description: "Head of police in a province",
    permissions: [
      "personnel:read",
      "personnel:create",
      "personnel:update",
      "cases:read",
      "cases:create",
      "cases:update",
      "cases:delete",
      "resources:read",
      "resources:create",
      "resources:update",
      "resources:approve",
      "intelligence:read",
      "intelligence:create",
      "reports:read",
      "reports:create",
      "admin:read",
    ],
  },
  {
    id: 3,
    name: "station_commander",
    displayName: "Station Commander",
    description: "Head of a police station",
    permissions: [
      "personnel:read",
      "cases:read",
      "cases:create",
      "cases:update",
      "resources:read",
      "resources:request",
      "intelligence:read",
      "intelligence:create",
      "reports:read",
      "reports:create",
    ],
  },
  {
    id: 4,
    name: "officer",
    displayName: "Police Officer",
    description: "Regular police officer",
    permissions: [
      "personnel:read:self",
      "cases:read",
      "cases:create",
      "resources:read",
      "resources:request",
      "intelligence:read",
      "reports:read",
      "reports:create:self",
    ],
  },
  {
    id: 5,
    name: "admin_staff",
    displayName: "Administrative Staff",
    description: "Non-officer administrative personnel",
    permissions: [
      "personnel:read",
      "resources:read",
      "resources:create",
      "resources:update",
      "reports:read",
      "reports:create",
    ],
  },
];

// User data
export const usersData = [
  {
    id: 1,
    name: "Jean Kabila",
    email: "commissioner@police.cd",
    role: "national_commissioner",
    station: "Kinshasa Central",
    lastLogin: "2023-06-01T08:30:25",
    status: "active",
    avatar: null,
  },
  {
    id: 2,
    name: "Marie Tshombe",
    email: "province@police.cd",
    role: "provincial_commissioner",
    station: "Kinshasa Central",
    lastLogin: "2023-06-01T09:15:40",
    status: "active",
    avatar: null,
  },
  {
    id: 3,
    name: "Pierre Mulele",
    email: "station@police.cd",
    role: "station_commander",
    station: "Lubumbashi Main",
    lastLogin: "2023-05-31T14:22:10",
    status: "active",
    avatar: null,
  },
  {
    id: 4,
    name: "Sophie Mobutu",
    email: "officer@police.cd",
    role: "officer",
    station: "Goma Central",
    lastLogin: "2023-06-01T07:45:12",
    status: "active",
    avatar: null,
  },
  {
    id: 5,
    name: "Joseph Kasa-Vubu",
    email: "admin@police.cd",
    role: "admin_staff",
    station: "Kinshasa Central",
    lastLogin: "2023-05-31T16:05:33",
    status: "active",
    avatar: null,
  },
];

// Incident reports data
export const incidentsData = [
  {
    id: 1,
    referenceNumber: "INC-2023-0051",
    type: "Theft",
    status: "Reported",
    priority: "Medium",
    location: "Central Market, Kinshasa",
    description:
      "Pickpocketing incident at the central market. Victim's wallet and phone stolen.",
    reportedBy: "Citizen",
    reporterContact: "+243901234567",
    assignedTo: 4, // Officer ID
    reportedDate: "2023-06-01T10:15:00",
    lastUpdated: "2023-06-01T11:30:00",
    coordinates: { latitude: -4.324, longitude: 15.32 },
    relatedCase: null, // Will be linked to a case if investigation opened
  },
  {
    id: 2,
    referenceNumber: "INC-2023-0052",
    type: "Traffic Accident",
    status: "Resolved",
    priority: "Medium",
    location: "Avenue Lumumba & 5th Street, Kinshasa",
    description: "Two-vehicle collision. Minor injuries, vehicles damaged.",
    reportedBy: "Traffic Officer",
    reporterContact: null,
    assignedTo: 3, // Officer ID
    reportedDate: "2023-05-31T15:45:00",
    lastUpdated: "2023-05-31T17:20:00",
    coordinates: { latitude: -4.328, longitude: 15.326 },
    relatedCase: null,
  },
  {
    id: 3,
    referenceNumber: "INC-2023-0053",
    type: "Disturbance",
    status: "Active",
    priority: "Low",
    location: "Club Diamond, Kinshasa",
    description: "Noise complaint at nightclub. Multiple calls from neighbors.",
    reportedBy: "Citizen",
    reporterContact: "+243912345678",
    assignedTo: 4, // Officer ID
    reportedDate: "2023-06-01T01:30:00",
    lastUpdated: "2023-06-01T02:15:00",
    coordinates: { latitude: -4.332, longitude: 15.319 },
    relatedCase: null,
  },
  {
    id: 4,
    referenceNumber: "INC-2023-0054",
    type: "Suspicious Activity",
    status: "Under Investigation",
    priority: "High",
    location: "Near Central Bank, Lubumbashi",
    description:
      "Suspicious individuals monitoring bank entrance. Potential robbery planning.",
    reportedBy: "Security Guard",
    reporterContact: "+243923456789",
    assignedTo: 3, // Officer ID
    reportedDate: "2023-06-01T09:20:00",
    lastUpdated: "2023-06-01T10:05:00",
    coordinates: { latitude: -11.668, longitude: 27.483 },
    relatedCase: null,
  },
  {
    id: 5,
    referenceNumber: "INC-2023-0055",
    type: "Missing Person",
    status: "Active",
    priority: "High",
    location: "Goma Residential Area",
    description:
      "8-year-old child missing from home since afternoon. Last seen wearing blue shirt and shorts.",
    reportedBy: "Parent",
    reporterContact: "+243934567890",
    assignedTo: 4, // Officer ID
    reportedDate: "2023-06-01T18:30:00",
    lastUpdated: "2023-06-01T19:15:00",
    coordinates: { latitude: -1.675, longitude: 29.221 },
    relatedCase: null,
  },
];

// Intelligence reports data
export const intelligenceData = [
  {
    id: 1,
    referenceNumber: "INT-2023-001",
    title: "Drug Trafficking Network in Eastern Provinces",
    classification: "Confidential",
    sourceName: "Field Intelligence",
    sourceReliability: "Medium",
    dateDeveloped: "2023-05-15",
    summary:
      "Intelligence suggesting organized drug trafficking operation across eastern border. Multiple suspects identified.",
    details:
      "Detailed intelligence report content would be here. Restricted access.",
    status: "Active",
    assignedTo: 5, // Officer ID
    relatedEntities: [
      { type: "Person", name: "Suspect A", notes: "Potential network leader" },
      {
        type: "Location",
        name: "Eastern Border Crossing 3",
        notes: "Primary smuggling route",
      },
    ],
    accessLevel: "Provincial Commander and Above",
  },
  {
    id: 2,
    referenceNumber: "INT-2023-002",
    title: "Potential Civil Unrest in Mining Region",
    classification: "Restricted",
    sourceName: "Informant",
    sourceReliability: "High",
    dateDeveloped: "2023-05-28",
    summary:
      "Information about planned protests at mining facilities due to labor disputes. Potential for violence.",
    details:
      "Detailed intelligence report content would be here. Restricted access.",
    status: "Active",
    assignedTo: 2, // Officer ID
    relatedEntities: [
      {
        type: "Organization",
        name: "Mining Workers Union",
        notes: "Organizing protests",
      },
      {
        type: "Location",
        name: "Southeastern Mining Complex",
        notes: "Primary protest location",
      },
    ],
    accessLevel: "Station Commander and Above",
  },
  {
    id: 3,
    referenceNumber: "INT-2023-003",
    title: "Vehicle Theft Ring in Kinshasa",
    classification: "Internal",
    sourceName: "Analysis",
    sourceReliability: "Medium",
    dateDeveloped: "2023-05-20",
    summary:
      "Pattern analysis suggests organized vehicle theft operation in western Kinshasa. Luxury vehicles targeted.",
    details:
      "Detailed intelligence report content would be here. Restricted access.",
    status: "Active",
    assignedTo: 1, // Officer ID
    relatedEntities: [
      { type: "Area", name: "Western Kinshasa", notes: "Area of operations" },
      {
        type: "MO",
        name: "Electronic bypass",
        notes: "Method used for newer vehicles",
      },
    ],
    accessLevel: "Officer and Above",
  },
  {
    id: 4,
    referenceNumber: "INT-2023-004",
    title: "Cross-Border Weapons Movement",
    classification: "Secret",
    sourceName: "Partner Agency",
    sourceReliability: "High",
    dateDeveloped: "2023-05-10",
    summary:
      "Intelligence sharing from international partner regarding weapons smuggling across northwestern border.",
    details:
      "Detailed intelligence report content would be here. Restricted access.",
    status: "Active",
    assignedTo: 5, // Officer ID
    relatedEntities: [
      {
        type: "Route",
        name: "Northwestern border crossing",
        notes: "Primary smuggling route",
      },
      {
        type: "Vehicle",
        name: "Commercial trucks",
        notes: "Concealment method",
      },
    ],
    accessLevel: "National Commissioner Only",
  },
  {
    id: 5,
    referenceNumber: "INT-2023-005",
    title: "Counterfeit Currency Operation",
    classification: "Confidential",
    sourceName: "Financial Intelligence",
    sourceReliability: "Medium",
    dateDeveloped: "2023-05-25",
    summary:
      "Evidence of counterfeit currency production in industrial area of Lubumbashi. High-quality forgeries.",
    details:
      "Detailed intelligence report content would be here. Restricted access.",
    status: "Active",
    assignedTo: 3, // Officer ID
    relatedEntities: [
      {
        type: "Area",
        name: "Lubumbashi Industrial Zone",
        notes: "Suspected production location",
      },
      { type: "Method", name: "Digital printing", notes: "Production method" },
    ],
    accessLevel: "Provincial Commander and Above",
  },
];

// Approval workflows data
export const approvalsData = [
  {
    id: 1,
    type: "Resource Request",
    referenceNumber: "REQ-2023-0124",
    title: "Patrol Vehicle Allocation",
    description:
      "Request for allocation of patrol vehicle to Goma Central Station",
    requestedBy: 4, // Officer ID
    requestDate: "2023-05-30T09:15:00",
    status: "Pending",
    currentApprover: 3, // Officer ID
    approvalChain: [
      {
        level: 1,
        role: "station_commander",
        status: "Pending",
        approver: 3,
        date: null,
      },
      {
        level: 2,
        role: "provincial_commissioner",
        status: "Not Started",
        approver: null,
        date: null,
      },
    ],
    relatedItem: 2, // Resource ID
    comments: [
      {
        user: 4,
        date: "2023-05-30T09:15:00",
        text: "Requesting due to increased patrol needs in eastern sector",
      },
    ],
  },
  {
    id: 2,
    type: "Personnel Transfer",
    referenceNumber: "TRF-2023-0056",
    title: "Officer Transfer Request",
    description:
      "Request to transfer Officer Sophie Mobutu from Goma to Kinshasa Central",
    requestedBy: 4, // Officer ID
    requestDate: "2023-05-25T14:30:00",
    status: "In Progress",
    currentApprover: 2, // Officer ID
    approvalChain: [
      {
        level: 1,
        role: "station_commander",
        status: "Approved",
        approver: 3,
        date: "2023-05-26T10:20:00",
      },
      {
        level: 2,
        role: "provincial_commissioner",
        status: "Pending",
        approver: 2,
        date: null,
      },
      {
        level: 3,
        role: "national_commissioner",
        status: "Not Started",
        approver: null,
        date: null,
      },
    ],
    relatedItem: 4, // Personnel ID
    comments: [
      {
        user: 4,
        date: "2023-05-25T14:30:00",
        text: "Requesting transfer for family reasons",
      },
      {
        user: 3,
        date: "2023-05-26T10:20:00",
        text: "Approved at station level. Officer has good performance record.",
      },
    ],
  },
  {
    id: 3,
    type: "Case Closure",
    referenceNumber: "CLS-2023-0019",
    title: "Case Closure Request",
    description:
      "Request to close case KIN-2023-015 (Assault at Nightclub Diamond)",
    requestedBy: 2, // Officer ID
    requestDate: "2023-03-20T13:45:00",
    status: "Approved",
    currentApprover: null,
    approvalChain: [
      {
        level: 1,
        role: "station_commander",
        status: "Approved",
        approver: 1,
        date: "2023-03-20T16:15:00",
      },
    ],
    relatedItem: 3, // Case ID
    comments: [
      {
        user: 2,
        date: "2023-03-20T13:45:00",
        text: "Case ready for closure. Suspect charged and prosecution complete.",
      },
      {
        user: 1,
        date: "2023-03-20T16:15:00",
        text: "Reviewed and approved. Documentation is complete.",
      },
    ],
  },
  {
    id: 4,
    type: "Equipment Requisition",
    referenceNumber: "EQP-2023-0087",
    title: "Bulletproof Vests Requisition",
    description:
      "Request for 10 new bulletproof vests for Kinshasa Central Station",
    requestedBy: 1, // Officer ID
    requestDate: "2023-06-01T11:30:00",
    status: "Pending",
    currentApprover: 1, // Officer ID
    approvalChain: [
      {
        level: 1,
        role: "station_commander",
        status: "Approved",
        approver: 1,
        date: "2023-06-01T11:35:00",
      },
      {
        level: 2,
        role: "national_commissioner",
        status: "Pending",
        approver: 1,
        date: null,
      },
    ],
    relatedItem: null,
    comments: [
      {
        user: 1,
        date: "2023-06-01T11:30:00",
        text: "Current vests are past expiration date and need replacement",
      },
      {
        user: 1,
        date: "2023-06-01T11:35:00",
        text: "Approved at station level. Budget allocation needed.",
      },
    ],
  },
  {
    id: 5,
    type: "Intelligence Sharing",
    referenceNumber: "INT-SHR-2023-0022",
    title: "Intelligence Sharing Authorization",
    description:
      "Request to share intelligence report INT-2023-001 with Border Control Agency",
    requestedBy: 5, // Officer ID
    requestDate: "2023-05-18T09:10:00",
    status: "Rejected",
    currentApprover: null,
    approvalChain: [
      {
        level: 1,
        role: "provincial_commissioner",
        status: "Rejected",
        approver: 2,
        date: "2023-05-19T14:25:00",
      },
    ],
    relatedItem: 1, // Intelligence ID
    comments: [
      {
        user: 5,
        date: "2023-05-18T09:10:00",
        text: "Sharing needed for joint operation planning",
      },
      {
        user: 2,
        date: "2023-05-19T14:25:00",
        text: "Rejected. Information too sensitive at this stage. Reconsider after source verification.",
      },
    ],
  },
];

// Wanted persons data
export const wantedPersonsData = [
  {
    id: 1,
    referenceNumber: "WNT-2023-001",
    firstName: "Patrice",
    lastName: "Lumumba",
    alias: "The Ghost",
    gender: "Male",
    dateOfBirth: "1985-08-14",
    nationality: "DRC",
    height: 178, // cm
    weight: 75, // kg
    distinguishingFeatures: "Scar on left cheek, tattoo on right forearm",
    lastKnownLocation: "Kinshasa, Gombe District",
    status: "At Large",
    dangerLevel: "High",
    wantedFor: "Armed Robbery, Assault",
    casesReference: ["KIN-2023-001"],
    dateAdded: "2023-04-16",
    photo: null,
    description:
      "Suspect in multiple armed robberies including Central Market incident. Considered armed and dangerous.",
  },
  {
    id: 2,
    referenceNumber: "WNT-2023-002",
    firstName: "Laurent",
    lastName: "Kabila",
    alias: "The Driver",
    gender: "Male",
    dateOfBirth: "1990-03-22",
    nationality: "DRC",
    height: 182, // cm
    weight: 80, // kg
    distinguishingFeatures: "None",
    lastKnownLocation: "Lubumbashi",
    status: "At Large",
    dangerLevel: "Medium",
    wantedFor: "Vehicle Theft, Property Damage",
    casesReference: ["LUB-2023-042"],
    dateAdded: "2023-05-05",
    photo: null,
    description:
      "Primary suspect in organized vehicle theft ring. Known to operate in urban areas.",
  },
  {
    id: 3,
    referenceNumber: "WNT-2023-003",
    firstName: "Marie",
    lastName: "Tshisekedi",
    alias: "The Banker",
    gender: "Female",
    dateOfBirth: "1988-11-30",
    nationality: "DRC",
    height: 165, // cm
    weight: 58, // kg
    distinguishingFeatures: "Small tattoo on wrist",
    lastKnownLocation: "Kinshasa",
    status: "At Large",
    dangerLevel: "Low",
    wantedFor: "Fraud, Forgery",
    casesReference: ["KIN-2023-022"],
    dateAdded: "2023-04-08",
    photo: null,
    description:
      "Wanted in connection with banking fraud scheme. Non-violent but likely to flee if approached.",
  },
  {
    id: 4,
    referenceNumber: "WNT-2023-004",
    firstName: "Joseph",
    lastName: "Mobutu",
    alias: "The Enforcer",
    gender: "Male",
    dateOfBirth: "1982-05-18",
    nationality: "DRC",
    height: 190, // cm
    weight: 95, // kg
    distinguishingFeatures: "Muscular build, shaved head",
    lastKnownLocation: "Goma",
    status: "At Large",
    dangerLevel: "High",
    wantedFor: "Extortion, Assault, Criminal Intimidation",
    casesReference: [],
    dateAdded: "2023-05-12",
    photo: null,
    description:
      "Known enforcer for criminal organizations. History of violence and intimidation.",
  },
  {
    id: 5,
    referenceNumber: "WNT-2023-005",
    firstName: "Claude",
    lastName: "Kasavubu",
    alias: "The Hacker",
    gender: "Male",
    dateOfBirth: "1995-09-10",
    nationality: "DRC",
    height: 175, // cm
    weight: 68, // kg
    distinguishingFeatures: "Glasses, slender build",
    lastKnownLocation: "Kinshasa",
    status: "At Large",
    dangerLevel: "Low",
    wantedFor: "Computer Fraud, Identity Theft",
    casesReference: [],
    dateAdded: "2023-05-20",
    photo: null,
    description:
      "Suspected of multiple cybercrimes against financial institutions. Non-violent but technically sophisticated.",
  },
];

// Helper function to simulate API request delay
export const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Simulated API response structure
export const apiResponse = (
  data,
  success = true,
  message = "Operation successful"
) => ({
  success,
  message,
  data,
});
