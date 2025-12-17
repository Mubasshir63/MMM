
import React, { useState, useEffect, useMemo, useRef } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import MapPage from './pages/MapPage';
import ReportPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/BottomNav';
import { UserContext } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationsProvider, useNotifications } from './contexts/NotificationsContext';
import type { User, LocationData, DetailedReport, SOSAlert, SOSState, Announcement, DonationRequest } from './types';
import { Page, ReportStatus } from './types';
import Header from './components/Header';
import NotificationsPanel from './components/NotificationsPanel';
import { useTranslation } from './hooks/useTranslation';
import * as mockApi from './api/mockApi';
import { GoogleGenAI } from "@google/genai";

// Import existing and new service detail pages
import GovtPortalsPage from './pages/services/GovtPortalsPage';
import ComplaintRegistrationPage from './pages/services/ComplaintRegistrationPage';
import WaterPowerPage from './pages/services/WaterPowerPage';
import TransportInfoPage from './pages/services/TransportInfoPage';
import WasteTrackerPage from './pages/services/WasteTrackerPage';
import MedicalHelpPage from './pages/services/MedicalHelpPage';
import LocalEventsPage from './pages/services/LocalEventsPage';
import VolunteerPage from './pages/services/VolunteerPage';
import DownloadCenterPage from './pages/services/DownloadCenterPage';
import GovtSchemesPage from './pages/services/GovtSchemesPage';
import LegalHelpPage from './pages/services/LegalHelpPage';
import AiAssistantModal from './components/AiAssistantModal';
import AadhaarServicesPage from './pages/services/AadhaarServicesPage';
import PassportSevaPage from './pages/services/PassportSevaPage';
import FindBloodBanksPage from './pages/services/FindBloodBanksPage';
import BookVaccinationPage from './pages/services/BookVaccinationPage';
import EmergencyAmbulancePage from './pages/services/EmergencyAmbulancePage';
import MetroCardRechargePage from './pages/services/MetroCardRechargePage';
import ParkingFinderPage from './pages/services/ParkingFinderPage';
import NewConnectionPage from './pages/services/NewConnectionPage';
import CommunityCentersPage from './pages/services/CommunityCentersPage';
import PropertyTaxPage from './pages/services/PropertyTaxPage';
import LandRecordsPage from './pages/services/LandRecordsPage';
import SchoolAdmissionsPage from './pages/services/SchoolAdmissionsPage';
import PublicLibrariesPage from './pages/services/PublicLibrariesPage';
import DigitalLockerPage from './pages/services/DigitalLockerPage';
import ServiceTransition from './components/ServiceTransition';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import CyberSafetyPage from './pages/services/CyberSafetyPage';
import MomsCarePage from './pages/services/MomsCarePage';


// Import Home sub-pages
import AllAnnouncementsPage from './pages/home/AllAnnouncementsPage';
import AllDonationsPage from './pages/home/AllDonationsPage';
import AllResolvedIssuesPage from './pages/home/AllResolvedIssuesPage';

// Import Profile sub-pages and shared components
import AllReportsPage from './pages/profile/AllReportsPage';
import SOSHistoryPage from './pages/profile/SOSHistoryPage';
import RequestMedicalHelpPage from './pages/profile/RequestMedicalHelpPage';
import EmergencyContactsPage from './pages/profile/EmergencyContactsPage';
import TrackApplicationsPage from './pages/profile/TrackApplicationsPage';
import ReportDetailModal from './components/ReportDetailModal';
import SOSDetailModal from './components/SOSDetailModal';
import EditProfileModal from './components/EditProfileModal';
import AccountSettingsPage from './pages/profile/AccountSettingsPage';
import AboutUsPage from './pages/profile/AboutUsPage';
import HelpAndSupportPage from './pages/profile/HelpAndSupportPage';


import SOSModal from './components/SOSModal';
import SOSConfirmationModal from './components/SOSConfirmationModal';
import SecretWordListenerModal from './components/SecretWordListenerModal';

// Import Government Module Page
import GovtDashboardPage from './pages/gov/GovtDashboardPage';


