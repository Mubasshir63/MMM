
import { 
    DetailedReport, 
    SOSAlert, 
    Announcement, 
    DonationRequest, 
    ResolvedIssue, 
    MapPoint, 
    EmergencyContact,
    User,
    ReportStatus,
    LocationData,
    GovtScheme,
    TeamMember,
    Department,
    DataflowItem,
    StaffMember,
    Doctor,
    Hospital,
    PoliceOfficer,
    Teacher,
    School,
    CyberReport,
    InterceptedMessage,
    UrlScanResult,
    BreachResult,
    NetworkNode,
    NetworkLink,
    TrafficSegment,
    LiveBus,
    AIDirective,
    DataflowStatus
} from '../types';

// --- MOCK DATA GENERATOR ---

const generateMockReports = (): DetailedReport[] => {
    const reports: DetailedReport[] = [];
    const categories = [
        // Transport & Public Works
        { cat: 'Pothole / Road Damage', desc: 'Large pothole causing traffic slowdown.', dept: 'Public Works' },
        { cat: 'Traffic Signal Issue', desc: 'Signal stuck on red for 20 mins.', dept: 'Transport' },
        { cat: 'Illegal Parking', desc: 'Car blocking fire hydrant access.', dept: 'Transport' },
        { cat: 'Public Transport Complaint', desc: 'Bus 21G skipped the stop.', dept: 'Transport' },
        { cat: 'Road Sign Damaged', desc: 'Stop sign bent and barely visible.', dept: 'Transport' },
        
        // Sanitation
        { cat: 'Garbage Dump', desc: 'Overflowing bin attracting stray animals.', dept: 'Sanitation' },
        { cat: 'Waste Collection', desc: 'Door-to-door collection missed for 2 days.', dept: 'Sanitation' },
        { cat: 'Street Cleaning', desc: 'Road full of debris after market day.', dept: 'Sanitation' },
        { cat: 'Dead Animal', desc: 'Dead stray dog on the roadside.', dept: 'Sanitation' },

        // Water
        { cat: 'Water Leakage', desc: 'Main pipeline burst, wasting water.', dept: 'Water' },
        { cat: 'No Water Supply', desc: 'No water supply in Sector 4 since morning.', dept: 'Water' },
        { cat: 'Contaminated Water', desc: 'Water smells foul and is muddy.', dept: 'Water' },
        { cat: 'Low Water Pressure', desc: 'Pressure too low to reach overhead tank.', dept: 'Water' },

        // Electricity
        { cat: 'Streetlight Outage', desc: 'Entire street in darkness, safety risk.', dept: 'Electricity' },
        { cat: 'Power Outage', desc: 'Frequent power cuts in the evening.', dept: 'Electricity' },
        { cat: 'Dangerous Wiring', desc: 'Exposed live wire near playground.', dept: 'Electricity' },
        { cat: 'Transformer Sparks', desc: 'Sparks seen coming from the local transformer.', dept: 'Electricity' },

        // Health
        { cat: 'Hospital Hygiene', desc: 'Washrooms in General Ward are unclean.', dept: 'Health' },
        { cat: 'Medicine Shortage', desc: 'Insulin not available at PHC.', dept: 'Health' },
        { cat: 'Dengue Risk', desc: 'Stagnant water breeding mosquitoes.', dept: 'Health' },
        { cat: 'Staff Unavailability', desc: 'Doctor not available during OPD hours.', dept: 'Health' },

        // Education
        { cat: 'School Facility', desc: 'Fans not working in Class 5.', dept: 'Education' },
        { cat: 'Teacher Absence', desc: 'Math teacher absent for a week.', dept: 'Education' },
        { cat: 'Mid-day Meal', desc: 'Quality of food needs improvement.', dept: 'Education' },
        { cat: 'Playground Safety', desc: 'Broken swing set in playground.', dept: 'Education' },

        // Housing
        { cat: 'Illegal Construction', desc: 'Building adding floor without permit.', dept: 'Housing' },
        { cat: 'Encroachment', desc: 'Shop extended onto public footpath.', dept: 'Housing' },
        { cat: 'Building Safety', desc: 'Cracks appearing in government colony wall.', dept: 'Housing' },

        // Safety
        { cat: 'Suspicious Activity', desc: 'Group gathering late night in park.', dept: 'Safety' },
        { cat: 'Noise Pollution', desc: 'Loudspeakers playing beyond 10 PM.', dept: 'Safety' },
        { cat: 'Theft Report', desc: 'Chain snatching incident near bus stand.', dept: 'Safety' },
        { cat: 'Harassment', desc: 'Unsafe area due to lack of patrolling.', dept: 'Safety' },
        
        // Finance
        { cat: 'Property Tax Issue', desc: 'Charged double tax this year.', dept: 'Finance' },
        { cat: 'Pension Delay', desc: 'Old age pension not received for 2 months.', dept: 'Finance' },
        
        // Public Works (General)
        { cat: 'Drainage Blockage', desc: 'Sewage overflowing onto the street.', dept: 'Public Works' },
        { cat: 'Park Maintenance', desc: 'Walking track broken.', dept: 'Public Works' },
    ];

    const locations = [
        { name: 'Anna Nagar, Chennai', lat: 13.0850, lng: 80.2100 },
        { name: 'T. Nagar, Chennai', lat: 13.0400, lng: 80.2300 },
        { name: 'Adyar, Chennai', lat: 13.0012, lng: 80.2565 },
        { name: 'Mylapore, Chennai', lat: 13.0300, lng: 80.2700 },
        { name: 'Velachery, Chennai', lat: 12.9800, lng: 80.2200 },
        { name: 'Connaught Place, Delhi', lat: 28.6304, lng: 77.2177 },
        { name: 'Karol Bagh, Delhi', lat: 28.6520, lng: 77.1900 },
        { name: 'Indiranagar, Bengaluru', lat: 12.9719, lng: 77.6412 },
        { name: 'Koramangala, Bengaluru', lat: 12.9279, lng: 77.6271 },
        { name: 'Bandra, Mumbai', lat: 19.0596, lng: 72.8295 },
    ];

    for (let i = 0; i < 80; i++) {
        const template = categories[Math.floor(Math.random() * categories.length)];
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const offsetLat = (Math.random() - 0.5) * 0.04;
        const offsetLng = (Math.random() - 0.5) * 0.04;
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 14)); // Last 14 days

        reports.push({
            id: 1000 + i,
            title: `${template.cat} at ${loc.name.split(',')[0]}`,
            category: template.cat,
            description: template.desc,
            status: Math.random() > 0.7 ? ReportStatus.Resolved : (Math.random() > 0.4 ? ReportStatus.UnderReview : ReportStatus.Emergency),
            priority: Math.random() > 0.8 ? 'Critical' : (Math.random() > 0.5 ? 'High' : 'Medium'),
            date: date.toISOString(),
            location: loc.name,
            coords: { lat: loc.lat + offsetLat, lng: loc.lng + offsetLng },
            updates: [{ timestamp: date.toISOString(), message: 'Report received via App', by: 'System' }],
            assigned_to: Math.random() > 0.6 ? { id: 'off-1', name: 'Field Officer', role: 'Officer' } : undefined
        });
    }
    return reports;
};

