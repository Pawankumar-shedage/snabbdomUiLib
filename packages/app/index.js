// app/index.js

import {updateState,onMount} from "../ui-library/src/index.js"

import {init} from "../../node_modules/snabbdom/build/init.js"

import {h} from "../../node_modules/snabbdom/build/h.js"


  
const patch = init([]);

const app = document.getElementById('app');


function createVNode(elementType, attributes,content) {

  // const children = content.map((e) => (e.text));
  const data = { attrs: attributes };

  console.log("element text: ",content)

  return h(elementType, attributes, `${content}`);
}

// Define template function
const vNode = (state, props) => {

  console.log("template() ", props);

  // Create a virtual node based on user input

  const virtualNodes = props.map((element)=>{

    console.log('virtual Node:', element)

    return createVNode(element.elementType,element.attributes, element.content );
  }) 

  // Concatenate all virtual nodes into a single array
  const concatenatedNodes = [].concat(...virtualNodes);

  console.log("Concatenated Nodes", concatenatedNodes);

  // Return the concatenated array of virtual nodes
  return concatenatedNodes;
}



// ---new code

function createDOMElement(vNode) {


  console.log("vNode:",vNode)

  // Check if the vNode is a text node
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  }

  // Create the element
  const element = document.createElement(vNode.sel);

  // Add attributes
  if (vNode.data && vNode.data.attrs) {
    const attrs = vNode.data.attrs;
    for (const [attrName, attrValue] of Object.entries(attrs)) {
      // Skip 'onclick' attribute
      if (attrName === 'onclick') {
        continue;
      }
      element.setAttribute(attrName, attrValue);
    }
  }

  // Attach onclick event listener if available
  if (vNode.data && vNode.data.attrs && vNode.data.attrs.onclick) {
    element.addEventListener('click', vNode.data.attrs.onclick);
  }

  // Add children
  if (vNode.children) {
    vNode.children.forEach(child => {
      element.appendChild(createDOMElement(child));
    });
  }

  return element;
}


// RENDER ONMOUNT
onMount(() => {
    console.log("Component mounted");

    // Sample state and props for testing
    const state = {
      count:8
    };

    // dom elements 
    const elements = [
        {
          elementType: 'h1', // Example: 'span', 'div', 'h1', etc.
          content: `${state.count}`,
          attributes: {  onclick: ()=>console.log('btn Click') }, // Additional attributes as needed
        },
        {
          elementType: 'h2', 
          content: `${state.count}`,
          attributes: {  onclick: ()=>console.log('btn Click') },
        },
        {
          elementType: 'h3', 
          content: `${state.count}`,
          attributes: {  onclick: ()=>console.log('btn Click') },
        }
    ];

    // Clear app container and render the user-defined element
    app.innerHTML = '';

    // Virtual Nodes
    const vNodes = vNode(state,elements);

    console.log(vNodes)

    vNodes.forEach(vNode => {
      const element = createDOMElement(vNode);
      app.appendChild(element);
    });

});