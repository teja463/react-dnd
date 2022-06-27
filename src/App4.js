import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";
import MyFilter from "./MyDefinedBucketFilter";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
// import 'ag-grid-enterprise';

export default function App() {
  const [rowData, setRowData] = useState();
  const gridRef = useRef();
  const filterModel = useRef();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
    },
    {
      field: "age",
      filter: MyFilter,
      filterParams: {
        title: "Age Filter",
        filterValues: [17, 18, 19]
      },
      floatingFilter: true
    },
    { field: "country" },
    {
      field: "year",
      filter: MyFilter,
      filterParams: {
        title: "Year Filter",
        filterValues: [2004, 2008, 2012]
      },
      floatingFilter: true
    },
    { field: "date" },
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

  function addRow(){
    const data = {"athlete":"Teja","age":99,"country":"United States","year":2008,"date":"24/08/2008","sport":"Swimming","gold":8,"silver":0,"bronze":0,"total":8};
    setRowData([...rowData, data]);
  }
  return (
    <>
      <button onClick={addRow}>Add Row</button>
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