export const mockAnnouncements: Announcement[] = [
    { id: 1, title: 'Monsoon Preparedness Alert', content: 'Heavy rains expected. Keep emergency kits ready.', source: 'Disaster Management', timestamp: '2h ago', status: ReportStatus.Emergency },
    { id: 2, title: 'Polio Vaccination Drive', content: 'Door-to-door vaccination this Sunday.', source: 'Health Dept.', timestamp: '5h ago', status: ReportStatus.UnderReview },
    { id: 3, title: 'New Park Opening', content: 'City park inauguration at Sector 5.', source: 'City Council', timestamp: '1d ago', status: ReportStatus.Resolved },
];

export const mockDonations: DonationRequest[] = [
    { id: 1, title: 'Urgent: O+ Blood Needed', patientName: 'Ramesh Kumar', story: 'Critical surgery scheduled.', image: 'https://picsum.photos/seed/blood/300/200', goal: 10000, raised: 4500, hospital: 'City Hospital' },
    { id: 2, title: 'Help Anita Fight Cancer', patientName: 'Anita Sharma', story: 'Requires chemotherapy support.', image: 'https://picsum.photos/seed/cancer/300/200', goal: 500000, raised: 120000, hospital: 'Cancer Institute' },
];

export const mockResolvedIssues: ResolvedIssue[] = [
    { id: 101, title: 'Pothole Fixed on Main Rd', category: 'Roads', resolvedDate: 'Yesterday', location: 'MG Road' },
    { id: 102, title: 'Streetlight Repaired', category: 'Electricity', resolvedDate: '2 days ago', location: 'Sector 12' },
];

