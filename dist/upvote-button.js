var UpvoteButtonComponent = (function () {
'use strict';

function tmpl(strings) {
  const template = document.createElement('template');
  template.innerHTML = strings[0];
  return template
}

const deployableTemplate = tmpl`
  <a style="display: inline-block; text-align: center; padding: 10px; color:black">
    <svg width="48px" height="33px" viewBox="0 0 48 33" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 43.2 (39069) - http://www.bohemiancoding.com/sketch -->
        <desc>Created with Sketch.</desc>
        <defs></defs>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g transform="translate(-5.000000, 0.000000)" id="Fill-1" fill="#000000">
                <path d="M44,13 C42.34,5.68 36.28,0.5 29,0.5 C23.22,0.5 18.2,3.78 15.7,8.58 C9.68,9.22 5,14.32 5,20.5 C5,27.12 10.38,33 17,33 L43,33 C48.52,33 53,28.02 53,22.5 C53,17.22 48.9,12.94 44,13 Z M33,19 L33,27 L25,27 L25,19 L19,19 L29,8.5 L39,19 L33,19 Z"></path>
            </g>
        </g>
    </svg>
    <br>
    <b>Deploy</b>
  </a>
`;

const deployingTemplate = tmpl`
  <div style="text-align: center">
    <style>
      @keyframes spin {
        100% {
          transform: rotate(360deg);
        }
      }
    </style>
    <div>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" style="animation: spin 1s linear infinite;">
        <path d="M32 16c-0.040-2.089-0.493-4.172-1.331-6.077-0.834-1.906-2.046-3.633-3.533-5.060-1.486-1.428-3.248-2.557-5.156-3.302-1.906-0.748-3.956-1.105-5.981-1.061-2.025 0.040-4.042 0.48-5.885 1.292-1.845 0.809-3.517 1.983-4.898 3.424s-2.474 3.147-3.193 4.994c-0.722 1.846-1.067 3.829-1.023 5.79 0.040 1.961 0.468 3.911 1.254 5.694 0.784 1.784 1.921 3.401 3.316 4.736 1.394 1.336 3.046 2.391 4.832 3.085 1.785 0.697 3.701 1.028 5.598 0.985 1.897-0.040 3.78-0.455 5.502-1.216 1.723-0.759 3.285-1.859 4.574-3.208 1.29-1.348 2.308-2.945 2.977-4.67 0.407-1.046 0.684-2.137 0.829-3.244 0.039 0.002 0.078 0.004 0.118 0.004 1.105 0 2-0.895 2-2 0-0.056-0.003-0.112-0.007-0.167h0.007zM28.822 21.311c-0.733 1.663-1.796 3.169-3.099 4.412s-2.844 2.225-4.508 2.868c-1.663 0.646-3.447 0.952-5.215 0.909-1.769-0.041-3.519-0.429-5.119-1.14-1.602-0.708-3.053-1.734-4.25-2.991s-2.141-2.743-2.76-4.346c-0.621-1.603-0.913-3.319-0.871-5.024 0.041-1.705 0.417-3.388 1.102-4.928 0.683-1.541 1.672-2.937 2.883-4.088s2.642-2.058 4.184-2.652c1.542-0.596 3.192-0.875 4.832-0.833 1.641 0.041 3.257 0.404 4.736 1.064 1.48 0.658 2.82 1.609 3.926 2.774s1.975 2.54 2.543 4.021c0.57 1.481 0.837 3.064 0.794 4.641h0.007c-0.005 0.055-0.007 0.11-0.007 0.167 0 1.032 0.781 1.88 1.784 1.988-0.195 1.088-0.517 2.151-0.962 3.156z"></path>
      </svg>
    </div>
    <b>Deploying</b>
  </div>
`;

class ServerlessComponent extends HTMLElement {
  constructor(opts) {
    super();

    if (!opts) {
      throw new TypeError('Options not provided')
    }

    const matches = opts.git.match(/^https:\/\/github.com\/([^/]+)\/([^/.]+)(.git)?$/);
    if (!matches) {
      throw new Error("Only Github repositories supported for now")
    }

    const name = `${matches[1]}-${matches[2]}`;
    if (matches.length === 3) {
      opts.git += ".git";
    }

    this.url = `${this.getAttribute('endpoint')}/${name}`;
    if (opts.path) {
      this.url += "/" + opts.path;
    }

    this.isDeployed = false;
    fetch(this.url, { method: 'HEAD', redirect: 'error' })
      .then(res => {
        // this.isDeployed = true

        this.initialize();
      })
      .catch(err => {
        // this.isDeployed = false

        if (location.hash === "#deploying") {
          deploying.call(this);
        } else {
          deployable.call(this, {
            git: opts.git,
            endpoint: this.getAttribute('endpoint'),
          });
        }
      });
  }

  initialize() {
    // abstract
  }
}

ServerlessComponent.tmpl = tmpl;

function deployable(opts) {
  const node = document.importNode(deployableTemplate.content, true);
  const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });
  shadowRoot.appendChild(node);
  const a = shadowRoot.querySelector('a');
  a.href = "https://deploy.components.cloud/?repository=" + encodeURIComponent(opts.git) + "&endpoint=" + encodeURIComponent(opts.endpoint);
}

