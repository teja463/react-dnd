import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import 'ag-grid-enterprise';


export default function App() {
  const [rowData, setRowData] = useState();
  const gridRef = useRef();
  const filterModel = useRef();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      floatingFilter: true,
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "clear", "cancel", "reset"],
      },
    },
    {
      field: "age",
      floatingFilter: true,
      filterParams: {
        debounceMs: 1000,
      },
      filter: "agNumberColumnFilter",
    },
    { field: "country", 
      floatingFilter: true,
      filter: "agSetColumnFilter"
    },
    { field: "year", 
      floatingFilter: true,
      filter: "agMultiColumnFilter"                                                                                                                                                                                                                
    },
    { field: "date", floatingFilter: true, filter: "agDateColumnFilter" },
  ]);

  const saveFilters = useCallback(() => {
    filterModel.current = gridRef.current.api.getFilterModel();
    console.log(filterModel.current);
  }, []);

  const applyFilter = useCallback(() => {
    gridRef.current.api.setFilterModel(filterModel.current);
  }, []);
  const defaultColDef = useMemo(() => ({}), []);

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json())
      .then((r) => setRowData(r));
  }, []);
  return (
    <>
      <button onClick={saveFilters}>Save Filters</button>
      <button onClick={applyFilter}>Apply Filters</button>
      <div className="ag-theme-alpine" style={{ height: 500, width: 1000 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    </>
  );
}