// Initialize with generated reports
let mockReports: DetailedReport[] = generateMockReports();

let mockSOSAlerts: SOSAlert[] = [];
let mockUsers: User[] = [
    { 
        name: 'Demo Citizen', 
        email: 'citizen@unified.gov', 
        phone: '9876543210', 
        aadhaar: '123456789012', 
        profilePicture: 'https://i.pravatar.cc/150?u=citizen', 
        role: 'citizen',
        location: { country: 'India', state: 'Tamil Nadu', district: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } },
        notificationPreferences: { email: true, push: true }
    },
    { 
        name: 'Govt Official', 
        email: 'official@unified.gov', 
        phone: '1122334455', 
        aadhaar: '098765432109', 
        profilePicture: 'https://i.pravatar.cc/150?u=official', 
        role: 'official',
        location: { country: 'India', state: 'New Delhi', district: 'New Delhi', coords: { lat: 28.6139, lng: 77.2090 } }
    },
    {
        name: 'Mubasshir Mohamed',
        email: 'mubasshir.mohamed@gov.in',
        phone: '9988776655',
        aadhaar: '111122223333',
        profilePicture: 'https://i.pravatar.cc/150?u=mubasshir',
        role: 'official',
        location: { country: 'India', state: 'Tamil Nadu', district: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } }
    },
    {
        name: 'Hisham Mohamed',
        email: 'hisham.mohamed@gov.in',
        phone: '8877665544',
        aadhaar: '444455556666',
        profilePicture: 'https://i.pravatar.cc/150?u=hisham',
        role: 'official',
        location: { country: 'India', state: 'Tamil Nadu', district: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } }
    },
    {
        name: 'Admin',
        email: 'admin@gov.in',
        phone: '0000000000',
        aadhaar: '000000000000',
        profilePicture: 'https://i.pravatar.cc/150?u=admin',
        role: 'official',
        location: { country: 'India', state: 'New Delhi', district: 'New Delhi', coords: { lat: 28.6139, lng: 77.2090 } }
    }
];

// --- API FUNCTIONS ---

// Authentication
export const login = async (identifier: string, password: string, role: 'citizen' | 'official' = 'citizen'): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    // Simple password check for demo
    if (role === 'official') {
         if (password === 'password123' || password === 'admin' || password === 'password') {
             const user = mockUsers.find(u => u.email === identifier && u.role === 'official');
             return user || null;
         }
         return null;
    }
    const user = mockUsers.find(u => (u.email === identifier || u.phone === identifier || u.aadhaar === identifier) && u.role === role);
    return user || null;
};

export const register = async (userData: Omit<User, 'profilePicture' | 'role' | 'email'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
        ...userData,
        email: `${userData.phone}@unified.user`, // Dummy email generation
        profilePicture: `https://i.pravatar.cc/150?u=${Date.now()}`,
        role: 'citizen',
        notificationPreferences: { email: true, push: true }
    };
    mockUsers.push(newUser);
    return newUser;
};

export const updateUser = async (user: User): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockUsers.findIndex(u => u.email === user.email);
    if (index !== -1) mockUsers[index] = user;
    return user;
};

export const changePassword = async (email: string, current: string, newPass: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true; 
};

// Reports
export const getReports = async (): Promise<DetailedReport[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockReports];
};

export const createReport = async (data: any, user: User, assignedDept: string = 'Unassigned'): Promise<DetailedReport> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newReport: DetailedReport = {
        id: Math.floor(Math.random() * 10000),
        title: data.title,
        category: data.category,
        description: data.description,
        status: ReportStatus.UnderReview,
        date: new Date().toISOString(),
        location: `${data.coords.lat.toFixed(4)}, ${data.coords.lng.toFixed(4)}`,
        coords: data.coords,
        photo: data.photo,
        video: data.video,
        updates: [{ timestamp: new Date().toISOString(), message: 'Report submitted', by: user.name }],
        priority: data.priority || 'Low',
        assigned_to: assignedDept !== 'Unassigned' ? { id: 'dept-1', name: assignedDept, role: 'Department' } : undefined
    };
    mockReports.unshift(newReport);
    return newReport;
};