function deploying() {
  const node = document.importNode(deployingTemplate.content, true);
  const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });
  shadowRoot.appendChild(node);

  const component = this;
  function poll() {
    fetch(component.url, { method: 'HEAD', redirect: 'error' })
      .then(() => {
        shadowRoot.innerHTML = '';
        location.hash = '';
        component.initialize();
      })
      .catch(() => {
        setTimeout(poll, 1000);
      });
  }
  setTimeout(poll, 1000);
}

const HANDLERS = new WeakMap();

function addHandler(node, handler) {
  const handlers = HANDLERS.get(node) || [];
  handlers.push(handler);
  HANDLERS.set(node, handlers);
}

function getHandler(node) {
  return HANDLERS.get(node)
}

function setHandler(node, handler) {
  return HANDLERS.set(node, handler)
}

function hasHandler(node) {
  return HANDLERS.has(node)
}

function* executeCallbacks(node, parent, data, component) {
  for (const handler of HANDLERS.get(node)) {
    const next = handler.update(node, data, parent, component);
    if (next) {
      yield* next;
    } else {
      console.warn('Unimplemented else');
    }
  }

  return true
}

var handlers = {
  add: addHandler,
  get: getHandler,
  set: setHandler,
  has: hasHandler,
};

const START_COMMENT          = Symbol('~{');
const END_COMMENT            = Symbol('}~');
const PREVIOUS_VALUE         = Symbol('PREVIOUS_VALUE');
const PREVIOUS_EVENT_HANDLER = Symbol('PREVIOUS_EVENT_HANDLER');
const BOOLEAN_ATTRS          = new Set(['disabled', 'checked', 'selected', 'hidden', 'readonly']);

class AttributeHandler {
  constructor(fn, name) {
    this.fn = fn;
    switch (name) {
    case 'class':
      this.name = 'className';
      break
    default:
      this.name = name;
    }
  }

  *update(node, data, _, component) {
    const value = this.fn.apply(component, data);

    if (value === undefined || value === null) {
      if (typeof node[PREVIOUS_VALUE] === 'object') {
        this.executeCallback(node, data);
      } else {
        node.removeAttribute(this.name);
      }
    } else if (typeof value === 'object') {
      this.executeCallback(node, data);
    } else {
      if (this.name in node) {
        if (node[this.name] !== value) {
          node[this.name] = value;
        }
      } else {
        if (node.getAttribute(this.name) !== value) {
          node.setAttribute(this.name, value);
        }
      }
    }

    node[PREVIOUS_VALUE] = value;
  }

  executeCallback(node, value) {
    if (node.attributeChangedCallback === undefined) {
      return
    }

    // TODO: cache observedAttributes?
    const observedAttributes = node.constructor.observedAttributes;
    if (observedAttributes !== undefined && observedAttributes.indexOf(this.name) > -1) {
      node.attributeChangedCallback(this.name, node[PREVIOUS_VALUE], value);
    }
  }
}

