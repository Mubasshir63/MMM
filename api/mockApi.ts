
import { 
    DetailedReport, 
    SOSAlert, 
    Announcement, 
    DonationRequest, 
    ResolvedIssue, 
    User,
    ReportStatus,
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
    DataflowStatus,
    GovtView,
    EmergencyContact,
    CyberCategory,
    ThreatLevel
} from '../types';

// --- THE CORE DATABASE ENGINE (UNIFIED_DB) ---
// This simulates a full cloud backend using LocalStorage for persistence.
// In a real production app, these functions would be fetch() calls to a Node/Python/Go API.

const DB_NAME = 'UNIFIED_CITY_DB_V4';

const getDB = () => {
    const raw = localStorage.getItem(DB_NAME);
    if (!raw) return initializeDB();
    return JSON.parse(raw);
};

const saveDB = (data: any) => {
    localStorage.setItem(DB_NAME, JSON.stringify(data));
};

const initializeDB = () => {
    const initialData = {
        users: [
            { 
                name: 'Mubasshir', email: 'citizen@unified.gov', phone: '9361855808', aadhaar: '123456789012', 
                profilePicture: 'https://i.pravatar.cc/150?u=mub', role: 'citizen',
                location: { country: 'India', state: 'Tamil Nadu', district: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } }
            },
            { 
                name: 'Admin Controller', email: 'official@unified.gov', phone: '1122334455', aadhaar: '098765432109', 
                profilePicture: 'https://i.pravatar.cc/150?u=admin', role: 'official',
                location: { country: 'India', state: 'Tamil Nadu', district: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } }
            }
        ],
        reports: [
            {
                id: 8001, title: 'Broken Water Pipe', category: 'Water Leakage', description: 'Major leak near the central park entrance.',
                status: ReportStatus.UnderReview, priority: 'High', date: new Date().toISOString(),
                location: 'Central Park, Chennai', coords: { lat: 13.0850, lng: 80.2700 },
                updates: [{ timestamp: new Date().toISOString(), message: 'Reported by Citizen', by: 'Mubasshir' }]
            }
        ],
        sos: [],
        announcements: [
            { id: 1, title: 'Night Curfew Shifted', content: 'Due to festival, curfew starts at 12 AM tonight.', source: 'Admin', timestamp: '1h ago', status: ReportStatus.Emergency }
        ],
        donations: [
            { id: 1, title: 'Help for Heart Surgery', patientName: 'Rahul', story: 'Needs urgent bypass.', hospital: 'Apollo', goal: 500000, raised: 120000, image: 'https://picsum.photos/seed/med/400/300' }
        ],
        dataflow: [],
        contacts: [
            { id: 1, name: 'City Police', phone: '100' },
            { id: 2, name: 'Fire Station', phone: '101' }
        ],
        team: [
            { id: 'off-1', name: 'Officer Arjun', role: 'Officer', avatar: 'https://i.pravatar.cc/150?u=arjun' }
        ],
        cyber_reports: []
    };
    saveDB(initialData);
    return initialData;
};

// --- API METHODS (WORKABLE BACKEND INTEGRATION) ---

// 1. Authentication
export const login = async (id: string, pw: string, role: 'citizen' | 'official'): Promise<User | null> => {
    const db = getDB();
    return db.users.find((u: User) => (u.email === id || u.phone === id || u.aadhaar === id) && u.role === role) || null;
};

export const register = async (userData: any): Promise<User> => {
    const db = getDB();
    const newUser = { ...userData, role: 'citizen', profilePicture: `https://i.pravatar.cc/150?u=${userData.phone}`, email: `${userData.phone}@unified.user` };
    db.users.push(newUser);
    saveDB(db);
    return newUser;
};

// 2. City Reports (Citizen -> Gov -> Citizen Sync)
export const getReports = async (): Promise<DetailedReport[]> => {
    return getDB().reports;
};

