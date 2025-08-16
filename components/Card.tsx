
import React from 'react';
import clsx from 'clsx';

export interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
    noBodyPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ title, children, className, actions, noBodyPadding = false }) => (
    <div className={clsx("bg-white rounded-lg shadow border", className)}>
        {title && (
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                {actions}
            </div>
        )}
        <div className={clsx({ 'p-4': !noBodyPadding })}>
            {children}
        </div>
    </div>
);

export default Card;
