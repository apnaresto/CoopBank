
import React, { useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { IconUsers, IconFamilyGroup, IconBriefcase, IconTags, IconShapes, IconWrench, IconLoader, IconChevronRight } from './Icons';
import PageHeader from './PageHeader';

interface ManagementCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    count: number;
    link: string;
    loading: boolean;
}

const ManagementCard: React.FC<ManagementCardProps> = ({ icon: Icon, title, description, count, link, loading }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <div className="bg-brand-blue-100 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-brand-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
            </div>
            <div className="flex-grow"></div>
            <div className="mt-6 flex justify-between items-end">
                {loading ? (
                    <div className="h-6 w-16 bg-slate-200 rounded animate-pulse"></div>
                ) : (
                    <p className="text-2xl font-bold text-slate-700">{count}</p>
                )}
                <ReactRouterDOM.Link to={link} className="inline-flex items-center text-sm font-semibold text-brand-blue-600 hover:text-brand-blue-800">
                    Manage <IconChevronRight className="h-4 w-4 ml-1" />
                </ReactRouterDOM.Link>
            </div>
        </div>
    );
};


const Management: React.FC = () => {
    const {
        loading,
        rms,
        branchManagers,
        familyGroups,
        accountTypes,
        accountCategories,
        softwareVendors,
    } = useData();

    const managementAreas = useMemo(() => [
        { 
            icon: IconUsers, 
            title: 'Relationship Managers', 
            description: 'Assign and track RMs.',
            count: rms.length, 
            link: '/management/rm'
        },
        { 
            icon: IconBriefcase, 
            title: 'Branch Managers',
            description: 'Manage heads of branches.',
            count: branchManagers.length, 
            link: '/management/bm'
        },
        { 
            icon: IconFamilyGroup, 
            title: 'Family Groups',
            description: 'Group client accounts.',
            count: familyGroups.length, 
            link: '/management/fg'
        },
        { 
            icon: IconWrench, 
            title: 'Software Vendors',
            description: 'Data source providers.',
            count: softwareVendors.length, 
            link: '/management/vendor'
        },
        { 
            icon: IconTags, 
            title: 'Account Categories',
            description: 'Client segmentation types.',
            count: accountCategories.length, 
            link: '/management/ac'
        },
        { 
            icon: IconShapes, 
            title: 'Account Types',
            description: 'Core account classifications.',
            count: accountTypes.length, 
            link: '/management/at'
        },
    ], [rms, branchManagers, familyGroups, softwareVendors, accountCategories, accountTypes]);

    return (
        <>
            <PageHeader
                title="User & Group Management"
                description="Select a category to manage its data, such as users, groups, and system types."
            />

            {loading ? (
                 <div className="flex justify-center items-center h-96">
                    <IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {managementAreas.map(area => (
                        <ManagementCard key={area.link} {...area} loading={loading} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Management;