export const createReport = async (data: any, user: User): Promise<DetailedReport> => {
    const db = getDB();
    const newReport: DetailedReport = {
        id: Math.floor(Math.random() * 90000) + 10000,
        title: data.title,
        category: data.category,
        description: data.description,
        status: ReportStatus.UnderReview,
        date: new Date().toISOString(),
        location: data.location || "Current GPS",
        coords: data.coords,
        photo: data.photo,
        video: data.video,
        priority: data.priority || 'Medium',
        updates: [{ timestamp: new Date().toISOString(), message: 'Initial filing', by: user.name }]
    };
    db.reports.unshift(newReport);
    saveDB(db);
    return newReport;
};

export const updateReport = async (id: number, updates: Partial<DetailedReport>): Promise<DetailedReport | null> => {
    const db = getDB();
    const idx = db.reports.findIndex((r: any) => r.id === id);
    if (idx === -1) return null;
    
    const updated = { ...db.reports[idx], ...updates };
    if (updates.status) updated.updates.push({ timestamp: new Date().toISOString(), message: `Status updated to ${updates.status}`, by: 'Command Center' });
    
    db.reports[idx] = updated;
    saveDB(db);
    return updated;
};

// 3. SOS Integration (Live Alerting)
export const getSOSAlerts = async (): Promise<SOSAlert[]> => getDB().sos;

export const createSOSAlert = async (user: User, video?: string): Promise<SOSAlert> => {
    const db = getDB();
    const alert: SOSAlert = {
        id: Date.now(),
        user: { name: user.name, phone: user.phone, profilePicture: user.profilePicture },
        timestamp: new Date().toISOString(),
        location: { address: 'Live Ping', coords: user.location.coords },
        status: 'Active',
        recordedVideo: video
    };
    db.sos.unshift(alert);
    saveDB(db);
    notifySOSListeners(alert);
    return alert;
};

export const deleteSOSAlert = async (id: number) => {
    const db = getDB();
    db.sos = db.sos.filter((a: any) => a.id !== id);
    saveDB(db);
    return true;
};

let sosSubscribers: ((a: SOSAlert) => void)[] = [];
export const subscribeToSOSAlerts = (cb: (a: SOSAlert) => void) => {
    sosSubscribers.push(cb);
    return () => { sosSubscribers = sosSubscribers.filter(s => s !== cb); };
};
const notifySOSListeners = (a: SOSAlert) => sosSubscribers.forEach(s => s(a));

// 4. Hub Specific Analytics (Dynamic Aggregation)
export const getDepartments = async (): Promise<Department[]> => {
    const db = getDB();
    const categories: GovtView[] = ['health', 'transport', 'sanitation', 'water', 'electricity', 'housing', 'safety', 'education', 'finance'];
    return categories.map(key => {
        const count = db.reports.filter((r: any) => r.category.toLowerCase().includes(key.substring(0, 4)) && r.status !== ReportStatus.Resolved).length;
        return {
            id: key,
            name: key.toUpperCase(),
            status: count > 5 ? 'Critical' : count > 2 ? 'Warning' : 'Normal',
            open_issues: count,
            avg_response_time: '1.2h'
        };
    });
};

// 5. Dataflow (Backend Pipeline Simulation)
export const getDataflowSubmissions = async () => getDB().dataflow;
// FIX: Added missing function to retrieve dataflow items for a specific user.
export const getUserDataflow = async (userName: string): Promise<DataflowItem[]> => {
    const db = getDB();
    return db.dataflow.filter((item: any) => item.user.name === userName);
};
export const createDataflowSubmission = async (data: any) => {
    const db = getDB();
    const item = { id: `APP-${Date.now()}`, status: 'Received', timestamp: new Date().toISOString(), ...data };
    db.dataflow.unshift(item);
    saveDB(db);
    
    // Simulate background worker
    setTimeout(() => {
        const _db = getDB();
        const _idx = _db.dataflow.findIndex((i: any) => i.id === item.id);
        if (_idx !== -1) { 
            _db.dataflow[_idx].status = 'Validating'; 
            saveDB(_db);
        }
    }, 3000);
    
    return item;
};

// 6. Communications & Global Data
export const getAnnouncements = async () => getDB().announcements;
export const createAnnouncement = async (data: any) => {
    const db = getDB();
    const ann = { id: Date.now(), timestamp: 'Just now', ...data };
    db.announcements.unshift(ann);
    saveDB(db);
    return ann;
};

