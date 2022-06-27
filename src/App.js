import React, { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


export default function App() {
  
  const [rowData, setRowData] = useState([
    { make: 'Ford', model: 'Focus', price: 20000 },
    { make: 'Toyota', model: 'Celica', price: 40000 },
    { make: 'BMW', model: '4 Series', price: 50000 },
  ]);

  const [columnDefs, setColumnDefs] = useState([
    { field: 'make' },
    { field: 'model'},
    { field: 'price'},
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true
  }), [])
  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
    .then(result => result.json())
    .then(r => setRowData(r));
  }, [])
  return (
    <div className="ag-theme-alpine" style={{height: 500, width: 500}}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}
