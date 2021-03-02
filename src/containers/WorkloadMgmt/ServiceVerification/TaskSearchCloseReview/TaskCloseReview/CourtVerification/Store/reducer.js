const initialState = {
    staticData : {
        cardComments : 
            [{value:'green',label:'Not Criminal'}, {value:'red',label:'Criminal'},{value:'yellow',label:'Suspected'}]
        }
}

const reducer = (state=initialState,action) => {
    switch (action.type){
        default : return state;
    }
}

export default reducer;