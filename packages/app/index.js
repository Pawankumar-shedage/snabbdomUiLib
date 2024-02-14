// app/index.js

import {h} from "../../node_modules/snabbdom/build/h.js"


// Get the initial count value from the h1 tag
const initialCount = parseInt(document.querySelector('h1').textContent.trim(), 10);

let state = { count: initialCount };



function createVNode(elementType, attributes,content) {

  // const children = content.map((e) => (e.text));
  const data = { attrs: attributes };
  let children;

  if (Array.isArray(content)) {
    children = content.map(e => e.content);
  } else {
    children = content;
  }

  // console.log("element text: ", children);

  return h(elementType,data,children);
}


// ---CREATE DOM ELEMENT to

function createDOMElement(vNode) {

  // console.log("vNode:",vNode)

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

  // innerHTML or textContent
  if(vNode.text)
  {
    element.textContent = vNode.text;
  }

  // Add children
  if (vNode.children) {
    vNode.children.forEach(child => {
      element.appendChild(createDOMElement(child));
    });
  }

  return element;
}


function updateState(newState) {
  // updating state of application.
  state = {...state,count:newState.count}
  render();
}


 function handleClick(){
  const newState = { ...state, count: state.count + 1 };
  // console.log("state in hadleClick",state)
  updateState(newState);
  
}


// GENERATE ELEMENTS
function generateElements() {
  const app = document.getElementById('app');
  const elements = [];

  // Looping through child nodes of app element
  app.childNodes.forEach(child => {

  // Check if the child node is an element
  if (child.nodeType === 1) {
    const elementType = child.tagName.toLowerCase();
    const content = child.textContent.trim();
    const attributes = {};

    // Extract attributes
    Array.from(child.attributes).forEach(attr => {
      attributes[attr.name] = attr.value;
    });

      // Check if it's the button element, and if so, set onclick 
      // to handleClick(Updating state)
      if (elementType === 'button') {
      attributes['onclick'] = handleClick;
    }

    // Pushing element data to elements array
    elements.push({ elementType, content, attributes });
  }
});

  // console.log('Generated elements:', elements);
  return elements;
}

// LIFECYCLE events

let mountCallbacks = [];

function onMount(callback) {
  mountCallbacks.push(callback);
}

function triggerMountCallbacks() {
  mountCallbacks.forEach(callback => {
    callback();
  });
}


// RENDER 
function render() {
  const app = document.getElementById("app");

  const elements = generateElements();

  const h1Element = elements.find(element => element.elementType === 'h1');

  if (h1Element) {
    h1Element.content = `${state.count}`;
  }

  const vNodes = elements.map(element => {
    return createVNode(element.elementType, element.attributes, element.content);
  });

  app.innerHTML = ''; // Clearing the existing elements

  vNodes.forEach(vNode => {
    const element = createDOMElement(vNode);
    app.appendChild(element);
  });

}

onMount(() => {
  console.log("Component Mounted!")
});

function initialize() {
  render(); 
  triggerMountCallbacks();
}

// Call the initialize function to start the application
initialize();