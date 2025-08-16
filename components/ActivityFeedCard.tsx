
import React, { useState, useEffect } from 'react';
import { ActivityFeedItem } from '../types';
import { api } from '../services/mockApi';
import { IconLoader, IconShieldCheck, IconEdit, IconUsers, IconChevronDown } from './Icons';
import { formatTimeAgo } from '../utils/helpers';
import { useData } from '../contexts/DataContext';
import Card from './Card';
import clsx from 'clsx';

const ActivityFeedCard: React.FC<{ pan: string }> = ({ pan }) => {
    const [feed, setFeed] = useState<ActivityFeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // Default to collapsed
    const { getBranchName } = useData();

    const activityIcons: Record<ActivityFeedItem['activityType'], React.ElementType> = {
        DEVIATION_APPROVAL: IconShieldCheck,
        SET_BALANCE_UPDATE: IconEdit,
        ASSIGNMENT_CHANGE: IconUsers,
    };

    const activityColors: Record<ActivityFeedItem['activityType'], string> = {
        DEVIATION_APPROVAL: 'bg-emerald-500',
        SET_BALANCE_UPDATE: 'bg-brand-blue-500',
        ASSIGNMENT_CHANGE: 'bg-amber-500',
    };

    useEffect(() => {
        if (!pan) return;
        setLoading(true);
        api.getClientActivityFeed(pan)
            .then(setFeed)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [pan]);

    const renderContent = () => {
         if (loading) {
            return <div className="h-40 flex items-center justify-center"><IconLoader className="h-6 w-6 animate-spin text-brand-blue-600"/></div>;
        }
        if (feed.length === 0) {
            return <p className="text-center text-slate-500 py-4">No activity recorded.</p>;
        }
        return (
            <ul className="space-y-4">
                {feed.map(item => {
                    const Icon = activityIcons[item.activityType];
                    const color = activityColors[item.activityType];
                    return (
                        <li key={item.id} className="flex gap-3">
                            <div className={`relative h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full text-white ${color}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-800">{item.description}</p>
                                <p className="text-xs text-slate-500">
                                    {formatTimeAgo(new Date(item.timestamp))} by {item.author} in {getBranchName(item.branchId)}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }

    return (
        <Card
            title="Activity Feed"
            noBodyPadding={true}
            actions={
                 <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 rounded-full hover:bg-slate-100"
                    aria-label={isOpen ? "Collapse activity feed" : "Expand activity feed"}
                    aria-expanded={isOpen}
                    disabled={loading}
                >
                    <IconChevronDown className={clsx("h-5 w-5 text-slate-500 transition-transform", { 'rotate-180': isOpen })} />
                </button>
            }
        >
             <div className={clsx(
                "transition-[max-height] duration-500 ease-in-out overflow-y-auto",
                { 'max-h-96': isOpen, 'max-h-0': !isOpen }
            )}>
                 <div className="p-4">
                    {renderContent()}
                </div>
            </div>
        </Card>
    );
};

export default ActivityFeedCard;
