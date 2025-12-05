import clsx from "clsx";

// app/admin/components/DataTable.tsx

interface DataTableProps {
  columns: string[];
  data: Record<string, string | number | boolean | null>[];
}

export default function DataTable({ columns, data }: DataTableProps) {
  return (
    <div className={clsx("overflow-x-auto", "mt-6")}>
      <table
        className={clsx(
          "w-full",
          "text-sm",
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
                  "px-4",
                  "py-3",
                  "text-gray-300",
                  "font-medium"
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
                <td key={col} className={clsx("px-4", "py-3", "text-gray-400")}>
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
