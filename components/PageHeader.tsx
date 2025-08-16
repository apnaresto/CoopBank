import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {description && <p className="text-slate-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-4 flex-shrink-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
