import * as React from "react"

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: React.ReactNode[];
  rows: React.ReactNode[][];
  emptyState?: React.ReactNode;
}

const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(
  ({ className, columns, rows, emptyState, ...props }, ref) => {
    return (
      <div ref={ref} className={`w-full overflow-x-auto bg-card border border-hairline rounded-md ${className || ""}`} {...props}>
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="border-b border-hairline bg-canvas">
              {columns.map((col, i) => (
                <th key={i} className="font-mono text-[10.5px] font-medium leading-[1.3] tracking-[0.8px] text-muted px-4 py-3 uppercase whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  {emptyState || (
                    <div className="py-12 text-center text-body-md text-muted">
                      Tidak ada data.
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className={`font-body text-[12.5px] font-normal leading-[1.5] text-ink transition-colors hover:bg-canvas/50`}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )
  }
)
DataTable.displayName = "DataTable"

export { DataTable }
