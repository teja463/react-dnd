import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const MyFilter = forwardRef((props, ref) => {
  const [filterState, setFilterState] = useState("off");
  useImperativeHandle(ref, () => {
    return {
      isFilterActive() {
        return filterState !== "off";
      },
      doesFilterPass(params) {
        
        const field = props.colDef.field;
        return params.data[field] == filterState;
      },
      getModel() {
        if(filterState === 'off'){
            return undefined;
        }else{
            return {
                state: filterState
            }
        }
      },
      setModel(model) {
          if(model==null){
              setFilterState('off')
          }else{
              setFilterState(model.state);
          }
      },
      getModelAsString(){
        return filterState === 'off'? '': filterState
      },
      onNewRowsLoaded(){
        console.log('new rows loaded');
      }
    };
  });

  useEffect(() => {
    props.filterChangedCallback();
  }, [filterState]);

  return (
    <>
      <div>{props.title}</div>
      <div>
        <div><button onClick={() => setFilterState("off")}>Filter Off</button></div>
        {props.filterValues.map((val) => (
          <div><button onClick={() => setFilterState(val)}>{val}</button></div>
        ))}
      </div>
    </>
  );
});

const MyMultiSelectFilter = forwardRef((props, ref) => {
  const [filterState, setFilterState] = useState("off");
  const [buckets, setBuckets] = useState([]);
  useImperativeHandle(ref, () => {
    return {
      isFilterActive() {
        return filterState !== "off";
      },
      doesFilterPass(params) {
        const field = props.colDef.field;
        return params.data[field] == filterState;
      },
      getModel() {
        if (filterState === "off") {
          return undefined;
        } else {
          return {
            state: filterState,
          };
        }
      },
      setModel(model) {
        if (model == null) {
          setFilterState("off");
        } else {
          setFilterState(model.state);
        }
      },
      getModelAsString() {
        return filterState === "off" ? "" : filterState;
      },
      onNewRowsLoaded() {
        console.log('new rows loaded');
        const allValues = [];
        props.api.forEachLeafNode((row) => {
        allValues.push(row.data[props.column.colDef.field]);
        });
        const s = new Set(allValues.filter((f) => !!f).sort());
        setBuckets([...s]);
      },
    };
  });

  useEffect(() => {
    setUpFilterData();
  }, []);

  function setUpFilterData() {
    const allValues = [];
    props.api.forEachNode((row) => {
      allValues.push(row.data[props.column.colDef.field]);
    });
    const s = new Set(allValues.filter((f) => !!f).sort());
    setBuckets([...s]);
    console.log(s);
  }

  useEffect(() => {
    props.filterChangedCallback();
  }, [filterState]);

  return (
    <>
      <div>{props.title}</div>
      <div>
        <div>
          <button onClick={() => setFilterState("off")}>Filter Off</button>
        </div>
        {buckets.map((val) => (
          <div>
            <button onClick={() => setFilterState(val)}>{val}</button>
          </div>
        ))}
      </div>
    </>
  );
});

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
      filter: MyMultiSelectFilter,
      filterParams: {
        title: "Year Filter"
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
    const data = {"athlete":"Teja","age":99,"country":"India","year":1989,"date":"24/08/2008","sport":"Swimming","gold":8,"silver":0,"bronze":0,"total":8};
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