class BooleanAttributeHandler extends AttributeHandler {
  *update(node, data, _, component) {
    node[this.name] = Boolean(this.fn.apply(component, data));
  }
}

class EventAttributeHandler {
  constructor(attrName, fn) {
    this.attrName = attrName;
    this.eventName = attrName.slice(3);
    this.fn = fn;
  }

  *update(node, data, parent, component) {
    if (!node[PREVIOUS_EVENT_HANDLER]) {
      // const fn = component[this.fnName]
      // if (typeof fn === 'function') {
        node.addEventListener(this.eventName, e => {
          node[PREVIOUS_EVENT_HANDLER](e);
        });
      // }
      // node.setAttribute(this.attrName, '')
      node.removeAttribute(this.attrName);
    }

    // TODO: only execute if changed?
    node[PREVIOUS_EVENT_HANDLER] = this.fn.apply(component, data);
  }
}

function* updateNode(node, data, parent, component, from, to) {
  if (hasHandler(node) && !from && !to) {
    const cont = yield *executeCallbacks(node, parent, data, component);
    yield true;

    if (!cont) {
      // data unchanged, skip children
      // console.log('data unchanged, skip children')
      return
    }
  }

  if (node.childNodes.length) {
    let child = from || node.firstChild;
    let skipping = 0;
    while (child && child !== to) {
      if (child.nodeType === Node.COMMENT_NODE) {
        switch (child.textContent) {
        case '~{':
          skipping++;
          child = child.nextSibling;
          continue
        case '}~':
          skipping--;
          child = child.nextSibling;
          continue
        }
      }

      if (skipping > 0) {
        child = child.nextSibling;
        continue
      }

      yield* updateNode(child, data, node, component);

      child = child.nextSibling;
    }
  }
}

function* executeCallbacks$1(node, parent, data, component) {
  for (const handler of handlers.get(node)) {
    const next = handler.update(node, data, parent, component);
    if (next) {
      yield* next;
    } else {
      console.warn('Unimplemented else');
    }
  }

  return true
}

function importNodeWithData(node, data, component) {
  // TODO: this leads to Out of stack error (in IE)
  // if (node && node.localName === 'template' && node.dataset.griffin) {
  //   return document.createComment(node.dataset.griffin)
  // }

  const clone = document.importNode(node, false);

  for (let child = node.firstChild; child; child = child.nextSibling) {
    const newChild = importNodeWithData(child, data, component);

    clone.appendChild(newChild);

    // execute after child has been added
    if (handlers.has(child)) {
      handlers.set(newChild, handlers.get(child));
      const gen = executeCallbacks$1(newChild, clone, data, component);
      while (!gen.next().done) {}
    }
  }

  return clone
}

function parseExpression(str, argNames) {
  if (!str) {
    return null
  }

  const ix = str.indexOf('${');
  if (ix === -1) {
    return null
  }

  // whole expression is JavaScript
  if (ix === 0 && str.indexOf('${', ix + 1) === -1 && str[str.length - 1] === '}') {
    return Reflect.construct(Function, argNames.concat(`return ${str.substr(2, str.length - 3)}`))
  } else {
    return Reflect.construct(Function, argNames.concat(`return \`${str}\``))
  }
}



function insertAfter(newEl, afterEl) {
  const parent = afterEl.parentNode;
  if (parent.lastChild === afterEl) {
    parent.appendChild(newEl);
  } else {
    parent.insertBefore(newEl, afterEl.nextSibling);
  }
}

class IfHandler {
  constructor(fn, template) {
    this.fn = fn;
    this.template = template;
  }

