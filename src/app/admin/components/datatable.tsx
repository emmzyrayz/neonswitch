import clsx from "clsx";

// app/admin/components/DataTable.tsx

interface DataTableProps {
  columns: string[];
  data: Record<string, string | number | boolean | null>[];
}

export default function DataTable({ columns, data }: DataTableProps) {
  return (
    <div
      className={clsx(
        "overflow-x-auto",
        "mt-4",
        "md:mt-6",
        "-mx-4",
        "md:mx-0",
        "px-4",
        "md:px-0"
      )}
    >
      <div className={clsx("min-w-full", "inline-block", "align-middle")}>
        <table
          className={clsx(
            "w-full",
            "text-xs",
            "md:text-sm",
            "border",
            "border-white/10",
            "rounded-lg",
            "overflow-hidden"
          )}
        >
          <thead className={clsx("bg-white/5", "border-b", "border-white/10")}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className={clsx(
                    "text-left",
                    "px-3",
                    "md:px-4",
                    "py-2",
                    "md:py-3",
                    "text-gray-300",
                    "font-medium",
                    "whitespace-nowrap"
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={clsx(
                  "border-b",
                  "border-white/5",
                  "hover:bg-white/5",
                  "transition"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className={clsx(
                      "px-3",
                      "md:px-4",
                      "py-2",
                      "md:py-3",
                      "text-gray-400",
                      "whitespace-nowrap"
                    )}
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
