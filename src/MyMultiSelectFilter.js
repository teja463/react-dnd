import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const MyFilter = forwardRef((props, ref) => {
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

export default MyFilter;
