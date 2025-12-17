



import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Announcement, DonationRequest, ResolvedIssue, SOSState } from '../types';
import { ReportStatus, Page } from '../types';
import { 
    PoliceIcon, AmbulanceIcon, FireDeptIcon, BloodBankIcon, HospitalIcon, NewReportIcon, 
    CertificateIcon, PayBillsIcon, NewConnectionIcon, MyReportsIcon, CheckCircleIcon, SOSIcon, PhoneVibrateIcon
} from '../components/icons/NavIcons';
import OnboardingGuide from '../components/OnboardingGuide';
import * as mockApi from '../api/mockApi';

// --- SKELETON COMPONENTS ---
const AnnouncementCardSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-3">
        <div className="animate-shimmer relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
                <div className="space-y-2 flex-1 pr-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-2 mt-4">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                 <div className="h-3 w-24 bg-gray-200 rounded"></div>
                 <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
        </div>
    </div>
);

const DonationCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden min-w-[300px] snap-start flex-shrink-0">
        <div className="animate-shimmer relative overflow-hidden">
            <div className="w-full h-40 bg-gray-200"></div>
            <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-2.5 bg-gray-200 rounded-full mb-3"></div>
                <div className="h-10 bg-gray-200 rounded-xl mt-4"></div>
            </div>
        </div>
    </div>
);

const ResolvedIssueSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-3 flex items-start space-x-4">
        <div className="animate-shimmer relative overflow-hidden w-full">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    </div>
);

const ServiceCardSkeleton: React.FC = () => (
    <div className="flex flex-col items-center space-y-2 text-center">
        <div className="animate-shimmer relative overflow-hidden">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
            <div className="h-3 w-12 bg-gray-200 rounded mt-2 mx-auto"></div>
        </div>
    </div>
);

const QuickLinkSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl p-4 flex items-center space-x-4 border border-gray-200">
        <div className="animate-shimmer relative overflow-hidden w-full">
            <div className="flex items-center space-x-4">
                <div className="bg-gray-200 rounded-lg p-2.5 w-12 h-12"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        </div>
    </div>
);


// --- SUB-COMPONENTS ---
const SectionHeader: React.FC<{ title: string; actionText?: string; onActionClick?: () => void }> = ({ title, actionText, onActionClick }) => (
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {actionText && (
            <button onClick={onActionClick} className="text-sm font-semibold text-green-600 hover:text-green-700">
                {actionText}
            </button>
        )}
    </div>
);

const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
    const statusStyles = {
        [ReportStatus.Emergency]: 'bg-red-100 text-red-800',
        [ReportStatus.Resolved]: 'bg-green-100 text-green-800',
        [ReportStatus.UnderReview]: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-3 transition-shadow duration-300 tilt-card">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-md leading-tight flex-1 pr-2">{announcement.title}</h3>
                    <StatusBadge status={announcement.status} />
                </div>
                <p className="text-gray-600 text-sm mb-3">{announcement.content}</p>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                 <p className="text-xs text-gray-500 font-medium">{announcement.source}</p>
                 <p className="text-xs text-gray-500">{announcement.timestamp}</p>
            </div>
        </div>
    );
};

