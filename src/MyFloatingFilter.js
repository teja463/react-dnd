import React, {forwardRef, useImperativeHandle, useState, useEffect, useCallback} from 'react';
 
export default forwardRef(function(props, ref){

    const [value, setValue] = useState();

    useImperativeHandle(ref, () => {
        return {
            onParentModelChanged(parentModel){
                console.log(parentModel);
                if(parentModel){
                    setValue(parentModel.state)
                }else{
                    setValue();
                }
            },
            mytest(){
                console.log('test');
            }
        }
    });

    const setFilter = useCallback(() => {
        props.parentFilterInstance(instance => {
            instance.setFilter(2000);
        })
    }, [])

    return (<>
        <button onClick={setFilter}>Test</button>
        {value}
    </>)
});