  *update(node, data, parent, component) {
    const startComment = node[START_COMMENT] || (node[START_COMMENT] = document.createComment('~{'));
    const endComment   = node[END_COMMENT]   || (node[END_COMMENT]   = document.createComment('}~'));

    const shouldRender = this.fn.apply(component, data);
    if (!shouldRender && startComment.nextSibling === endComment) {
      // should not render, and there is nothing rendered currently, stop here
      return
    }

    let offset = 0;

    if (!startComment.parentNode) {
      insertAfter(endComment, node);
      offset = parent.childNodes.length;
      insertAfter(startComment, node);
    } else {
      for (const len = parent.childNodes.length; offset < len; ++offset) {
        if (parent.childNodes[offset] === startComment) {
          offset++;
          break
        }
      }
    }

    if (shouldRender) {
      if (startComment.nextSibling === endComment) {
        const clone = importNodeWithData(this.template.content, data, component);
        parent.insertBefore(clone, endComment);
      } else {
        let el = parent.childNodes[offset];
        while (el) {
          if (el === endComment) {
            yield* updateNode(parent, data, parent, component, parent.childNodes[offset], el);
            break
          }

          el = el.nextSibling;
        }
      }
    } else {
      // remove all between start and end
      while (startComment.nextSibling && startComment.nextSibling !== endComment) {
        parent.removeChild(startComment.nextSibling);
      }
    }
  }
}

class RepeatHandler {
  constructor(fn, template) {
    this.fn = fn;
    this.template = template;
  }

  *update(node, data, parent, component) {
    const startComment = node[START_COMMENT] || (node[START_COMMENT] = document.createComment('~{'));
    const endComment   = node[END_COMMENT]   || (node[END_COMMENT]   = document.createComment('}~'));

    let offset = 0;

    if (!startComment.parentNode) {
      insertAfter(endComment, node);
      offset = parent.childNodes.length;
      insertAfter(startComment, node);
    } else {
      for (const len = parent.childNodes.length; offset < len; ++offset) {
        if (parent.childNodes[offset] === startComment) {
          offset++;
          break
        }
      }
    }

    let dataOffset = 0;
    let array = this.fn.apply(component, data);

    // if there is already some content rendered for the repeat, update them
    if (startComment.nextSibling !== endComment) {
      if (!Array.isArray(array)) {
        // remove all between start and end
        while (startComment.nextSibling && startComment.nextSibling !== endComment) {
          parent.removeChild(startComment.nextSibling);
        }
      } else {
        // update
        const dataLastIndex = array.length - 1;
        let el = parent.childNodes[offset];
        let from = el;
        while (el) {
          if (dataOffset > dataLastIndex) {
            while (el && el !== endComment) {
              const del = el;
              el = el.nextSibling;
              parent.removeChild(del);
            }

            break
          }

          if (el === endComment || el.nodeType === Node.COMMENT_NODE && el.textContent === '~~~') {
            yield* updateNode(parent, data.concat(array[dataOffset++]), parent, component,
              from, // from
              el // to
            );
            from = el.nextSibling;
          }

          if (el === endComment) {
            break
          }

          el = el.nextSibling;
        }
      }
    }

    if (Array.isArray(array)) {
      for (let i = dataOffset, len = array.length; i < len; ++i) {
        if (i > 0) {
          parent.insertBefore(document.createComment('~~~', endComment), endComment);
        }
        const item = array[i];

        // TODO: render
        const clone = importNodeWithData(this.template.content, data.concat(item), component);
        parent.insertBefore(clone, endComment);
      }
    }
  }
}

class TextHandler {
  constructor(fn) {
    this.fn = fn;
  }

  *update(node, data, _, component) {
    const newTextContent = this.fn.apply(component, data);
    if (node.textContent !== newTextContent) {
      node.textContent = newTextContent;
    }
  }
}

class HtmlHandler {
  constructor(fn) {
    this.fn = fn;
    // required for IE12
    this.anchor = document.createComment('#');
  }

  *update(node, data, parent, component) {
    const startComment = node[START_COMMENT] || (node[START_COMMENT] = document.createComment('~{'));
    const endComment   = node[END_COMMENT]   || (node[END_COMMENT]   = document.createComment('}~'));

    let offset = 0;

    if (!startComment.parentNode) {
      insertAfter(endComment, node);
      offset = parent.childNodes.length;
      insertAfter(startComment, node);
    } else {
      for (const len = parent.childNodes.length; offset < len; ++offset) {
        if (parent.childNodes[offset] === startComment) {
          offset++;
          break
        }
      }
    }

    // TODO: implement update
    // remove all between start and end
    while (startComment.nextSibling && startComment.nextSibling !== endComment) {
      parent.removeChild(startComment.nextSibling);
    }

    const newHtmlContent = this.fn.apply(component, data);
    const tmp = document.createElement('div');
    tmp.innerHTML = newHtmlContent;

    while (tmp.firstChild) {
      parent.insertBefore(tmp.firstChild, endComment);
    }
  }
}