export const updateReport = async (id: number, updates: Partial<DetailedReport>): Promise<DetailedReport | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockReports.findIndex(r => r.id === id);
    if (index === -1) return null;
    mockReports[index] = { ...mockReports[index], ...updates };
    // Add update log if status changed
    if (updates.status) {
        mockReports[index].updates.push({ timestamp: new Date().toISOString(), message: `Status changed to ${updates.status}`, by: 'System' });
    }
    return mockReports[index];
};

// SOS
export const getSOSAlerts = async (): Promise<SOSAlert[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockSOSAlerts];
};

export const createSOSAlert = async (user: User, video?: string): Promise<SOSAlert> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const alert: SOSAlert = {
        id: Date.now(),
        user: { name: user.name, phone: user.phone, profilePicture: user.profilePicture },
        timestamp: new Date().toISOString(),
        location: { address: `${user.location.coords.lat}, ${user.location.coords.lng}`, coords: user.location.coords },
        status: 'Active',
        recordedVideo: video
    };
    mockSOSAlerts.unshift(alert);
    notifySOSSubscribers(alert);
    return alert;
};

export const updateSOSAlert = async (id: number, updates: Partial<SOSAlert>): Promise<SOSAlert | null> => {
    const index = mockSOSAlerts.findIndex(a => a.id === id);
    if (index === -1) return null;
    mockSOSAlerts[index] = { ...mockSOSAlerts[index], ...updates };
    return mockSOSAlerts[index];
};

export const deleteSOSAlert = async (id: number): Promise<boolean> => {
    mockSOSAlerts = mockSOSAlerts.filter(a => a.id !== id);
    return true;
};

// SOS Subscription
type SOSListener = (alert: SOSAlert) => void;
let sosListeners: SOSListener[] = [];

export const subscribeToSOSAlerts = (callback: SOSListener) => {
    sosListeners.push(callback);
    return () => { sosListeners = sosListeners.filter(l => l !== callback); };
};

const notifySOSSubscribers = (alert: SOSAlert) => {
    sosListeners.forEach(l => l(alert));
};

// Announcements & Donations
export const getAnnouncements = async (): Promise<Announcement[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockAnnouncements];
};

export const createAnnouncement = async (data: any): Promise<Announcement> => {
    const ann: Announcement = { id: Date.now(), ...data, timestamp: 'Just now' };
    mockAnnouncements.unshift(ann);
    return ann;
};

export const getDonations = async (): Promise<DonationRequest[]> => {
    return [...mockDonations];
};

export const createDonationRequest = async (data: any, user: User): Promise<DonationRequest> => {
    const req: DonationRequest = { id: Date.now(), ...data, raised: 0 };
    mockDonations.unshift(req);
    return req;
};

export const getResolvedIssues = async (): Promise<ResolvedIssue[]> => {
    return [...mockResolvedIssues];
};

// Government Module
export const getDepartments = async (): Promise<Department[]> => [
    { id: 'health', name: 'Health', status: 'Normal', open_issues: mockReports.filter(r => r.category.includes('Health') && r.status !== ReportStatus.Resolved).length, avg_response_time: '2h' },
    { id: 'transport', name: 'Transport', status: 'Warning', open_issues: mockReports.filter(r => r.category.includes('Traffic') || r.category.includes('Transport') && r.status !== ReportStatus.Resolved).length, avg_response_time: '5h' },
    { id: 'sanitation', name: 'Sanitation', status: 'Critical', open_issues: mockReports.filter(r => r.category.includes('Garbage') || r.category.includes('Waste') && r.status !== ReportStatus.Resolved).length, avg_response_time: '8h' },
    { id: 'water', name: 'Water', status: 'Normal', open_issues: mockReports.filter(r => r.category.includes('Water') && r.status !== ReportStatus.Resolved).length, avg_response_time: '3h' },
    { id: 'electricity', name: 'Electricity', status: 'Warning', open_issues: mockReports.filter(r => r.category.includes('Power') || r.category.includes('Streetlight') && r.status !== ReportStatus.Resolved).length, avg_response_time: '4h' },
    { id: 'housing', name: 'Housing', status: 'Normal', open_issues: mockReports.filter(r => r.category.includes('Building') && r.status !== ReportStatus.Resolved).length, avg_response_time: '6h' },
    { id: 'safety', name: 'Safety', status: 'Normal', open_issues: mockReports.filter(r => r.category.includes('Safety') && r.status !== ReportStatus.Resolved).length, avg_response_time: '1h' },
    { id: 'public-works', name: 'Public Works', status: 'Warning', open_issues: mockReports.filter(r => r.category.includes('Road') && r.status !== ReportStatus.Resolved).length, avg_response_time: '7h' },
    { id: 'finance', name: 'Finance', status: 'Normal', open_issues: mockReports.filter(r => r.category.includes('Tax') && r.status !== ReportStatus.Resolved).length, avg_response_time: '4h' },
    { id: 'education', name: 'Education', status: 'Normal', open_issues: mockReports.filter(r => r.category.includes('School') && r.status !== ReportStatus.Resolved).length, avg_response_time: '5h' },
];

