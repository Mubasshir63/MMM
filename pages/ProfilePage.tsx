
import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { Language, EmergencyContact, Page } from '../types';
import * as mockApi from '../api/mockApi';
import {
    ArrowRightIcon,
    MyReportsIcon,
    HeadsetIcon,
    ShieldIcon,
    InfoIcon,
    LogoutIcon,
    PhoneVibrateIcon,
    MicrophoneIcon,
    PhoneIcon,
    PlusCircleIcon,
    TrashIcon,
    XMarkIcon,
    HeartPlusIcon,
    HospitalIcon,
    FuelIcon,
    WrenchIcon,
    ScaleIcon,
    BuildingOfficeIcon,
    KeyIcon,
    CheckCircleIcon,
    UserGroupIcon
} from '../components/icons/NavIcons';
import { useTranslation } from '../hooks/useTranslation';

const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200/80 ${className}`}>
        <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider p-4 pb-2">{title}</h3>
        <div className="divide-y divide-slate-100">{children}</div>
    </div>
);

const ProfileLink: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void; }> = ({ icon, title, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center p-4 text-left group transition-colors hover:bg-slate-50">
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 group-hover:bg-teal-100 text-slate-600 group-hover:text-teal-600 flex items-center justify-center transition-colors">
                {icon}
            </div>
            <span className="font-semibold text-slate-700">{title}</span>
        </div>
        <div className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-600">
            <ArrowRightIcon />
        </div>
    </button>
);

const ToggleSwitch: React.FC<{ id: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, checked, onChange }) => (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
    </label>
);

interface ProfilePageProps { 
    setView: (view: string) => void;
    onEditProfileClick: () => void;
    navigateToMapWithFilter: (category: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setView, onEditProfileClick, navigateToMapWithFilter }) => {
    const { user, logout } = useContext(UserContext);
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    
    // SOS Settings State
    const [shakeToSosEnabled, setShakeToSosEnabled] = useState(localStorage.getItem('shakeToSosEnabled') === 'true');
    const [secretWordEnabled, setSecretWordEnabled] = useState(localStorage.getItem('secretWordEnabled') === 'true');
    const [secretWord, setSecretWord] = useState(localStorage.getItem('secretWord') || 'Help Help');
    const [isEditingSecretWord, setIsEditingSecretWord] = useState(false);

    const handleShakeToSosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enabled = e.target.checked;
        setShakeToSosEnabled(enabled);
        localStorage.setItem('shakeToSosEnabled', String(enabled));
        showToast(enabled ? 'Shake to SOS enabled (3 shakes).' : 'Shake to SOS disabled.');
    };

    const handleSecretWordToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enabled = e.target.checked;
        setSecretWordEnabled(enabled);
        localStorage.setItem('secretWordEnabled', String(enabled));
        if(enabled) {
            showToast(t('secretWordEnabledToast'));
        }
    };

    const saveSecretWord = () => {
        if(secretWord.trim().length < 3) {
            showToast("Secret phrase must be at least 3 characters.");
            return;
        }
        localStorage.setItem('secretWord', secretWord);
        setIsEditingSecretWord(false);
        showToast(t('saveSuccess'));
    };
    
    if (!user) return <div className="p-4">Loading user profile...</div>;
    
    return (
        <div className="bg-slate-50 min-h-full animate-fadeInUp">
            <div className="relative p-6 bg-gradient-to-br from-teal-600 to-green-700 text-white rounded-b-3xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-8 translate-y-8 opacity-50"></div>
                <div className="relative flex items-center space-x-5">
                    <img src={user.profilePicture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white/50 shadow-lg" />
                    <div>
                        <h1 className="text-3xl font-bold [text-shadow:_1px_1px_3px_rgb(0_0_0_/_0.2)]">{user.name}</h1>
                        <p className="text-teal-100">{user.location.district}, {user.location.state}</p>
                        <button onClick={onEditProfileClick} className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 text-xs font-bold rounded-full backdrop-blur-sm transition">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* --- Safety & Emergency Settings --- */}
                <SectionCard title="Safety & Emergency" className="animate-fadeInUp border-red-200 bg-red-50/30">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                <PhoneVibrateIcon className="w-6 h-6"/>
                            </div>
                            <div>
                                <span className="font-semibold text-slate-700">Shake to SOS</span>
                                <p className="text-xs text-slate-500">Shake phone 3 times to activate</p>
                            </div>
                        </div>
                        <ToggleSwitch id="shakeSosProfile" checked={shakeToSosEnabled} onChange={handleShakeToSosChange} />
                    </div>

                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <MicrophoneIcon className="w-6 h-6"/>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700">Shake & Speak</span>
                                    <p className="text-xs text-slate-500">One vigorous shake to listen</p>
                                </div>
                            </div>
                            <ToggleSwitch id="secretWordSosProfile" checked={secretWordEnabled} onChange={handleSecretWordToggle} />
                        </div>
                        {secretWordEnabled && (
                            <div className="mt-3 pl-14 pr-2">
                                <div className="flex space-x-2 items-center">
                                    <input 
                                        type="text" 
                                        value={secretWord} 
                                        onChange={(e) => setSecretWord(e.target.value)}
                                        disabled={!isEditingSecretWord}
                                        className={`flex-1 text-sm px-3 py-1.5 rounded-lg border ${isEditingSecretWord ? 'border-blue-400 bg-white focus:ring-2 focus:ring-blue-200' : 'border-transparent bg-slate-100 text-gray-600'}`}
                                    />
                                    {isEditingSecretWord ? (
                                        <button onClick={saveSecretWord} className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"><CheckCircleIcon className="w-4 h-4"/></button>
                                    ) : (
                                        <button onClick={() => setIsEditingSecretWord(true)} className="text-xs text-blue-600 font-bold hover:underline px-2">Edit Phrase</button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-slate-100 my-2"></div>
                    <ProfileLink 
                        title="Emergency Contacts" 
                        icon={<UserGroupIcon className="w-6 h-6" />}
                        onClick={() => setView('emergencyContacts')} 
                    />
                </SectionCard>

                <SectionCard title="My Activity" className="animate-fadeInUp animation-delay-100">
                    <ProfileLink title="Track Applications" icon={<CheckCircleIcon className="w-6 h-6" />} onClick={() => setView('trackApplications')} />
                    <ProfileLink title={t('myReports')} icon={<MyReportsIcon className="w-6 h-6" />} onClick={() => setView('allReports')} />
                    <ProfileLink title="SOS History" icon={<ShieldIcon className="w-6 h-6" />} onClick={() => setView('sosHistory')} />
                </SectionCard>
                <SectionCard title="Community & Support" className="animate-fadeInUp animation-delay-150">
                    <ProfileLink title="Request Medical Aid" icon={<HeartPlusIcon className="w-6 h-6" />} onClick={() => setView('requestMedicalHelp')} />
                </SectionCard>
                <SectionCard title="Find Nearby" className="animate-fadeInUp animation-delay-200">
                    <ProfileLink title="Hospitals" icon={<HospitalIcon />} onClick={() => navigateToMapWithFilter('Hospital')} />
                    <ProfileLink title="Petrol Bunks" icon={<FuelIcon className="w-6 h-6"/>} onClick={() => navigateToMapWithFilter('Petrol Bunk')} />
                    <ProfileLink title="Mechanic Sheds" icon={<WrenchIcon className="w-6 h-6" />} onClick={() => navigateToMapWithFilter('Mechanic')} />
                    <ProfileLink title="Ration Shops" icon={<ScaleIcon className="w-6 h-6" />} onClick={() => navigateToMapWithFilter('Ration Shop')} />
                    <ProfileLink title="Govt. Offices" icon={<BuildingOfficeIcon className="w-6 h-6" />} onClick={() => navigateToMapWithFilter('Govt Office')} />
                </SectionCard>
                <SectionCard title="Settings & More" className="animate-fadeInUp animation-delay-300">
                    <ProfileLink title="Account Settings" icon={<KeyIcon className="w-6 h-6"/>} onClick={() => setView('accountSettings')} />
                    <ProfileLink title="About Us" icon={<InfoIcon className="w-6 h-6" />} onClick={() => setView('aboutUs')} />
                    <ProfileLink title={t('helpSupport')} icon={<HeadsetIcon className="w-6 h-6" />} onClick={() => setView('helpSupport')} />
                </SectionCard>
                <div className="animate-fadeInUp animation-delay-400">
                    <button onClick={logout} className="w-full flex items-center justify-center p-4 text-red-600 font-bold bg-white rounded-2xl shadow-sm hover:bg-red-50 transition-colors border border-gray-200/80">
                        <LogoutIcon className="w-6 h-6 mr-2" /> {t('logOut')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
