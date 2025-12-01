import { useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import employees from "../data/assessment_data.json";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function EmployeeGrid() {
    const [filterText, setFilterText] = useState("");
    const gridRef = useRef();

    const rowData = employees.employees;

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
    }), []);

    const columnDefs = useMemo(
        () => [
            { field: "id", width: 70, sortable: true, pinned: 'left' },
            {
                field: "fullName",
                headerName: "Full Name",
                valueGetter: p => `${p.data.firstName} ${p.data.lastName}`,
                flex: 1,
                minWidth: 150,
                filter: "agTextColumnFilter"
            },
            {
                field: "email",
                width: 230,
                cellRenderer: (params) => (
                    <a
                        href={`mailto:${params.value}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        {params.value}
                    </a>
                )
            },
            { field: "department", width: 150 },
            { field: "position", width: 180 },
            { field: "location", width: 140 },
            {
                field: "salary",
                headerName: "Salary($)",
                width: 105,
                valueFormatter: (p) => `$${p.value.toLocaleString()}`,
            },
            { field: "hireDate", width: 120 },
            { field: "age", width: 100 },
            { field: "performanceRating", width: 100 },
            { field: "projectsCompleted", width: 100 },
            {
                field: "isActive",
                width: 110,
                cellRenderer: p =>
                    p.value
                        ? <span className='text-green-400 font-semibold'>Active</span>
                        : <span className='text-red-400 font-semibold'>Inactive</span>
            },
            {
                field: "skills",
                width: 350,
                cellRenderer: (p) => (
                    <div className="flex flex-wrap gap-1">
                        {p.value.map((skill, index) => (
                            <span
                                key={index}
                                className="px-2 py-[2px] text-xs rounded-md bg-blue-100 text-blue-700 border border-blue-300 my-2"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )
            },
            { field: "manager", width: 140 },
        ],
        []
    );

    const onFilterTextBoxChanged = (e) => {
        const value = e.target.value;
        setFilterText(value);

        if (value === "") {
            gridRef.current.api.setFilterModel(null);
        } else {
            gridRef.current.api.setFilterModel({
                fullName: {
                    type: "contains",
                    filter: value
                }
            });
        }
    };


    const handleExportCsv = () =>
        gridRef.current?.api.exportDataAsCsv({
            fileName: "employees.csv",
        });



    return (
        <div className="px-10">

            <h1 className="text-[27px] font-bold text-center mb-1">Frontend Dashboard with AG Grid</h1>
            <p className="text-gray-600 mb-3 text-center">
                Fetch data from a given file and implement searching, filtering, and sorting.
            </p>

            <div className="bg-[#C7C9CE] rounded-xl shadow-xl px-8 py-3 border border-[#F9FAFB] h-155">
                <div className="mb-3 flex items-center">
                    <input
                        type="text"
                        placeholder="Search employees"
                        value={filterText}
                        onChange={onFilterTextBoxChanged}
                        className="px-3 h-[37px] py-2 w-70 bg-[#F9FAFB] text-black border border-[#F9FAFB] rounded-md focus:ring-2 focus:ring-[rgba(255,255,255,0.4)] outline-none"
                    />

                    <button
                        onClick={handleExportCsv}
                        className="ml-auto px-4 py-1 bg-[#F9FAFB] h-[37px] text-black border border-[#F9FAFB] rounded-md focus:ring-2 focus:ring-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.5)] transition"
                    >
                        Export CSV
                    </button>
                </div>

                <div className="ag-theme-alpine-dark w-full h-135">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20]}
                        animateRows={true}
                    />
                </div>
            </div>
        </div>
    );
}