export const getTeam = async (): Promise<TeamMember[]> => [
    { id: '1', name: 'Officer Arjun', role: 'Officer', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Priya Singh', role: 'Department Head', avatar: 'https://i.pravatar.cc/150?u=2' },
];

export const addTeamMember = async (data: any): Promise<TeamMember> => {
    const member = { id: Date.now().toString(), ...data, avatar: 'https://i.pravatar.cc/150' };
    return member;
};

export const updateTeamMember = async (data: TeamMember): Promise<TeamMember> => data;
export const deleteTeamMember = async (id: string): Promise<boolean> => true;

// Dataflow Storage
let mockDataflowItems: DataflowItem[] = [];

export const getDataflowSubmissions = async (): Promise<DataflowItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockDataflowItems];
};

export const getUserDataflow = async (userName: string): Promise<DataflowItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Sort by newest first
    return mockDataflowItems.filter(item => item.user.name === userName).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const updateDataflowStatus = (id: string, status: DataflowStatus) => {
    const item = mockDataflowItems.find(i => i.id === id);
    if (item) {
        item.status = status;
    }
};

export const createDataflowSubmission = async (data: any): Promise<DataflowItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newItem: DataflowItem = {
        id: Math.floor(Math.random() * 100000).toString(),
        service: data.service,
        timestamp: new Date().toISOString(),
        status: 'Received',
        user: data.user,
        payload: data.payload,
        externalSystem: data.externalSystem
    };
    mockDataflowItems.unshift(newItem);

    // Simulate AI Processing Pipeline Timeline
    // 1. Received -> Validating (simulates AI analyzing docs) after 5 seconds
    setTimeout(() => updateDataflowStatus(newItem.id, 'Validating'), 5000);
    
    // 2. Validating -> Forwarded (simulates successful AI check and pushing to external API) after 12 seconds
    setTimeout(() => updateDataflowStatus(newItem.id, 'Forwarded'), 12000);

    return newItem;
};

// Profile Contacts
let mockContacts: EmergencyContact[] = [{ id: 1, name: 'Dad', phone: '9876543210' }];
export const getEmergencyContacts = async () => [...mockContacts];
export const addEmergencyContact = async (name: string, phone: string) => {
    const c = { id: Date.now(), name, phone };
    mockContacts.push(c);
    return c;
};
export const deleteEmergencyContact = async (id: number) => {
    mockContacts = mockContacts.filter(c => c.id !== id);
    return true;
};

// Services
export const getGovtSchemes = async (state: string): Promise<GovtScheme[]> => [
    { title: 'PM Jan Dhan Yojana', description: 'Financial inclusion program.', eligibility: 'All citizens', benefits: ['Zero balance account', 'Insurance'] },
    { title: 'State Housing Scheme', description: 'Affordable housing.', eligibility: 'Low income', benefits: ['Subsidized loan'] }
];

// AI
export const getAiSuggestion = async (issue: DetailedReport): Promise<string> => {
    return `Suggested Department: ${issue.category.includes('Pothole') ? 'Public Works' : 'General Administration'}. Priority seems Moderate based on description.`;
};

