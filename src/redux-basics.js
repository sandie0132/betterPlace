const redux = require('redux') ; 
const createstore = redux.createStore ; 

const initialState = {
    counter : 0 
}

//Reducer               As reducer is strongly attached to store so we need to pass it to this create function
const rootReducer = (state = initialState,action) => {      // This will be initialised when reducer is called first 
                                                            // time i.e state is undefined . 
    if(action.type === 'INC_COUNTER' ){
    
    // Dont do  state.counter++ because this is not immutable, you're mutating the state
        /* 
    So what you instead do is you return a new javascript object where you may first copy the old state
    with the spread operator, state and then overwrite the one property you want to adjust,
    so the counter and if that also would be a javascript object, you would have to copy it first too
    so that you never */
        return {
            ...state,
            counter : state.counter + 1 
        }
    }
        else if(action.type === 'ADD_COUNTER'){
            return{
                ...state ,
                counter : state.counter + action.value 
            }
        }

        
    return state ;
}

// Store 
const store = createstore(rootReducer) ;   

// Subscription
/* actually, of course typically is set up right after the store was created so that we get informed about
any future dispatches.So I notice that subscribe comes before dispatching the actions and this function in 
the subscribe method will be executed whenever action is dispatched and mutates the store. */

store.subscribe();// Now subscribe takes an argument, a function which will be executed when ever the state is updated,

// Dispatching Action 
store.dispatch({type : 'INC_COUNTER'})          // This will tell that which type of action was dispatched and
                                                // what we should do in  reducer 

store.dispatch({type : 'ADD_COUNTER', value : 10 })          // Here we need to pass a value as it's required.