class WithHandler {
  constructor(fn, template) {
    this.fn = fn;
    this.template = template;
  }

  *update(node, data, parent, component) {
    const startComment = node[START_COMMENT] || (node[START_COMMENT] = document.createComment('~{'));
    const endComment   = node[END_COMMENT]   || (node[END_COMMENT]   = document.createComment('}~'));

    let offset = 0;

    if (!startComment.parentNode) {
      insertAfter(endComment, node);
      offset = parent.childNodes.length;
      insertAfter(startComment, node);
    } else {
      for (const len = parent.childNodes.length; offset < len; ++offset) {
        if (parent.childNodes[offset] === startComment) {
          offset++;
          break
        }
      }
    }

    let withValue = this.fn.apply(component, data);

    if (startComment.nextSibling === endComment) {
      const clone = importNodeWithData(this.template.content, data.concat(withValue), component);
      parent.insertBefore(clone, endComment);
    } else {
      let el = parent.childNodes[offset];
      while (el) {
        if (el === endComment) {
          yield* updateNode(parent, data.concat(withValue), parent, component, parent.childNodes[offset], el);
          break
        }

        el = el.nextSibling;
      }
    }
  }
}

function traverseElement(el, argNames) {
  for (let child = el.firstChild; child; child = child.nextSibling) {
    switch (child.nodeType) {
    case Node.ELEMENT_NODE:
      // <template>
      if (child && child.localName === 'template') {
        if (child.hasAttribute('repeat')) {
          const itemName = child.getAttribute('as') || 'item';
          const fn = parseExpression(child.getAttribute('repeat'), argNames);
          traverseElement(child.content, argNames.concat(itemName));

          const handler = new RepeatHandler(fn, child);
          addHandler(child, handler);

          child.removeAttribute('repeat');
          child.removeAttribute('as');
          child.dataset.griffin = 'repeat';
        }
        // <template if="...">
        else if (child.hasAttribute('if')) {
          const fn = parseExpression(child.getAttribute('if'), argNames);
          traverseElement(child.content, argNames);

          const handler = new IfHandler(fn, child);
          addHandler(child, handler);

          child.removeAttribute('if');
          child.dataset.griffin = 'if';
        }
        // <template with="...">
        else if (child.hasAttribute('with')) {
          const alias = child.getAttribute('as') || 'item';
          const fn = parseExpression(child.getAttribute('with'), argNames);
          traverseElement(child.content, argNames.concat(alias));

          const handler = new WithHandler(fn, child);
          addHandler(child, handler);

          child.removeAttribute('with');
          child.removeAttribute('as');
          child.dataset.griffin = 'with';
        }

        break
      }

      // allow repeat for non-template elements (IE fallback)
      // TODO: hide behind option?
      if (child && child.localName === 'optgroup') {
        // <* repeat="...">
        if (child.hasAttribute('repeat')) {
          const itemName = child.getAttribute('as') || 'item';
          const fn = parseExpression(child.getAttribute('repeat'), argNames);

          const fragment = document.createDocumentFragment();
          while (child.childNodes[0]) {
            fragment.appendChild(child.childNodes[0]);
          }
          traverseElement(fragment, argNames.concat(itemName));

          const handler = new RepeatHandler(fn, { content: fragment });
          // const comment = document.createComment('repeat')
          addHandler(child, handler);
          // child.appendChild(comment)

          child.removeAttribute('repeat');
          child.removeAttribute('as');
        }
      }

      // attributes
      for (let i = child.attributes.length - 1; i >= 0; --i) {
        const attr = child.attributes[i];

        // check if it is a event attribute (e.g. on-click)
        if (attr.name[0] === 'o' && attr.name[1] === 'n' && attr.name[2] === '-') {
          const fn = Reflect.construct(Function, argNames.concat(`return ${attr.value}`));
          const handler = new EventAttributeHandler(attr.name, fn);
          addHandler(child, handler);

          child.removeAttribute(attr.name);

          continue
        }

        const fn = parseExpression(attr.value, argNames);
        if (fn) {
          // check if its is a boolean attribute (e.g. disabled, checked, ...)
          if (BOOLEAN_ATTRS.has(attr.name)) {
            const handler = new BooleanAttributeHandler(fn, attr.name);
            addHandler(child, handler);
          } else {
            const handler = new AttributeHandler(fn, attr.name);
            addHandler(child, handler);
          }

          child.removeAttribute(attr.name);
        }
      }

      // traverse child recursively
      traverseElement(child, argNames);
      child.removeAttribute('raw');

      break
    case Node.TEXT_NODE:
      const fn = parseExpression(child.textContent, argNames);
      if (fn) {
        if (el.hasAttribute && el.hasAttribute('raw')) {
          const handler = new HtmlHandler(fn);
          el.insertBefore(handler.anchor, child);
          addHandler(handler.anchor, handler);
        } else {
          const handler = new TextHandler(fn);
          addHandler(el.childNodes.length === 1 ? el : child, handler);
        }

        child.textContent = '';
      }

      break
    default:
      continue
    }
  }
}