// Department Data
const tamilNames = [
    "Mubasshir", "Muhammad", "Hisham", "Nathat", "Royaz", "Aarav", "Vijay", "Karthik", "Senthil", "Lakshmi", "Anitha", "Meena", "Priya", "Suresh", "Ramesh", "Ganesh", "Murugan", "Velu", "Arun", "Bala", "Chitra", "Deepa", "Eswari", "Fathima", "Gita", "Hari", "Indira", "Jaya", "Kala", "Latha", "Mani", "Nandhini", "Oviya", "Padma", "Rani", "Selvi", "Thara", "Uma", "Vani", "Yamuna", "Abdul", "Babu", "Chandru", "Dinesh", "Elango", "Farook", "Gopal", "Hassan", "Imran", "Jagan", "Kamal", "Logan", "Mohan", "Naveen", "Parthiban", "Raghu", "Saravanan", "Thirumalai", "Uday", "Vikram", "Yusuf", "Zakir", "Aisha", "Banu", "Divya", "Gayathri", "Hema", "Ishwarya", "Janani", "Kavya", "Lavanya", "Malini", "Nithya", "Preethi", "Radha", "Sandhya", "Trisha", "Vidya", "Yasmin", "Zoya", "Akbar", "Bashir", "Charles", "David", "Edwin", "Francis", "George", "Henry", "Ibrahim", "Jack", "Kevin", "Leo", "Martin", "Nelson", "Oliver", "Peter", "Queen", "Robert", "Samuel", "Thomas", "Victor", "William", "Xavier", "Yegan", "Zahid"
];

const getRandomName = () => tamilNames[Math.floor(Math.random() * tamilNames.length)];

const generateStaff = (count: number, role: string, zonePrefix: string): StaffMember[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `${zonePrefix}-${i}`,
        name: getRandomName(),
        role: role,
        contact: `98${Math.floor(Math.random() * 100000000)}`,
        avatar: `https://i.pravatar.cc/150?u=${zonePrefix}-${i}`,
        zone: `Zone ${Math.floor(i / 10) + 1}`
    }));
};

export const getHealthData = async () => ({
    doctors: Array.from({ length: 20 }).map((_, i) => ({
        id: `doc-${i}`,
        name: `Dr. ${getRandomName()}`,
        role: 'Doctor',
        specialization: ['Cardiology', 'General', 'Pediatrics', 'Orthopedics'][Math.floor(Math.random() * 4)],
        hospital: 'General Hospital',
        contact: '102',
        avatar: `https://i.pravatar.cc/150?u=doc-${i}`
    })),
    hospitals: [
        { id: 'h1', name: 'General Hospital', location: 'Chennai Central', beds: 500, contact: '044-25305000', specialties: ['General', 'Trauma'] },
        { id: 'h2', name: 'City Medical Center', location: 'Adyar', beds: 200, contact: '044-24405000', specialties: ['Pediatrics', 'Cardiology'] }
    ]
});
export const getTransportStaff = async (): Promise<StaffMember[]> => generateStaff(50, 'Driver/Conductor', 'TRANS');
export const getSanitationWorkers = async (): Promise<StaffMember[]> => generateStaff(60, 'Sanitation Worker', 'SAN');
export const getWaterStaff = async (): Promise<StaffMember[]> => generateStaff(40, 'Engineer/Plumber', 'WAT');
export const getElectricityStaff = async (): Promise<StaffMember[]> => generateStaff(45, 'Lineman', 'ELEC');
export const getHousingStaff = async (): Promise<StaffMember[]> => generateStaff(30, 'Inspector', 'HOU');
export const getPoliceOfficers = async (): Promise<PoliceOfficer[]> => Array.from({ length: 50 }).map((_, i) => ({
    id: `pol-${i}`,
    name: getRandomName(),
    role: 'Police',
    rank: ['Constable', 'Inspector', 'Sub-Inspector'][Math.floor(Math.random() * 3)],
    station: `Station ${Math.floor(i/5)+1}`,
    contact: '100',
    avatar: `https://i.pravatar.cc/150?u=pol-${i}`
}));
export const getPublicWorksStaff = async (): Promise<StaffMember[]> => generateStaff(55, 'Field Worker', 'PWD');
export const getFinanceStaff = async (): Promise<StaffMember[]> => generateStaff(25, 'Auditor/Clerk', 'FIN');
export const getEducationData = async () => ({
    teachers: Array.from({ length: 60 }).map((_, i) => ({
        id: `teach-${i}`,
        name: getRandomName(),
        role: 'Teacher',
        subject: ['Math', 'Science', 'Tamil', 'English'][Math.floor(Math.random() * 4)],
        school: `Govt School ${Math.floor(i/10)+1}`,
        contact: `98${Math.floor(Math.random()*100000000)}`,
        avatar: `https://i.pravatar.cc/150?u=teach-${i}`
    })),
    schools: [
        { id: 'sch1', name: 'Govt High School', location: 'Adyar', principal: 'Mrs. K. Vani', students: 1200 },
        { id: 'sch2', name: 'City Primary School', location: 'T. Nagar', principal: 'Mr. R. Kumar', students: 800 }
    ]
});

