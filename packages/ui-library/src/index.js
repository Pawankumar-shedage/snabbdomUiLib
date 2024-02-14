import {init} from "../../../node_modules/snabbdom/build/init.js";


const patch = init([]);



function createTemplate(templateFunction){
    console.log("create template:: ")
  return templateFunction;
}
  


// Function to update the state
function updateState(state){
    console.log('State updated:', state);
    return state = { ...state, count: state.count+1 };
    
};



// Lifecycle events
function onMount (callback){
  console.log("On mount called")
document.addEventListener('DOMContentLoaded',callback);
}


export  {createTemplate,updateState,onMount}