export const getDonations = async () => getDB().donations;
export const getResolvedIssues = async () => getDB().reports.filter((r: any) => r.status === ReportStatus.Resolved).map((r: any) => ({ id: r.id, title: r.title, category: r.category, resolvedDate: 'Just now', location: r.location }));

// 7. Team & Cyber
export const getTeam = async () => getDB().team;
export const addTeamMember = async (d: any) => {
    const db = getDB();
    const nm = { id: `tm-${Date.now()}`, avatar: `https://i.pravatar.cc/150?u=${d.name}`, ...d };
    db.team.push(nm);
    saveDB(db);
    return nm;
};
// FIX: Added missing function to update a team member's information in the mock database.
export const updateTeamMember = async (member: TeamMember) => {
    const db = getDB();
    const idx = db.team.findIndex((m: any) => m.id === member.id);
    if (idx !== -1) {
        db.team[idx] = member;
        saveDB(db);
        return member;
    }
    return null;
};
// FIX: Added missing function to delete a team member from the mock database.
export const deleteTeamMember = async (id: string) => {
    const db = getDB();
    db.team = db.team.filter((m: any) => m.id !== id);
    saveDB(db);
    return true;
};
export const getCyberReports = async () => getDB().cyber_reports;
export const createCyberReport = async (d: any) => {
    const db = getDB();
    const nr = { id: `CYB-${Date.now()}`, timestamp: new Date().toISOString(), status: 'Investigating', ...d };
    db.cyber_reports.unshift(nr);
    saveDB(db);
    return nr;
};
// FIX: Added missing function to simulate an incoming cyber threat for the background monitor.
export const simulateIncomingThreat = async (): Promise<InterceptedMessage> => {
    return {
        sender: '+91 98400 12345',
        content: 'URGENT: Your electricity connection will be cut today. Click here to pay: http://bit.ly/update-pay-101',
        platform: 'SMS',
        timestamp: new Date().toISOString(),
        detectedCategory: 'Financial Scam / Fraud',
        threatLevel: 'High'
    };
};

// Mock Utilities
export const getGovtSchemes = async (s: string) => [{ title: 'PM-Kisan', description: 'Support for Farmers', eligibility: 'Farmers', benefits: ['Direct Cash'] }];
export const scanUrl = async (u: string) => ({ url: u, isSafe: !u.includes('bad'), riskScore: u.includes('bad') ? 99 : 5, analysis: 'Scanned via Security Core' });
export const checkDataBreach = async (id: string) => [];
export const getCriminalNetwork = async () => ({ nodes: [], links: [] });
export const getEmergencyContacts = async () => getDB().contacts;
export const addEmergencyContact = async (n: string, p: string) => {
    const db = getDB();
    const nc = { id: Date.now(), name: n, phone: p };
    db.contacts.push(nc);
    saveDB(db);
    return nc;
};
export const deleteEmergencyContact = async (id: number) => {
    const db = getDB();
    db.contacts = db.contacts.filter((c: any) => c.id !== id);
    saveDB(db);
    return true;
};
export const getHealthData = async () => ({ doctors: [], hospitals: [] });
export const getTransportStaff = async () => [];
export const getSanitationWorkers = async () => [];
export const getWaterStaff = async () => [];
export const getElectricityStaff = async () => [];
export const getHousingStaff = async () => [];
export const getPoliceOfficers = async () => [];
export const getPublicWorksStaff = async () => [];
export const getFinanceStaff = async () => [];
export const getEducationData = async () => ({ teachers: [], schools: [] });
export const getAiSuggestion = async (i: any) => "AI suggests immediate routing to Public Works.";
export const changePassword = async (e: string, c: string, n: string) => true;
export const updateUser = async (u: User) => {
    const db = getDB();
    const idx = db.users.findIndex((user: any) => user.email === u.email);
    if (idx !== -1) { db.users[idx] = u; saveDB(db); }
    return u;
};

// Legacy exports for compatibility
export const mockAnnouncements = initializeDB().announcements;
export const mockDonations = initializeDB().donations;
export const mockResolvedIssues = [];