// Cyber
export const getCyberReports = async (): Promise<CyberReport[]> => {
    const reports = [];
    const threatTypes: CyberReport['threatLevel'][] = ['Low', 'Medium', 'High', 'Critical'];
    const categories: CyberReport['category'][] = ['Financial Scam / Fraud', 'Harassment / Abuse', 'Phishing', 'Cyberstalking', 'Blackmail / Sexual Extortion'];
    
    for (let i = 0; i < 15; i++) {
        reports.push({
            id: `CYB-${1000 + i}`,
            timestamp: new Date(Date.now() - i * 86400000).toISOString(),
            senderId: `+91 9${Math.floor(Math.random() * 1000000000)}`,
            contentSample: 'Suspicious message content regarding bank details or lottery...',
            category: categories[Math.floor(Math.random() * categories.length)],
            threatLevel: threatTypes[Math.floor(Math.random() * threatTypes.length)],
            status: Math.random() > 0.5 ? 'Investigating' : 'Active',
            user: { name: 'Anonymous User', contact: 'Hidden', location: { lat: 20.5 + Math.random()*5, lng: 78.9 + Math.random()*5 } }
        });
    }
    return reports as CyberReport[];
};
export const createCyberReport = async (data: any) => { return { id: Date.now().toString(), ...data, status: 'Active' }; };
export const scanUrl = async (url: string): Promise<UrlScanResult> => ({ url, isSafe: true, riskScore: 10, analysis: 'Safe domain.' });
export const checkDataBreach = async (email: string): Promise<BreachResult[]> => [];
export const getCriminalNetwork = async () => ({ 
    nodes: [
        {id: 's1', type: 'Scammer', label: 'Scammer A'}, {id: 's2', type: 'Scammer', label: 'Scammer B'},
        {id: 'v1', type: 'Victim', label: 'Victim 1'}, {id: 'v2', type: 'Victim', label: 'Victim 2'},
        {id: 'ip1', type: 'IP', label: '192.168.X.X'},
    ] as NetworkNode[], 
    links: [
        {source: 's1', target: 'v1', type: 'Contacted'}, {source: 's1', target: 'v2', type: 'Contacted'},
        {source: 's2', target: 'ip1', type: 'Used'}, {source: 's1', target: 'ip1', type: 'Used'}
    ] as NetworkLink[] 
});
export const simulateIncomingThreat = async (): Promise<InterceptedMessage> => ({ sender: '+919999988888', content: 'Win 1 Crore! Click link.', platform: 'SMS', timestamp: new Date().toISOString(), detectedCategory: 'Financial Scam / Fraud', threatLevel: 'High' });

// Maps
export const getTrafficSegments = async (): Promise<TrafficSegment[]> => [
    { path: [[13.0827, 80.2707], [13.0850, 80.2750]], level: 'high' },
    { path: [[13.0850, 80.2750], [13.0900, 80.2800]], level: 'moderate' },
    { path: [[13.0900, 80.2800], [13.0950, 80.2850]], level: 'low' }
];
export const getLiveBuses = async (): Promise<LiveBus[]> => [
    { id: 'bus1', route: '21G', coords: { lat: 13.0830, lng: 80.2710 }, nextStop: 'Central', speed: 40 },
    { id: 'bus2', route: '12B', coords: { lat: 13.0860, lng: 80.2760 }, nextStop: 'Marina', speed: 35 }
];
export const generateAIDirective = (officerId: string): AIDirective => ({
    id: 'cmd-1', timestamp: new Date().toISOString(), priority: 'High', officerId, action: 'Patrol', targetLocation: { lat: 0, lng: 0, address: '' }, context: 'Routine', status: 'Pending'
});
