# React-Reverse-Portal

> _Part of [HTTP Toolkit](https://httptoolkit.tech): powerful tools for building, testing & debugging HTTP(S)_

![Apache 2.0 licensed](https://img.shields.io/npm/l/react-reverse-portal) ![Tiny bundle size](https://img.shields.io/bundlephobia/minzip/react-reverse-portal) [![Build status](https://github.com/httptoolkit/react-reverse-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/httptoolkit/react-reverse-portal/actions/workflows/ci.yml) [![Available on NPM](https://img.shields.io/npm/v/react-reverse-portal.svg)](https://npmjs.com/package/react-reverse-portal)

**Build an element once, move it anywhere**

Added in React 16.0, React's built-in [portals](https://reactjs.org/docs/portals.html) let you render an element in a meaningful location within your React component hierarchy, but then send the output to a DOM node elsewhere.

Reverse portals let you do the opposite: _pull_ a rendered element from elsewhere into a target location within your React tree. This allows you to reparent DOM nodes, so you can move React-rendered elements around your React tree and the DOM without re-rendering them.

Reverse portals also allow you to take a React-rendered node out of the DOM entirely, and return it later, all without rerendering the node.

(In a rush? Check out [the examples](https://httptoolkit.github.io/react-reverse-portal/))

This is useful in a few cases:

* Your react elements have internal state, and you'd like to persist that state but render the element somewhere new.
* Your DOM elements have built-in state (e.g. a playing `<video>` element), and you'd like to move the element elsewhere without losing that.
* Your elements are expensive to render, and you'd like to render them once and then place/unplace them later (e.g. a reusable pool of expensive-to-render elements that can be shared among different parts of your application).
* You want to define the contents of an element separately from where it actually appears in the tree, e.g. modals, breadcrumbs, etc (possible with normal portals, but made more flexible & declarative with reverse portals)

In [HTTP Toolkit](https://httptoolkit.tech) for example, this is used to render [Monaco Editor](https://github.com/microsoft/monaco-editor) (an expensive-to-initialize rich text editor) only once, and then quickly & easily reuse the same editor to show the body of many different HTTP requests & responses in different places, without ever having to rebuild the component, making the UI much more responsive. Check out the full diff to implement that here: [httptoolkit-ui@8456eeca7a886b2d57b2a84bb4ecf299e20c77f8](https://github.com/httptoolkit/httptoolkit-ui/commit/8456eeca7a886b2d57b2a84bb4ecf299e20c77f8).

## Features

* Reparent rendered React elements without rerendering
* Provide props at either the creation (in-portal) or usage (out-portal) locations, or both
* Supports reparenting of both HTML and SVG elements
* Single tiny file (2.5kB unminified, ungzipped) with zero dependencies
* Works with React 16+
* Written in TypeScript

## Getting Started

Install it:

```
npm install react-reverse-portal
```

Create a portal node, populate it with `InPortal`, and use it somewhere with `OutPortal`:

```js
import * as portals from 'react-reverse-portal';

const MyComponent = (props) => {
    // Create a portal node: this holds your rendered content
    const portalNode = React.useMemo(() => portals.createHtmlPortalNode(), []);

    return <div>
        {/*
            Render the content that you want to move around later.
            InPortals render as normal, but send the output to detached DOM.
            MyExpensiveComponent will be rendered immediately, but until
            portalNode is used in an OutPortal, MyExpensiveComponent, it
            will not appear anywhere on the page.
        */}
        <portals.InPortal node={portalNode}>
            <MyExpensiveComponent
                // Optionally set props to use now, before this enters the DOM
                myProp={"defaultValue"}
            />
        </portals.InPortal>

        {/* ... The rest of your UI ... */}

        {/* Later, pass the portal node around to whoever might want to use it: */}
        { props.componentToShow === 'component-a'
            ? <ComponentA portalNode={portalNode} />
            : <ComponentB portalNode={portalNode} /> }
    </div>;
}

// Later still, pull content from the portal node and show it somewhere:

const ComponentA = (props) => {
    return <div>
        {/* ... Some more UI ... */}

        {/* Show the content of the portal node here: */}
        <portals.OutPortal node={props.portalNode} />
    </div>;
}

const ComponentB = (props) => {
    return <div>
        {/* ... Some more UI ... */}

        <portals.OutPortal
            node={props.portalNode}
            myProp={"newValue"}     // Optionally, override default values
            myOtherProp={123}       // Or add new props

            // These props go back to the content of the InPortal, and trigger a
            // component render (but on the same component instance) as if they
            // had been passed to MyExpensiveComponent directly.
        />
    </div>;
}
```

**Check out [the examples](https://httptoolkit.github.io/react-reverse-portal/) to see this in action**

## What just happened?

React-reverse-portal lets you render a node once, and then place it elsewhere, without being recreated from scratch.

Normally in `ComponentA`/`ComponentB` examples like the above, switching from `ComponentA` to `ComponentB` would cause every child component to be rebuilt, due to how React's DOM diffing & reconciliation works. Here, they're not, and you can reparent however you'd like.

How does it work under the hood?

### `portals.createHtmlPortalNode([options])`

This creates a detached DOM node, with a little extra functionality attached to allow transmitting props later on.

This node will contain your portal contents later, and will eventually be attached in the target location.

An optional options object parameter can be passed to configure the node.

- `options.containerElement` (default: `div`) can be set to `'span'` to ensure valid HTML (avoid React hydration warnings) when portaling into [phrasing content](https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content).

- `options.attributes` can be used to set the HTML attributes (style, class, etc.) of the intermediary, like so:

    ```javascript
    const portalNode = portals.createHtmlPortalNode({
        attributes: { id: "div-1", style: "background-color: #aaf; width: 100px;" }
    });
    ```
    
    The detached DOM node is also available at `.element`, so you can mutate that directly with the standard DOM APIs if preferred.

### `portals.createSvgPortalNode([options])`

This creates a detached SVG DOM node. It works identically to the node from `createHtmlPortalNode`, except it will work with SVG elements. Content is placed within a `<g>` instead of a `<div>` by default, which can be customized by `options.containerElement`.

An error will be thrown if you attempt to use a HTML node for SVG content, or a SVG node for HTML content.

### `portals.InPortal`

InPortal components take a `node` prop for the portal node, along with React children that will be rendered.

It reads any extra props for the children from the live OutPortals if any (via the node itself), and then renders the children (using these extra props if available) into the detached DOM node. At this point, the children are mounted & rendered React nodes, but living entirely outside the page DOM.

All extra props are given to _all_ children of the InPortal (except strings/null). If you need to give different props to different children, create a wrapper component to do so.

### `portals.OutPortal`

OutPortal components take a `node` for the portal node, and any extra props that should be passed through to the portal children.

It extra props to the InPortal (using the extra functionality we've attached to the portal node), and when rendered it attaches the detached DOM node in its place in the DOM. More specifically: the DOM node returned by `create*PortalNode` will be attached in the place of `<portals.OutPortal>` in your React tree.

## Important notes

* Nodes should be rendered to at most one OutPortal at any time. Rendering a node in two OutPortals simultaneously will make bad things happen, rendering the node in a random one or maybe none of the OutPortals, and probably setting up React to explode later. Each portal node should only be used in one place at any time.
* Rendering to zero OutPortals is fine: the node will be rendered as normal, using just the props provided inside the InPortal definition, and will continue to happily exist but just not appear in the DOM anywhere.
* Reverse portals tie rebuilding of the contents of the portal to InPortal (where it's defined), rather than the parent of the OutPortal (where it appears in the tree). That's great (that's the whole point really), but the contents of the InPortal will still be rebuilt anytime the InPortal itself is, e.g. if the InPortal's parent is rebuilt.
* Be aware that if you call `create*PortalNode` in the render method of the parent of an InPortal, you'll get a different node to render into each time, and this will cause unnecessary rerenders, one every time the parent updates. It's generally better to create the node once and persist it, either using the useMemo hook, or in the initial construction of your class component.
* By default, the types for nodes, InPortals and OutPortals allow any props and any components. Pass a component type to them to be more explicit and enforce prop types, e.g. `createHtmlPortalNode<MyComponent>`, `<portals.InPortal<MyComponent>>`, `<portals.OutPortal<MyComponent>>`.
* iFrames currently don't work as expected and [will always reload when moved around the DOM](https://github.com/whatwg/html/issues/5484). There are no known workarounds but the issue is being investigated as part of https://github.com/whatwg/dom/issues/891

## Contributing

Like this project and want to help?
 
For starters, open source projects live on Github stars: star this repo and share the love :star:
 
### Bug reports & questions
 
Want to ask a question? Feel free; just [file an issue](https://github.com/httptoolkit/react-reverse-portal/issues/new).
 
Hitting a bug? File an issue, just make sure to include the React & ReactDOM versions you're using, the browser that's showing the issue, and a clear example so we can reproduce the problem.
 
### Feature suggestions & changes
 
Want to contribute changes directly, to add features, fix issues or document better? Great! Contributions from everybody are very welcome. If your change is small and you're pretty sure it'll be clearly wanted feel free to just open a PR directly. If you're not 100% sure, you're always welcome to open an issue and ask!

The structure in the codebase is fairly simple:
* `src/` contains the source files (which are later compiled into `dist/`). The source is written in TypeScript.
* `stories/` contains the [react storybook](https://storybook.js.org/) code, which is later compiled to & automatically published from `examples/` to https://httptoolkit.github.io/react-reverse-portal/

To actually make your changes, you just need to set up the codebase:

* `npm install`
* `npm run build` - compiles the code
* `npm test` - no tests for now, so this just checks the code compiles (it's the same as `build`). Tests welcome!
* `npm run storybook` - starts up the storybook and opens it in your browser. You'll probably need to `npm run build` first, and again later if you make changes in `src/`.

## Security contact information

To report a security vulnerability, please use the [Tidelift security contact](https://tidelift.com/security). Tidelift will coordinate the fix and disclosure.
