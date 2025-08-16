
import React from 'react';
import { IconTrash, IconAlertTriangle } from './Icons';

interface YearCalendarProps {
    year: number;
    availableDates: Set<string>;
    usedDates: Set<string>;
    onDeleteDate: (dateString: string) => void;
}

const MonthCalendar: React.FC<{
    year: number;
    month: number;
    availableDates: Set<string>;
    usedDates: Set<string>;
    onDeleteDate: (dateString: string) => void;
}> = ({ year, month, availableDates, usedDates, onDeleteDate }) => {
    
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const cells: React.ReactNode[] = [];
    
    // Empty cells for the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        cells.push(<div key={`empty-start-${i}`} className="w-8 h-8"></div>);
    }
    
    // Date cells
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(year, month, day));
        const dateString = date.toISOString().split('T')[0];
        const isAvailable = availableDates.has(dateString);
        const isUsed = usedDates.has(dateString);

        let cellClasses = "relative flex items-center justify-center w-8 h-8 rounded-full text-xs transition-all";
        let title = dateString;

        if (isUsed) {
            cellClasses += " bg-slate-500 text-white font-semibold cursor-pointer";
            title += " - This date is in use by an upload and cannot be deleted here.";
        } else if (isAvailable) {
            cellClasses += " bg-brand-blue-200 text-brand-blue-800 font-semibold cursor-pointer group hover:bg-rose-200 hover:text-rose-800";
            title += " - Available. Click to delete."
        } else {
            cellClasses += " text-slate-400";
        }

        cells.push(
            <div key={day} title={title}>
                <button
                    onClick={() => isAvailable && !isUsed && onDeleteDate(dateString)}
                    disabled={isUsed || !isAvailable}
                    className={cellClasses}
                    aria-label={title}
                >
                   <span className="group-hover:hidden">{day}</span>
                   {isAvailable && !isUsed && <IconTrash className="hidden group-hover:block h-4 w-4" />}
                   {isUsed && <div className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-500 rounded-full border border-white"></div>}
                </button>
            </div>
        );
    }
    
    return (
        <div className="p-3 bg-white border rounded-lg">
            <h4 className="font-semibold text-center text-sm mb-2">{monthName}</h4>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 font-medium">
                {days.map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-1">
                {cells}
            </div>
        </div>
    );
};

const YearCalendar: React.FC<YearCalendarProps> = ({ year, availableDates, usedDates, onDeleteDate }) => {
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
        <div className="space-y-4">
             <div className="p-3 bg-slate-100 rounded-md text-sm text-slate-600 flex items-start gap-3">
                <IconAlertTriangle className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold">Calendar Legend</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                        <li><span className="font-semibold px-2 py-0.5 rounded bg-brand-blue-200 text-brand-blue-800">Highlighted dates</span> are available week-ending dates. You can hover and click the trash icon to delete them.</li>
                        <li>Dates with a <span className="font-semibold px-2 py-0.5 rounded bg-slate-500 text-white">dark background</span> and a green dot are in use by one or more uploads. They cannot be deleted from this screen to protect data integrity.</li>
                    </ul>
                </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {months.map(month => (
                    <MonthCalendar 
                        key={month}
                        year={year}
                        month={month}
                        availableDates={availableDates}
                        usedDates={usedDates}
                        onDeleteDate={onDeleteDate}
                    />
                ))}
            </div>
        </div>
    );
};

export default YearCalendar;