const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, _setCurrentPage] = useState<Page>(Page.Home);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [transitioningService, setTransitioningService] = useState<string | null>(null);
  const [activeHomePageView, setActiveHomePageView] = useState<string>('dashboard');
  const [activeProfilePageView, setActiveProfilePageView] = useState<string>('dashboard');
  const [modalReport, setModalReport] = useState<DetailedReport | null>(null);
  const [modalSosAlert, setModalSosAlert] = useState<SOSAlert | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [isVoiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [mapFilter, setMapFilter] = useState<string | null>(null);
  
  const [isConfirmingSos, setIsConfirmingSos] = useState(false);
  const [sosModalState, setSosModalState] = useState<{open: boolean, initialState: SOSState}>({open: false, initialState: 'idle'});
  const [isListeningForSecretWord, setIsListeningForSecretWord] = useState(false);
  
  const isSosFlowActiveRef = useRef(sosModalState.open || isConfirmingSos || isListeningForSecretWord);
  isSosFlowActiveRef.current = sosModalState.open || isConfirmingSos || isListeningForSecretWord;

  const listenerTimeoutRef = useRef<number | null>(null);
  
  const [reports, setReports] = useState<DetailedReport[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);

  const notifications = useNotifications();
  const { t } = useTranslation();
  
  // Data Fetching from Mock API
  useEffect(() => {
    mockApi.getReports().then(setReports);
    mockApi.getSOSAlerts().then(setSosAlerts);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if(user && user.role === 'citizen'){
      const hasSeenAnnouncement = localStorage.getItem('seenAnnouncement_2');
      if (!hasSeenAnnouncement) {
        setTimeout(() => {
            notifications.addNotification(
                'New Announcement',
                'The deadline for property tax payment has been extended to August 31st without penalty.'
            );
            localStorage.setItem('seenAnnouncement_2', 'true');
        }, 5000);
      }
    } else if (user && user.role === 'official') {
        // Subscribe to real-time SOS alerts for government officials
        const unsubscribe = mockApi.subscribeToSOSAlerts((newAlert) => {
            setSosAlerts(prev => [newAlert, ...prev]);
            notifications.showToast(`New SOS Alert #${newAlert.id} from ${newAlert.user.name}`);
        });
        return () => unsubscribe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    // Shake detection logic
    if (!user || user.role !== 'citizen') return;

    let lastShakeTime = 0;
    let shakeCount = 0;
    let lastSingleShakeTime = 0; // For cooldown of single-shake listener

    const SHAKE_THRESHOLD = 25; 
    const SHAKE_COUNT_RESET_TIME = 3000;
    const SHAKES_TO_TRIGGER = 3;
    const SHAKE_COOLDOWN = 400;
    const SINGLE_SHAKE_COOLDOWN = 5000; // 5s cooldown to prevent accidental triggers

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
        const shakeToSosEnabled = localStorage.getItem('shakeToSosEnabled') === 'true';
        const secretWordEnabled = localStorage.getItem('secretWordEnabled') === 'true';

        if (isSosFlowActiveRef.current && !isListeningForSecretWord) return;

        const { x, y, z } = event.accelerationIncludingGravity || { x:0, y:0, z:0 };
        if (x === null || y === null || z === null) return;
        
        const acceleration = Math.sqrt(x*x + y*y + z*z);
        const now = Date.now();

        if (acceleration > SHAKE_THRESHOLD) {
            if (now - lastShakeTime < SHAKE_COOLDOWN) return; // Debounce subsequent shakes too close together

            // Handle 3-shake-to-activate SOS
            if (shakeToSosEnabled) {
                if (now - lastShakeTime > SHAKE_COUNT_RESET_TIME) {
                    shakeCount = 1;
                } else {
                    shakeCount++;
                }
                lastShakeTime = now;
                
                if (shakeCount >= SHAKES_TO_TRIGGER) {
                    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                    setIsListeningForSecretWord(false); // Cancel any active listener
                    setIsConfirmingSos(true);
                    shakeCount = 0; // Reset
                    return; // Prioritize this and exit
                }
            }

            // Handle 1-shake-to-listen
            // Only trigger if not already confirming SOS or in SOS flow
            if (secretWordEnabled && now - lastSingleShakeTime > SINGLE_SHAKE_COOLDOWN && !isConfirmingSos && !sosModalState.open) { 
                lastSingleShakeTime = now;
                if (navigator.vibrate) navigator.vibrate(100);
                setIsListeningForSecretWord(true);
            }
        }
    };

    window.addEventListener('devicemotion', handleDeviceMotion);

    return () => {
        window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [user, isListeningForSecretWord, isConfirmingSos, sosModalState.open]);

  // Manages the listening window timeout
  useEffect(() => {
      if (!isListeningForSecretWord) {
          return;
      }
      
      listenerTimeoutRef.current = window.setTimeout(() => {
          setIsListeningForSecretWord(false);
      }, 7000); // 7-second window

      return () => {
          if (listenerTimeoutRef.current) {
              clearTimeout(listenerTimeoutRef.current);
          }
      };
  }, [isListeningForSecretWord]);

  // Manages the speech recognition logic
  useEffect(() => {
      if (!isListeningForSecretWord) {
          return;
      }

      const secretWord = (localStorage.getItem('secretWord') || '').trim().toLowerCase();
      if (!secretWord) {
          setIsListeningForSecretWord(false);
          return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
          console.warn('Speech Recognition API not supported.');
          setIsListeningForSecretWord(false);
          return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Keep listening within the 7s window
      recognition.interimResults = true; // Get results faster for quicker detection
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
              const transcript = event.results[i][0].transcript.trim().toLowerCase();
              if (transcript.includes(secretWord)) {
                  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                  setIsConfirmingSos(true);
                  setIsListeningForSecretWord(false); 
                  return; // Stop processing once found
              }
          }
      };

      recognition.onerror = (event: any) => {
          // Ignore 'aborted' as it can be triggered by our own code.
          // Ignore 'no-speech' as the modal timeout handles this.
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
              console.error('Speech recognition error:', event.error);
              setIsListeningForSecretWord(false);
          }
      };
      
      try {
          recognition.start();
      } catch (e) {
          console.error('Could not start speech recognition:', e);
          setIsListeningForSecretWord(false);
      }

      // The cleanup function will be called when isListeningForSecretWord becomes false
      return () => {
          recognition.stop();
      };
  }, [isListeningForSecretWord]);

  const setCurrentPage = (page: Page) => {
    // Reset active service and home view when changing main pages
    if (page !== currentPage) {
      setActiveService(null);
      setActiveHomePageView('dashboard');
      setActiveProfilePageView('dashboard');
      setSearchQuery('');
    }
    _setCurrentPage(page);
  };

  const navigateToMapWithFilter = (category: string) => {
    setMapFilter(category);
    setCurrentPage(Page.Map);
  };

  const navigateToService = (serviceId: string) => {
    if (serviceId === 'fileNewReport') {
        setCurrentPage(Page.Report);
        return;
    }
    setTransitioningService(serviceId);
  };
  
  const handleTransitionEnd = (serviceId: string) => {
      _setCurrentPage(Page.Services);
      setActiveService(serviceId);
      setTransitioningService(null);
  };

  const handleLogin = async (identifier: string, password_val: string) => {
    const loggedInUser = await mockApi.login(identifier, password_val, 'citizen');
    if(loggedInUser) {
        setUser(loggedInUser);
        setSearchQuery('');
        setCurrentPage(Page.Home);
    } else {
        notifications.showToast('Invalid credentials. Please try again.');
    }
  };
  
  const handleRegister = async (userData: Omit<User, 'profilePicture' | 'role' | 'email'>) => {
    const newUser = await mockApi.register(userData);
    if (newUser) {
        setUser(newUser);
        setSearchQuery('');
        setCurrentPage(Page.Home);
        notifications.showToast(`Welcome, ${newUser.name}!`);
    } else {
        notifications.showToast('Registration failed. User may already exist.');
    }
};

  const handleGovLogin = async (email: string, password_val: string) => {
    const loggedInUser = await mockApi.login(email, password_val, 'official');
    if(loggedInUser) {
      setUser(loggedInUser);
    } else {
        notifications.showToast('Invalid government credentials.');
    }
  };
  
  const handleLogout = () => {
    setUser(null);
    setSearchQuery('');
    setCurrentPage(Page.Home);
  };
  
  const handleUpdateProfile = async (updatedUserData: User) => {
    const savedUser = await mockApi.updateUser(updatedUserData);
    setUser(savedUser);
    setEditProfileOpen(false);
    notifications.showToast('Profile updated successfully!');
}

  const handleCreateNewIssue = async (newIssueData: {
      title: string;
      category: string;
      description: string;
      photo?: string | null;
      video?: string | null;
      coords: { lat: number; lng: number };
      priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  }) => {
      if (!user) return;
    
      // AI-based routing
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const departments = ['Health', 'Transport', 'Sanitation', 'Water', 'Electricity', 'Housing', 'Safety & Police', 'Public Works', 'Finance', 'Education'];
      const prompt = `An issue has been reported with category "${newIssueData.category}" and description: "${newIssueData.description}". 
      Which of the following departments is the most appropriate to handle this issue?
      Departments: ${departments.join(', ')}.
      Respond with ONLY the department name from the list. Your response must be exact and contain nothing else.`;
  
      let assignedDepartment = 'Public Works'; // A sensible default
  
      try {
          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
          });
          const suggestedDept = response.text.trim();
          const foundDept = departments.find(d => suggestedDept.includes(d));
          if (foundDept) {
              assignedDepartment = foundDept;
          } else {
               console.warn(`AI suggested an unknown department: "${suggestedDept}". Falling back to default.`);
          }
      } catch (error) {
          console.error("AI routing failed, using fallback:", error);
      }
      
      const newReport = await mockApi.createReport(newIssueData, user, assignedDepartment);
      setReports(prevReports => [newReport, ...prevReports]);
  
      // Create a dataflow item for visualization in Gov Hub
      await mockApi.createDataflowSubmission({
          service: 'New Issue Report',
          user: { name: user.name, profilePicture: user.profilePicture },
          payload: { title: newIssueData.title, category: newIssueData.category },
          externalSystem: `${assignedDepartment} Dept.`,
      });
      
      notifications.showToast('Issue reported and automatically routed!');
      notifications.addNotification(
        'Report Routed',
        `Your report for "${newIssueData.title}" was automatically routed to the ${assignedDepartment} Department.`,
        Page.Profile
      );
  };

  const handleCreateDonationRequest = async (requestData: Omit<DonationRequest, 'id' | 'raised'>) => {
      if (!user) return;
      await mockApi.createDonationRequest(requestData, user);
      notifications.showToast('Your request for medical aid has been submitted.');
      notifications.addNotification(
        'Medical Aid Request Submitted',
        `Your request for "${requestData.title}" is now live.`
      );
      setActiveProfilePageView('dashboard');
  };

  const handleUpdateReportStatus = async (reportId: number, newStatus: ReportStatus) => {
    const updatedReport = await mockApi.updateReport(reportId, { status: newStatus });
    if(updatedReport) {
        setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
        notifications.addNotification(
            'Report Status Update',
            `Status for report #${reportId} updated to ${newStatus}.`
        );
    }
  };

  const handleAssignReport = async (reportId: number, assigneeName: string) => {
    const updatedReport = await mockApi.updateReport(reportId, { 
        assigned_to: { name: assigneeName, id: assigneeName, role: 'Officer' },
        status: ReportStatus.UnderReview
    });
     if(updatedReport) {
        setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
    }
  };

    const handleNewSOSAlert = async (videoDataUrl: string) => {
        if (!user) return;
        const newAlert = await mockApi.createSOSAlert(user, videoDataUrl);
        setSosAlerts(prevAlerts => [newAlert, ...prevAlerts]);
        notifications.addNotification(
            'SOS Activated',
            'Your location and a 1-minute video have been shared with emergency services.',
            Page.Profile // Link to profile where SOS History will be
        );
    };

    const handleSOSAction = async (alertId: number, action: 'Acknowledge' | 'Resolve') => {
        if (action === 'Resolve') {
            await mockApi.deleteSOSAlert(alertId);
            setSosAlerts(prev => prev.filter(a => a.id !== alertId));
        } else {
            const updatedAlert = await mockApi.updateSOSAlert(alertId, { status: 'Acknowledged' });
            if(updatedAlert) {
                setSosAlerts(prev => prev.map(a => a.id === alertId ? updatedAlert : a));
            }
        }
    };

    const triggerSosFlow = (initialState: SOSState = 'countdown') => {
        setSosModalState({ open: true, initialState });
    };

  const handleVoiceCommand = (command: { action: string; payload: any }) => {
    console.log('Executing voice command:', command);
    const { action, payload } = command;

    switch (action) {
        case 'navigateToPage':
            if (Object.values(Page).includes(payload.page as Page)) {
                setCurrentPage(payload.page as Page);
            }
            break;
        case 'navigateToService':
            if (payload.serviceId) {
                navigateToService(payload.serviceId);
            }
            break;
        case 'search':
            if (payload.query) {
                setSearchQuery(payload.query);
            }
            break;
        default:
            notifications.showToast(`I'm not sure how to do that yet.`);
            console.warn('Unknown voice command action:', action);
    }
    setVoiceAssistantOpen(false); // Close modal after executing command
  };

  const userContextValue = useMemo(() => ({ user, setUser, logout: handleLogout }), [user]);

  const renderServicePage = () => {
    const handleBack = () => setActiveService(null);

    if (!activeService) {
      return <ServicesPage onSelectService={navigateToService} setCurrentPage={setCurrentPage} searchQuery={searchQuery} />;
    }
    switch (activeService) {
      case 'govtPortals':
        return <GovtPortalsPage onBack={handleBack} />;
      case 'complaintRegistration':
        return <ComplaintRegistrationPage onBack={handleBack} onCreateIssue={handleCreateNewIssue} />;
      case 'waterPower':
        return <WaterPowerPage onBack={handleBack} onCreateIssue={handleCreateNewIssue} />;
      case 'transportInfo':
        return <TransportInfoPage onBack={handleBack} />;
      case 'wasteTracker':
        return <WasteTrackerPage onBack={handleBack} onCreateIssue={handleCreateNewIssue} />;
      case 'medicalHelp':
        return <MedicalHelpPage onBack={handleBack} />;
      case 'localEvents':
        return <LocalEventsPage onBack={handleBack} />;
      case 'volunteer':
        return <VolunteerPage onBack={handleBack} />;
      case 'downloadCenter':
        return <DownloadCenterPage onBack={handleBack} />;
      case 'govtSchemes':
        return <GovtSchemesPage onBack={handleBack} />;
      case 'legalHelp':
        return <LegalHelpPage onBack={handleBack} onLaunchAiAssistant={() => setAiAssistantOpen(true)} />;
      case 'aadhaarServices':
        return <AadhaarServicesPage onBack={handleBack} />;
      case 'passportSeva':
        return <PassportSevaPage onBack={handleBack} />;
      case 'findBloodBanks':
        return <FindBloodBanksPage onBack={handleBack} />;
      case 'bookVaccination':
        return <BookVaccinationPage onBack={handleBack} />;
      case 'emergencyAmbulance':
        return <EmergencyAmbulancePage onBack={handleBack} />;
      case 'metroCardRecharge':
        return <MetroCardRechargePage onBack={handleBack} />;
      case 'parkingFinder':
        return <ParkingFinderPage onBack={handleBack} />;
      case 'newConnection':
        return <NewConnectionPage onBack={handleBack} />;
      case 'communityCenters':
        return <CommunityCentersPage onBack={handleBack} />;
      case 'propertyTax':
        return <PropertyTaxPage onBack={handleBack} />;
      case 'landRecords':
        return <LandRecordsPage onBack={handleBack} />;
      case 'schoolAdmissions':
        return <SchoolAdmissionsPage onBack={handleBack} />;
      case 'publicLibraries':
        return <PublicLibrariesPage onBack={handleBack} />;
      case 'digitalLocker':
        return <DigitalLockerPage onBack={handleBack} />;
      case 'cyberSafety':
        return <CyberSafetyPage onBack={handleBack} />;
      case 'momsCare':
        return <MomsCarePage onBack={handleBack} navigateToMapWithFilter={navigateToMapWithFilter} />;
      default:
        // Fallback for services not yet implemented
        return <ServicesPage onSelectService={navigateToService} setCurrentPage={setCurrentPage} searchQuery={searchQuery} />;
    }
  };

  const renderHomePageContent = () => {
    switch (activeHomePageView) {
      case 'allAnnouncements':
        return <AllAnnouncementsPage onBack={() => setActiveHomePageView('dashboard')} />;
      case 'allDonations':
        return <AllDonationsPage onBack={() => setActiveHomePageView('dashboard')} />;
      case 'allResolved':
        return <AllResolvedIssuesPage onBack={() => setActiveHomePageView('dashboard')} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} navigateToService={navigateToService} setView={setActiveHomePageView} searchQuery={searchQuery} triggerSosFlow={triggerSosFlow} />;
    }
  };

  const renderProfilePageContent = () => {
    switch (activeProfilePageView) {
      case 'trackApplications':
        return <TrackApplicationsPage onBack={() => setActiveProfilePageView('dashboard')} />;
      case 'allReports':
        return <AllReportsPage reports={reports} onBack={() => setActiveProfilePageView('dashboard')} onSelectReport={setModalReport} />;
      case 'sosHistory':
        return <SOSHistoryPage alerts={sosAlerts} onBack={() => setActiveProfilePageView('dashboard')} onSelectAlert={setModalSosAlert} />;
      case 'requestMedicalHelp':
        return <RequestMedicalHelpPage onBack={() => setActiveProfilePageView('dashboard')} onSubmit={handleCreateDonationRequest} />;
      case 'emergencyContacts':
        return <EmergencyContactsPage onBack={() => setActiveProfilePageView('dashboard')} />;
      case 'accountSettings':
        return <AccountSettingsPage onBack={() => setActiveProfilePageView('dashboard')} />;
      case 'aboutUs':
        return <AboutUsPage onBack={() => setActiveProfilePageView('dashboard')} />;
      case 'helpSupport':
        return <HelpAndSupportPage onBack={() => setActiveProfilePageView('dashboard')} />;
      default:
        return <ProfilePage setView={setActiveProfilePageView} onEditProfileClick={() => setEditProfileOpen(true)} navigateToMapWithFilter={navigateToMapWithFilter} />;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return renderHomePageContent();
      case Page.Services:
        return renderServicePage();
      case Page.Map:
        return user?.location ? <MapPage userLocation={user.location} reports={reports} setCurrentPage={setCurrentPage} filter={mapFilter} onClearFilter={() => setMapFilter(null)} /> : <div>Please set your location.</div>;
      case Page.Report:
        return <ReportPage onAddNewReport={handleCreateNewIssue} />;
      case Page.Profile:
        return renderProfilePageContent();
      default:
        return <HomePage setCurrentPage={setCurrentPage} navigateToService={navigateToService} setView={setActiveHomePageView} searchQuery={searchQuery} triggerSosFlow={triggerSosFlow} />;
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }
  
  if (transitioningService) {
      return <ServiceTransition serviceKey={transitioningService} onTransitionEnd={() => handleTransitionEnd(transitioningService)} />;
  }

  return (
    <UserContext.Provider value={userContextValue}>
      <div className="h-full bg-gray-50 text-gray-800 font-sans antialiased">
        {!user ? (
          <LoginPage onLogin={handleLogin} onGovLogin={handleGovLogin} onRegister={handleRegister} />
        ) : user.role === 'official' ? (
          <GovtDashboardPage 
            reports={reports} 
            onUpdateReportStatus={handleUpdateReportStatus} 
            onAssignReport={handleAssignReport}
            alerts={sosAlerts}
            onSOSAction={handleSOSAction}
          />
        ) : (
          <div className="relative pb-16 h-dvh w-full flex flex-col">
            <Header
                user={user}
                unreadCount={notifications.unreadCount}
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                onNotificationsClick={() => setNotificationsOpen(true)}
                onProfileClick={() => setCurrentPage(Page.Profile)}
                onAiAssistantClick={() => setAiAssistantOpen(true)}
                onVoiceAssistantClick={() => setVoiceAssistantOpen(true)}
                searchPlaceholder={t('searchPlaceholder')}
                searchDisabled={currentPage === Page.Report || (currentPage === Page.Map && !!mapFilter) || !!activeService}
            />
            <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} onNavigate={setCurrentPage} />
            <main className="flex-1 overflow-y-auto">
              <div key={currentPage + (activeService || '') + (activeProfilePageView || '')} className="animate-page-enter">
                {renderPage()}
              </div>
            </main>
            <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
             {modalReport && (
                <ReportDetailModal 
                    report={modalReport} 
                    onClose={() => setModalReport(null)} 
                />
            )}
            {modalSosAlert && (
                <SOSDetailModal
                    alert={modalSosAlert}
                    onClose={() => setModalSosAlert(null)}
                />
            )}
            {isAiAssistantOpen && <AiAssistantModal onClose={() => setAiAssistantOpen(false)} />}
            {isVoiceAssistantOpen && <VoiceAssistantModal onClose={() => setVoiceAssistantOpen(false)} onCommand={handleVoiceCommand} />}
            {isEditProfileOpen && user && <EditProfileModal user={user} onClose={() => setEditProfileOpen(false)} onSave={handleUpdateProfile} />}
            {isListeningForSecretWord && (
                <SecretWordListenerModal 
                    onCancel={() => setIsListeningForSecretWord(false)}
                    duration={7} 
                />
            )}
            {isConfirmingSos && (
                <SOSConfirmationModal 
                    onConfirm={() => {
                        setIsConfirmingSos(false);
                        triggerSosFlow('activated');
                    }}
                    onCancel={() => setIsConfirmingSos(false)}
                />
            )}
            {sosModalState.open && <SOSModal 
                onClose={() => setSosModalState({open: false, initialState: 'idle'})} 
                initialState={sosModalState.initialState}
                onActivate={handleNewSOSAlert}
            />}
          </div>
        )}
      </div>
    </UserContext.Provider>
  );
};


const App: React.FC = () => {
  return (
    <LanguageProvider>
      <NotificationsProvider>
          <AppContent/>
      </NotificationsProvider>
    </LanguageProvider>
  );
}


export default App;
