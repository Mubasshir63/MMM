import React, { useContext, useMemo, useState, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { DetailedReport, ReportStatus, SOSAlert, Department } from '../../../types';
import GovtMap from '../components/GovtMap';
import { 
    HeartIcon, SOSIcon, TransportIcon, WasteTrackerIcon, WaterLeakIcon, StreetlightIcon, BuildingOfficeIcon, ShieldIcon, WrenchIcon, PayBillsIcon, UsersIcon, CCTVIcon
} from '../../../components/icons/NavIcons';
import * as mockApi from '../../../api/mockApi';

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
};

const DepartmentStatus: React.FC<{ departments: Department[] }> = ({ departments }) => {
    const statusClasses = {
        Normal: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
        Warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
        Critical: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
    };

    const icons: { [key: string]: React.ReactNode } = {
        Health: <HeartIcon className="w-5 h-5" />,
        Transport: <TransportIcon className="w-5 h-5" />,
        Sanitation: <WasteTrackerIcon className="w-5 h-5" />,
        Water: <WaterLeakIcon className="w-5 h-5" />,
        Electricity: <StreetlightIcon className="w-5 h-5" />,
        Housing: <BuildingOfficeIcon className="w-5 h-5" />,
        Safety: <ShieldIcon className="w-5 h-5" />,
        'Public Works': <WrenchIcon className="w-5 h-5" />,
        Finance: <PayBillsIcon className="w-5 h-5" />,
        Education: <UsersIcon className="w-5 h-5" />,
        Administration: <UsersIcon className="w-5 h-5" />,
    };

    return (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/80 h-full flex flex-col">
            <h2 className="text-lg font-bold text-slate-100 mb-4 flex-shrink-0">Departmental Overview</h2>
            <div className="space-y-3 overflow-y-auto flex-1">
                {departments.map(dept => {
                    const classes = statusClasses[dept.status];
                    return (
                        <div key={dept.id} className={`p-3 rounded-lg flex items-center justify-between ${classes.bg} border border-slate-700/50`}>
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 ${classes.text}`}>{icons[dept.name]}</div>
                                <div>
                                    <p className="font-semibold text-slate-200">{dept.name}</p>
                                    <p className={`text-xs font-bold ${classes.text}`}>{dept.status}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-slate-200">{dept.open_issues}</p>
                                <p className="text-xs text-slate-400">Open</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface LiveAlertsFeedProps {
    reports: DetailedReport[];
    alerts: SOSAlert[];
    onSelectIssue: (issue: DetailedReport) => void;
}
const LiveAlertsFeed: React.FC<LiveAlertsFeedProps> = ({ reports, alerts, onSelectIssue }) => {
    const combinedFeed = useMemo(() => {
        const reportFeed = reports.map(r => ({ ...r, type: 'report', timestamp: r.date }));
        const sosFeed = alerts.map(a => ({ ...a, type: 'sos', timestamp: a.timestamp }));
        return [...reportFeed, ...sosFeed].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
    }, [reports, alerts]);

    return (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/80 h-full flex flex-col">
            <h2 className="text-lg font-bold text-slate-100 mb-4 flex-shrink-0 flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse-live"></div>LIVE ALERTS</h2>
            <div className="space-y-3 overflow-y-auto flex-1">
                {combinedFeed.map(item => {
                    if (item.type === 'sos') {
                        return (
                            <div key={`sos-${item.id}`} className="bg-red-500/20 p-3 rounded-lg border border-red-500/50 animate-glow">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/50 text-red-300 animate-pulse-sos"><SOSIcon /></div>
                                    <div>
                                        <p className="font-bold text-red-300">SOS: {item.user.name}</p>
                                        <p className="text-xs text-red-400">{item.location.address} &bull; {timeSince(item.timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    } else { // Report
                        const issue = item as DetailedReport;
                        return (
                            <div key={`report-${issue.id}`} onClick={() => onSelectIssue(issue)} className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-700/80">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300`}><TransportIcon/></div>
                                    <div>
                                        <p className="font-semibold text-slate-200 text-sm">{issue.title}</p>
                                        <p className="text-xs text-slate-400">{issue.category} &bull; {timeSince(issue.date)}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    );
};

const CCTVGrid: React.FC = () => {
    const cameras = [1, 2, 3, 4]; // Show 4 cameras
    return (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/80 h-full flex flex-col">
            <h2 className="text-lg font-bold text-slate-100 mb-4 flex-shrink-0 flex items-center"><CCTVIcon className="w-6 h-6 mr-2 text-teal-400"/>CCTV Grid</h2>
            <div className="grid grid-cols-2 gap-2 flex-1">
                {cameras.map(id => (
                    <div key={id} className="relative aspect-video bg-slate-900 rounded-md overflow-hidden border border-slate-700">
                        <img src={`https://picsum.photos/seed/cctv${id}/400/225`} className="w-full h-full object-cover opacity-80" alt={`Camera ${id}`}/>
                        <div className="absolute bottom-1 left-1.5 text-white text-[10px] font-bold drop-shadow-md">CAM-{String(id).padStart(2, '0')}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}


interface ControlRoomViewProps {
    reports: DetailedReport[];
    onSelectIssue: (issue: DetailedReport) => void;
    isLoading: boolean;
    alerts: SOSAlert[];
}

const ControlRoomView: React.FC<ControlRoomViewProps> = ({ reports, onSelectIssue, isLoading, alerts }) => {
    const { user } = useContext(UserContext);
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        mockApi.getDepartments().then(setDepartments);
    }, []);

    if (isLoading || !user) {
        return (
            <div className="p-4 md:p-6 grid grid-cols-12 gap-6 h-full animate-shimmer">
                <div className="col-span-12 lg:col-span-3 h-full bg-slate-700 rounded-xl"></div>
                <div className="col-span-12 lg:col-span-5 h-full bg-slate-700 rounded-xl"></div>
                <div className="col-span-12 lg:col-span-4 h-full bg-slate-700 rounded-xl"></div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 grid grid-cols-12 gap-6 h-full animate-fadeInUp">
            {/* Left Panel */}
            <div className="col-span-12 lg:col-span-3 h-full min-h-[400px]">
                <DepartmentStatus departments={departments} />
            </div>

            {/* Center Panel */}
            <div className="col-span-12 lg:col-span-5 h-full min-h-[500px] bg-slate-900/50 p-1 rounded-xl border border-slate-700/80">
                <div className="h-full rounded-lg overflow-hidden relative">
                    <GovtMap issues={reports} onMarkerClick={onSelectIssue} center={user.location.coords} />
                    <div className="scanner-line"></div>
                </div>
            </div>

            {/* Right Panel */}
             <div className="col-span-12 lg:col-span-4 h-full min-h-[500px] flex flex-col gap-6">
                <div className="flex-1 min-h-[250px]"><LiveAlertsFeed reports={reports} alerts={alerts} onSelectIssue={onSelectIssue} /></div>
                <div className="flex-1 min-h-[250px]"><CCTVGrid /></div>
            </div>
        </div>
    );
};

export default ControlRoomView;