// TODO: to be removed
function parseTemplate(template) {
  upgrade(template);
}

function upgrade(node, opts) {
  if (node.localName === 'template') {
    node = node.content;
  }
  const rootName = opts && opts.rootName || 'locals';
  traverseElement(node, [rootName]);
}

function update(node, self, data) {
  const gen = updateNode(node, [data], undefined, self);
  while (!gen.next().done) {}
}

class UpVoteElement extends ServerlessComponent {
  constructor() {
    super({
      git: 'https://github.com/rkusa/upvote-button-fns.git',
      path: btoa(location.href),
    });
  }

  initialize() {
    this.load().catch(console.error);
  }

  async load() {
    const res = await fetch(this.url);
    this.state = await res.json();

const node = importNodeWithData(UpVoteElement.template.content, [this.state], this);
    const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(node);
  }

  async toggleVote() {
    const res = await fetch(this.url, {
      method: this.state.voted ? 'DELETE' : 'POST'
    });
    const json = await res.json();
    this.state.votes = json.votes;
    this.state.voted = !this.state.voted;
    this.rerender();
  }

  rerender() {
    update(this.shadowRoot, this, this.state);
  }

  handleClick(e) {
    this.toggleVote().catch(console.error);
  }
}

UpVoteElement.template = ServerlessComponent.tmpl`
  <style>
    :host {
      font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      padding: 10px;
    }
    a {
      cursor: pointer;
      font-size: 1.3em;
    }
    a.voted {
      font-weight: bold;
    }
  </style>

  <a class="\${locals.votes && 'voted'}" on-click="this.handleClick.bind(this)">
    <svg width="25px" viewBox="0 0 45 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <desc>Created with Sketch.</desc>
        <defs></defs>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <path d="M0,41 L8,41 L8,17 L0,17 L0,41 Z M44,19 C44.5,16.3 42.7,15 40.5,15 L27.88,15 L29.78,5.36 L29.84,4.72 C29.84,3.9 29.5,3.14 28.96,2.6 L26.84,0.5 L13.68,13.68 C12.94,14.4 12,15.4 12,16.5 L12,36.5 C12,38.7 14.3,41 16.5,41 L34.5,41 C36.16,41 37.58,39.5 38.18,38.06 L44.22,23.96 C44.4,23.5 44,23.02 44,22.5 L44,18.68 L44.48,18.66 L44,19 Z" fill="#abd692"></path>
        </g>
    </svg>
    &nbsp;\${locals.votes}
  </a>
`;

// console.log('IMPORTED', parseTemplate)
parseTemplate(UpVoteElement.template);

customElements.define('upvote-button', UpVoteElement);

return UpVoteElement;

}());
