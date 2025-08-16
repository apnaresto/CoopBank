import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconCalendarDays } from './Icons';
import clsx from 'clsx';

interface WeekDatePickerProps {
    id?: string;
    availableDates: string[];
    selectedDate: string;
    onSelectDate: (date: string) => void;
    popupAlignment?: 'left' | 'right';
}

const WeekDatePicker: React.FC<WeekDatePickerProps> = ({ id = 'week-date-picker', availableDates, selectedDate, onSelectDate, popupAlignment = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Ensure the date is handled as UTC from the start
    const [currentDate, setCurrentDate] = useState(new Date(selectedDate || new Date().toISOString().split('T')[0]));
    const wrapperRef = useRef<HTMLDivElement>(null);
    const availableDatesSet = new Set(availableDates);

    useEffect(() => {
        if (selectedDate && new Date(selectedDate).toString() !== 'Invalid Date') {
            setCurrentDate(new Date(selectedDate));
        }
    }, [selectedDate]);


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            // Use UTC month functions to avoid timezone shifts
            newDate.setUTCMonth(newDate.getUTCMonth() + amount);
            return newDate;
        });
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center px-2 py-2">
                <button type="button" onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-slate-100" aria-label="Previous month">
                    <IconChevronLeft className="h-5 w-5 text-slate-500" />
                </button>
                <div className="font-semibold text-slate-700" aria-live="polite">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                </div>
                <button type="button" onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-slate-100" aria-label="Next month">
                    <IconChevronRight className="h-5 w-5 text-slate-500" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        return (
            <div className="grid grid-cols-7 text-center text-xs text-slate-500">
                {days.map(day => <div key={day} className="py-1" aria-hidden="true">{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const month = currentDate.getUTCMonth();
        const year = currentDate.getUTCFullYear();
        const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();
        const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        
        const cells = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<div key={`empty-${i}`} className="p-1" aria-hidden="true"></div>);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(Date.UTC(year, month, day));
            const dateString = date.toISOString().split('T')[0];
            const isSelectable = availableDatesSet.has(dateString);
            const isSelected = dateString === selectedDate;
            
            let cellClasses = "flex items-center justify-center h-8 w-8 rounded-full text-sm transition-colors";
            if (isSelectable) {
                cellClasses += " cursor-pointer";
                if (isSelected) {
                    cellClasses += " bg-brand-blue-600 text-white font-semibold ring-2 ring-offset-2 ring-brand-blue-500";
                } else {
                    cellClasses += " bg-brand-blue-100 text-brand-blue-700 hover:bg-brand-blue-200";
                }
            } else {
                 cellClasses += " text-slate-400 cursor-not-allowed";
            }
            
            cells.push(
                <div key={day} className="flex justify-center p-1">
                    <button
                        type="button"
                        className={cellClasses}
                        disabled={!isSelectable}
                        onClick={() => {
                            onSelectDate(dateString);
                            setIsOpen(false);
                        }}
                        aria-label={isSelectable ? `Select date ${dateString}` : `Date ${dateString} not available`}
                    >
                        {day}
                    </button>
                </div>
            );
        }
        
        return <div className="grid grid-cols-7">{cells}</div>;
    };


    return (
        <div className="relative" ref={wrapperRef}>
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-900 sr-only">Select Week Ending</label>
            <button
                id={id}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 flex items-center justify-between w-full p-2.5"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <div className="flex items-center">
                    <IconCalendarDays className="h-5 w-5 mr-3 text-slate-500" />
                    <span className="font-mono">{selectedDate || 'Select a date'}</span>
                </div>
                <IconChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div 
                    className={clsx(
                        "absolute z-10 mt-1 w-72 bg-white rounded-lg shadow-lg border border-slate-200 p-2",
                        popupAlignment === 'right' ? 'right-0' : 'left-0'
                    )}
                    role="dialog"
                    aria-label="Calendar date picker"
                >
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </div>
            )}
        </div>
    );
};

export default WeekDatePicker;
