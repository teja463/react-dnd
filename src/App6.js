import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Tippy from '@tippyjs/react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function ActionsMenu(props){

  const tippyRef = useRef();
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const menu = (
    <div className='menu-container'>
      <div className="menu-item" onClick={hide}>Create</div>
      <div className="menu-item" onClick={hide}>Edit</div>
      <div className="menu-item" onClick={hide}>Delete</div>
    </div>
  )
  return (
    <Tippy
      ref={tippyRef}
      content={menu}
      visible={visible}
      onClickOutside={hide}
      allowHTML={true}
      arrow={false}
      appendTo={document.body}
      interactive={true}
      placement="right"
      // moveTransition='transform 0.1s ease-out'
    >

      <button onClick={visible? hide: show}>Actions</button>
    </Tippy>
  )
}

const frameworkComponents = {
  ActionsMenu: ActionsMenu
}

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
    {field: '',
      cellRenderer: 'ActionsMenu'
    }
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
    <div className="ag-theme-alpine" style={{height: 500, width: '100%'}}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        frameworkComponents={frameworkComponents}
      />
    </div>
  );
}