const DonationCard: React.FC<{ request: DonationRequest }> = ({ request }) => {
    const { showToast } = useNotifications();
    const percentage = Math.round((request.raised / request.goal) * 100);

    const handleDonate = () => {
        showToast('Redirecting to a secure payment gateway...');
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden min-w-[300px] snap-start flex-shrink-0 transform hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
            <img src={request.image} alt={request.title} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="font-bold text-gray-900">{request.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{request.patientName} at {request.hospital}</p>
                
                <div className="my-3">
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-medium text-gray-600">Raised: ₹{request.raised.toLocaleString('en-IN')}</span>
                        <span className="font-medium text-gray-600">Goal: ₹{request.goal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
                <button 
                    onClick={handleDonate}
                    className="w-full mt-2 py-2.5 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-transform shadow-sm">
                    Donate Now
                </button>
            </div>
        </div>
    );
}

const ResolvedIssueCard: React.FC<{ issue: ResolvedIssue }> = ({ issue }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-3 flex items-start space-x-4 tilt-card">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center animate-pulse-check">
             <CheckCircleIcon />
        </div>
        <div>
            <p className="font-semibold text-gray-800">{issue.title}</p>
            <p className="text-xs text-gray-500">{issue.category} · {issue.resolvedDate}</p>
        </div>
    </div>
);

const ServiceCard: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, id?: string }> = ({ icon, label, onClick, id }) => (
    <div id={id} className="flex flex-col items-center space-y-2 text-center">
        <button 
            onClick={onClick}
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-2xl text-gray-700 transform hover:scale-105 hover:bg-green-100 hover:text-green-700 transition-all duration-200">
            {icon}
        </button>
        <span className="text-xs font-medium text-gray-700 w-16">{label}</span>
    </div>
);

const QuickLinkCard: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full bg-white rounded-xl p-4 flex items-center space-x-4 border border-gray-200 group text-left tilt-card">
    <div className="bg-gray-100 group-hover:bg-green-100 rounded-lg p-2.5 transition-colors text-green-600">
        {icon}
    </div>
    <div>
        <h3 className="font-semibold text-sm text-gray-800">{label}</h3>
    </div>
  </button>
);

interface HomePageProps {
    setCurrentPage: (page: Page) => void;
    navigateToService: (serviceId: string) => void;
    setView: (view: string) => void;
    searchQuery: string;
    triggerSosFlow: () => void;
}

