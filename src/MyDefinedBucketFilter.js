import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

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

export default MyFilter;
