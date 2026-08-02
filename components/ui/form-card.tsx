import * as React from "react"

export interface FormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

const FormCard = React.forwardRef<HTMLDivElement, FormCardProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-card border border-hairline rounded-md px-[28px] py-[28px] ${className || ""}`}
        {...props}
      >
        {(title || description) && (
          <div className="mb-6">
            {title && <h3 className="text-title-lg font-display text-ink">{title}</h3>}
            {description && <p className="font-body text-[13.5px] font-normal leading-[1.5] text-body mt-2">{description}</p>}
          </div>
        )}
        <div>{children}</div>
      </div>
    )
  }
)
FormCard.displayName = "FormCard"

export { FormCard }
