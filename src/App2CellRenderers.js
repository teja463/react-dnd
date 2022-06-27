import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const CountComp = p => {
  const count = useRef(1);
  return (
    <>
      <span>{count.current++} {p.value}</span>
    </>
  )
}

const SimpleComp = p => {
  return (
  <div>
    <button>{p.label}</button>
    {p.value}
  </div>
  )
}

export default function App() {
  
  const [rowData, setRowData] = useState();

  const [columnDefs, setColumnDefs] = useState([
    { field: 'athlete', 
      cellRenderer: SimpleComp,
      cellRendererParams:{
        label: 'Name'
      }
    },
    { field: 'age',
      cellRenderer: SimpleComp,
      cellRendererParams:{
        label: 'Age'
      }
    },
    { field: 'country', 
      cellRenderer: memo(CountComp) 
    },
    { field: 'year'},
    { field: 'date' },
    { field: 'sport'},
    { field: 'gold' },
    { field: 'silver'},
    { field: 'bronze' },
    { field: 'total'},
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true
  }), [])
  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(result => result.json())
    .then(r => setRowData(r));
  }, [])
  return (
    <div className="ag-theme-alpine" style={{height: 500, width: 1000}}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}
