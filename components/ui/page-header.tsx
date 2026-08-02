import * as React from "react";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
}

export function PageHeader({ title, description, className, ...props }: PageHeaderProps) {
  return (
    <div className={`mb-8 w-full ${className || ""}`} {...props}>
      <h1 className="text-display-md font-display font-bold text-ink mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-body-md text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