// --- MAIN COMPONENT ---
const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, navigateToService, setView, searchQuery, triggerSosFlow }) => {
    const { user } = useContext(UserContext);
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [donations, setDonations] = useState<DonationRequest[]>([]);
    const [resolvedIssues, setResolvedIssues] = useState<ResolvedIssue[]>([]);

    // SOS Hold Logic
    const [sosHoldProgress, setSosHoldProgress] = useState(0);
    const sosHoldTimeoutRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const holdStartTimeRef = useRef<number | null>(null);
    const HOLD_DURATION = 2000; // 2 seconds


    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
            setShowOnboarding(true);
        }

        const fetchData = async () => {
            setIsLoading(true);
            const [anns, dons, resolved] = await Promise.all([
                mockApi.getAnnouncements(),
                mockApi.getDonations(),
                mockApi.getResolvedIssues(),
            ]);
            setAnnouncements(anns);
            setDonations(dons);
            setResolvedIssues(resolved);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleFinishOnboarding = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        setShowOnboarding(false);
    };

    const handleSosPressStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent context menu on long press
        setSosHoldProgress(0);
        holdStartTimeRef.current = Date.now();

        const animateProgress = () => {
            if (!holdStartTimeRef.current) return;
            const elapsedTime = Date.now() - holdStartTimeRef.current;
            const progress = Math.min(elapsedTime / HOLD_DURATION, 1);
            setSosHoldProgress(progress);
            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animateProgress);
            }
        };
        animationFrameRef.current = requestAnimationFrame(animateProgress);

        sosHoldTimeoutRef.current = window.setTimeout(() => {
            triggerSosFlow();
            sosHoldTimeoutRef.current = null; // Clear ref after firing
            holdStartTimeRef.current = null;
            if(animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        }, HOLD_DURATION);
    };

    const handleSosPressEnd = () => {
        if (sosHoldTimeoutRef.current) {
            clearTimeout(sosHoldTimeoutRef.current);
            sosHoldTimeoutRef.current = null;
            setSosHoldProgress(0);
        }
        
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        
        holdStartTimeRef.current = null;
    };

    const emergencyServices = useMemo(() => [
        { icon: <PoliceIcon />, label: t('police'), onClick: () => showToast('Calling Police Emergency: 100') },
        { icon: <AmbulanceIcon />, label: t('ambulance'), onClick: () => showToast('Calling Ambulance Emergency: 108') },
        { icon: <FireDeptIcon />, label: t('fireDept'), onClick: () => showToast('Calling Fire Department: 101') },
        { icon: <BloodBankIcon />, label: t('bloodBank'), onClick: () => navigateToService('medicalHelp') },
        { icon: <HospitalIcon />, label: t('hospitals'), onClick: () => setCurrentPage(Page.Map) },
        { id: 'new-report-button', icon: <NewReportIcon />, label: t('newReport'), onClick: () => setCurrentPage(Page.Report) },
    ], [t, showToast, setCurrentPage, navigateToService]);
    
    const quickLinks = useMemo(() => [
        { icon: <CertificateIcon />, label: 'Certificates', onClick: () => navigateToService('downloadCenter') },
        { icon: <PayBillsIcon />, label: 'Pay Bills', onClick: () => navigateToService('waterPower') },
        { icon: <NewConnectionIcon />, label: 'New Connection', onClick: () => navigateToService('waterPower') },
        { icon: <MyReportsIcon />, label: t('myReports'), onClick: () => setCurrentPage(Page.Profile) },
    ], [t, setCurrentPage, navigateToService]);

    const lowerCaseQuery = searchQuery.toLowerCase();

    const filteredAnnouncements = useMemo(() => 
        announcements.filter(ann =>
            ann.title.toLowerCase().includes(lowerCaseQuery) ||
            ann.content.toLowerCase().includes(lowerCaseQuery)
        ), [lowerCaseQuery, announcements]);

    const filteredDonations = useMemo(() =>
        donations.filter(req =>
            req.title.toLowerCase().includes(lowerCaseQuery) ||
            req.patientName.toLowerCase().includes(lowerCaseQuery) ||
            req.hospital.toLowerCase().includes(lowerCaseQuery)
        ), [lowerCaseQuery, donations]);
    
    const filteredResolvedIssues = useMemo(() =>
        resolvedIssues.filter(issue =>
            issue.title.toLowerCase().includes(lowerCaseQuery) ||
            issue.category.toLowerCase().includes(lowerCaseQuery)
        ), [lowerCaseQuery, resolvedIssues]);

    const filteredEmergencyServices = useMemo(() =>
        emergencyServices.filter(service =>
            service.label.toLowerCase().includes(lowerCaseQuery)
        ), [lowerCaseQuery, emergencyServices]);

    const filteredQuickLinks = useMemo(() =>
        quickLinks.filter(link =>
            link.label.toLowerCase().includes(lowerCaseQuery)
        ), [lowerCaseQuery, quickLinks]);
    
    const hasAnyResults = [
        ...filteredAnnouncements, 
        ...filteredDonations, 
        ...filteredResolvedIssues, 
        ...filteredEmergencyServices, 
        ...filteredQuickLinks
    ].length > 0;

    return (
        <div className="bg-gray-50 min-h-full">
            {showOnboarding && <OnboardingGuide onFinish={handleFinishOnboarding} />}
            
            <div className="p-4 space-y-8">
                {searchQuery && !hasAnyResults ? (
                    <div className="text-center py-10 text-gray-600">
                        <h2 className="text-xl font-bold mb-2">{t('noResultsFound')}</h2>
                        <p>{t('noResultsMatch', { query: searchQuery })}</p>
                    </div>
                ) : (
                    <>
                        {/* Government Announcements */}
                         <section className="animate-fadeInUp">
                            <SectionHeader title={t('govtAnnouncements')} actionText={t('viewAll')} onActionClick={() => setView('allAnnouncements')} />
                            {isLoading ? (
                                <div>
                                    <AnnouncementCardSkeleton />
                                    <AnnouncementCardSkeleton />
                                </div>
                            ) : (
                                (filteredAnnouncements.length > 0 || !searchQuery) && (
                                    <div>
                                        {filteredAnnouncements.slice(0, 2).map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
                                    </div>
                                )
                            )}
                        </section>
                        
                        {/* Emergency Services */}
                        <section className="animate-fadeInUp animation-delay-150">
                            <SectionHeader title={t('emergencyServices')} />
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-4 gap-x-2">
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
                                ) : (
                                    (filteredEmergencyServices.length > 0 || !searchQuery) && (
                                         filteredEmergencyServices.map(service => <ServiceCard key={service.label} {...service} />)
                                    )
                                )}
                            </div>
                        </section>
                        
                        {/* Urgent Medical Needs */}
                        <section className="animate-fadeInUp animation-delay-300">
                             <SectionHeader title={t('urgentMedicalNeeds')} actionText={t('seeMore')} onActionClick={() => setView('allDonations')} />
                             <div className="flex space-x-4 overflow-x-auto pb-3 snap-x -mx-4 px-4">
                                {isLoading ? (
                                    <>
                                        <DonationCardSkeleton />
                                        <DonationCardSkeleton />
                                    </>
                                ) : (
                                    (filteredDonations.length > 0 || !searchQuery) && (
                                        filteredDonations.map(req => <DonationCard key={req.id} request={req} />)
                                    )
                                )}
                             </div>
                        </section>
                        
                        {/* Quick Links */}
                        <section className="animate-fadeInUp animation-delay-400">
                            <SectionHeader title={t('quickLinks')} />
                            <div className="grid grid-cols-2 gap-3">
                                {isLoading ? (
                                    <>
                                        <QuickLinkSkeleton />
                                        <QuickLinkSkeleton />
                                        <QuickLinkSkeleton />
                                        <QuickLinkSkeleton />
                                    </>
                                ) : (
                                    (filteredQuickLinks.length > 0 || !searchQuery) && (
                                         filteredQuickLinks.map(link => <QuickLinkCard key={link.label} {...link} />)
                                    )
                                )}
                            </div>
                        </section>

                        {/* Shake for SOS Info */}
                        <section className="animate-fadeInUp animation-delay-500">
                            <div className="bg-blue-50 border-2 border-blue-200/50 rounded-xl p-4 flex items-start space-x-4">
                                <div className="flex-shrink-0 text-blue-600 pt-1">
                                    <PhoneVibrateIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-900">New! Shake for SOS</h3>
                                    <p className="text-sm text-blue-800/90 mt-1">
                                        For quick, discreet alerts, enable 'Shake for SOS' in your Profile. Shake your phone vigorously 3 times to activate.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Recently Resolved Issues */}
                        <section className="animate-fadeInUp animation-delay-600">
                             <SectionHeader title={t('recentlyResolved')} actionText={t('viewAll')} onActionClick={() => setView('allResolved')} />
                             {isLoading ? (
                                 <div>
                                    <ResolvedIssueSkeleton />
                                    <ResolvedIssueSkeleton />
                                 </div>
                             ) : (
                                 (filteredResolvedIssues.length > 0 || !searchQuery) && (
                                     <div>
                                        {filteredResolvedIssues.slice(0, 2).map(issue => <ResolvedIssueCard key={issue.id} issue={issue} />)}
                                     </div>
                                 )
                             )}
                        </section>
                    </>
                )}
            </div>
             {/* SOS Floating Action Button */}
            <button
                onMouseDown={handleSosPressStart}
                onTouchStart={handleSosPressStart}
                onMouseUp={handleSosPressEnd}
                onTouchEnd={handleSosPressEnd}
                onMouseLeave={handleSosPressEnd}
                className="fixed bottom-20 right-4 z-30 w-16 h-16 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center focus:outline-none animate-pulse-sos"
                aria-label="Hold for SOS Emergency Alert"
            >
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="text-red-400/50"
                        stroke="currentColor"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="46"
                        fill="transparent"
                    />
                    <circle
                        className="text-white transition-all duration-100 linear"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="46"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 46}
                        strokeDashoffset={(2 * Math.PI * 46) * (1 - sosHoldProgress)}
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <SOSIcon className="w-8 h-8 z-10" />
            </button>
        </div>
    );
};

export default HomePage;
