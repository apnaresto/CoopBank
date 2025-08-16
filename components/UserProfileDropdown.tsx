
import React, { useState, useRef, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { IconUser, IconLogOut, IconChevronDown } from './Icons';

const UserProfileDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const MOCK_USER_NAME = 'Admin User';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        window.alert('User logged out successfully!');
        // In a real app, you would redirect to a login page or clear auth tokens.
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <IconUser className="h-5 w-5 text-slate-600" />
                </div>
                <span className="hidden sm:inline font-semibold text-sm text-slate-700">{MOCK_USER_NAME}</span>
                <IconChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-200 z-50 animate-fade-in-down" style={{ animationDuration: '0.2s' }}>
                    <div className="py-1">
                        <div className="px-4 py-3 border-b">
                            <p className="text-sm font-semibold text-slate-800 truncate">{MOCK_USER_NAME}</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                        <div className="py-1">
                            <ReactRouterDOM.Link
                                to="#"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            >
                                <IconUser className="h-4 w-4 mr-3" />
                                My Profile
                            </ReactRouterDOM.Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                            >
                                <IconLogOut className="h-4 w-4 mr-3" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileDropdown;
