import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No Data Found",
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <h2 className="text-lg font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <h2 className="text-lg font-semibold">
          {emptyMessage}
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>

              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-4 text-left whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}

              <th className="px-5 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((row, index) => (

              <tr
                key={row._id || index}
                className="border-b hover:bg-slate-50 transition"
              >

                {columns.map((column) => (

                  <td
                    key={column.key}
                    className="px-5 py-4 whitespace-nowrap"
                  >

                    {column.render
                      ? column.render(row)
                      : row[column.key]}

                  </td>

                ))}

                <td className="px-5 py-4">

                  <div className="flex justify-center gap-3">

                    {onView && (

                      <button
                        onClick={() => onView(row)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                      >
                        <FaEye />
                      </button>

                    )}

                    {onEdit && (

                      <button
                        onClick={() => onEdit(row)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition"
                      >
                        <FaEdit />
                      </button>

                    )}

                    {onDelete && (

                      <button
                        onClick={() => onDelete(row)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                      >
                        <FaTrash />
                      </button>

                    )}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default DataTable;