import{j as e}from"./index-Bs_DxCk_.js";import{r as s}from"./iframe-DTvousao.js";import{c as d,I as i,O as a}from"./index-DWgeUaR6.js";import"./index-D60OzxDW.js";import"./preload-helper-PPVm8Dsz.js";const k={title:"Portals"},c=t=>s.createElement("div",{style:{border:"1px solid #222",padding:"10px"}},t.children),h=()=>{const t=d();return e.jsxs("div",{children:[e.jsxs("div",{children:["Portal defined here:",e.jsx(i,{node:t,children:"Hi!"})]}),e.jsxs("div",{children:["Portal renders here:",e.jsx(a,{node:t})]})]})},m=()=>{const t=d();return s.createElement(()=>{const[r,o]=s.useState(!1);return e.jsxs("div",{children:[e.jsx(i,{node:t,children:e.jsx("video",{src:"https://media.giphy.com/media/l0HlKghz8IvrQ8TYY/giphy.mp4",controls:!0,loop:!0})}),e.jsx("button",{onClick:()=>o(!r),children:"Click to move the OutPortal"}),e.jsx("hr",{}),e.jsxs("div",{children:[e.jsx("p",{children:"Outer OutPortal:"}),r===!0&&e.jsx(a,{node:t}),e.jsx(c,{children:e.jsx(c,{children:e.jsxs(c,{children:[e.jsx("p",{children:"Inner OutPortal:"}),r===!1&&e.jsx(a,{node:t})]})})})]})]})})},x=()=>{const t=d(),r=()=>{const[o,n]=s.useState(0);return e.jsxs("div",{children:["Count is ",o,e.jsx("button",{onClick:()=>n(o+1),children:"+1"})]})};return s.createElement(()=>{const[o,n]=s.useState(!1);return e.jsxs("div",{children:[e.jsx(i,{node:t,children:e.jsx(r,{})}),e.jsx("button",{onClick:()=>n(!o),children:"Click to move the OutPortal"}),e.jsx("hr",{}),e.jsx("p",{children:"Outer OutPortal:"}),o===!0&&e.jsx(a,{node:t}),e.jsx(c,{children:e.jsx(c,{children:e.jsxs(c,{children:[e.jsx("p",{children:"Inner OutPortal:"}),o===!1&&e.jsx(a,{node:t})]})})})]})})},v=()=>{const t=d(),r=o=>{const[n,l]=s.useState(0);return e.jsxs("div",{style:{backgroundColor:o.bgColor},children:["Count is ",n,e.jsx("button",{onClick:()=>l(n+1),children:"+1"})]})};return s.createElement(()=>{const[o,n]=s.useState(!1);return e.jsxs("div",{children:[e.jsx(i,{node:t,children:e.jsx(r,{bgColor:"#faa"})}),e.jsx("button",{onClick:()=>n(!o),children:"Click to move the OutPortal"}),e.jsx("hr",{}),e.jsx("p",{children:"Outer OutPortal:"}),o===!0&&e.jsx(a,{node:t,bgColor:"#aaf"}),e.jsx(c,{children:e.jsx(c,{children:e.jsxs(c,{children:[e.jsx("p",{children:"Inner OutPortal:"}),o===!1&&e.jsx(a,{node:t,bgColor:"#afa"})]})})})]})})},P=()=>{const t=d(),r=d(),o=()=>{const[n,l]=s.useState(0);return e.jsxs("div",{children:["Count is ",n,e.jsx("button",{onClick:()=>l(n+1),children:"+1"})]})};return s.createElement(()=>{const[n,l]=s.useState(!1);let u=n?r:t;return e.jsxs("div",{children:[e.jsx(i,{node:t,children:e.jsx(o,{})}),e.jsx(i,{node:r,children:e.jsx(o,{})}),e.jsx("button",{onClick:()=>l(!n),children:"Click to swap the portal shown"}),e.jsx("hr",{}),e.jsx("p",{children:"Inner OutPortal:"}),e.jsx(a,{node:u})]})})},C=()=>{const t=d(),r=n=>e.jsx(e.Fragment,{children:n.value.toString()}),o=()=>{const[n,l]=s.useState(!1);return setTimeout(()=>{l(!n)},100),e.jsxs("div",{children:["Portal flickers between 2 / 3 / nothing here:",n?e.jsxs(e.Fragment,{children:[e.jsx(a,{node:t,value:1}),e.jsx(a,{node:t,value:2})]}):Math.random()>.5?e.jsx(a,{node:t,value:3}):null]})};return e.jsxs("div",{children:[e.jsxs("div",{children:["Portal defined here:",e.jsx(i,{node:t,children:e.jsx(r,{value:"unmounted"})})]}),e.jsx(o,{})]})},j=()=>{const r=[];for(let n=0;n<5;n++)r[n]=n;const o=()=>{const n=s.useMemo(()=>r.map(()=>d()),[]),[l,u]=s.useState(r);return e.jsxs("div",{children:[e.jsx("button",{onClick:()=>u(l.slice().reverse()),children:"Click to reverse the order"}),n.map((p,f)=>e.jsx(i,{node:p,children:e.jsx("span",{children:f})},f)),l.map(p=>e.jsx(a,{node:n[p]},p))]})};return e.jsx(o,{})},b=()=>s.createElement(()=>{const[t,r]=s.useState(!1),o=d(t?{attributes:{id:"div-id-1",style:"background-color: #aaf; width: 204px;"}}:void 0);return e.jsxs("div",{children:[e.jsx("button",{onClick:()=>r(!t),children:"Click to pass attributes option to the intermediary div"}),e.jsx("hr",{}),e.jsx(i,{node:o,children:e.jsx("div",{style:{width:"200px",height:"50px",border:"2px solid purple"}})}),e.jsx(a,{node:o}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("text",{children:t?'const portalNode = createHtmlPortalNode({ attributes: { id: "div-id-1", style: "background-color: #aaf; width: 204px;" } });':"const portalNode = createHtmlPortalNode();"})]})}),O=()=>{const t=d({containerElement:"span"});return e.jsxs("div",{children:[e.jsxs("p",{children:["Portal defined here:",e.jsx(i,{node:t,children:"Hi!"})]}),e.jsxs("p",{children:["Portal renders here:",e.jsx(a,{node:t})]})]})},N=()=>{const t=d({containerElement:"tr"});return s.createElement(()=>{const[r,o]=s.useState(!0);return e.jsxs("div",{children:[e.jsxs(i,{node:t,children:[e.jsx("td",{children:"Cell 1"}),e.jsx("td",{children:"Cell 2"}),e.jsx("td",{children:"Cell 3"})]}),e.jsxs("button",{onClick:()=>o(!r),children:["Move row to ",r?"second":"first"," table"]}),e.jsxs("div",{style:{display:"flex",gap:"20px",marginTop:"20px"},children:[e.jsxs("table",{border:1,children:[e.jsx("thead",{children:e.jsx("tr",{children:e.jsx("th",{colSpan:3,children:"First Table"})})}),e.jsx("tbody",{children:r&&e.jsx(a,{node:t})})]}),e.jsxs("table",{border:1,children:[e.jsx("thead",{children:e.jsx("tr",{children:e.jsx("th",{colSpan:3,children:"Second Table"})})}),e.jsx("tbody",{children:!r&&e.jsx(a,{node:t})})]})]})]})})},g=()=>{const t=l=>"expensive!",r=l=>{const u=s.useMemo(()=>d(),[]);return e.jsxs("div",{children:[e.jsx(i,{node:u,children:e.jsx(t,{myProp:"defaultValue"})}),l.componentToShow==="component-a"?e.jsx(o,{portalNode:u}):e.jsx(n,{portalNode:u})]})},o=l=>e.jsxs("div",{children:["A:",e.jsx(a,{node:l.portalNode})]}),n=l=>e.jsxs("div",{children:["B:",e.jsx(a,{node:l.portalNode,myProp:"newValue",myOtherProp:123})]});return e.jsx(r,{componentToShow:"component-a"})};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`() => {
  const portalNode = createHtmlPortalNode();
  return <div>
        <div>
            Portal defined here:
            <InPortal node={portalNode}>
                Hi!
            </InPortal>
        </div>

        <div>
            Portal renders here:
            <OutPortal node={portalNode} />
        </div>
    </div>;
}`,...h.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const portalNode = createHtmlPortalNode();
  return React.createElement(() => {
    const [useOuterDiv, setDivToUse] = React.useState(false);
    return <div>
            <InPortal node={portalNode}>
                <video src="https://media.giphy.com/media/l0HlKghz8IvrQ8TYY/giphy.mp4" controls loop />
            </InPortal>

            <button onClick={() => setDivToUse(!useOuterDiv)}>
                Click to move the OutPortal
            </button>

            <hr />

            <div>
                <p>Outer OutPortal:</p>
                {useOuterDiv === true && <OutPortal node={portalNode} />}
                <Container>
                    <Container>
                        <Container>
                            <p>Inner OutPortal:</p>
                            {useOuterDiv === false && <OutPortal node={portalNode} />}
                        </Container>
                    </Container>
                </Container>
            </div>
        </div>;
  });
}`,...m.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`() => {
  const portalNode = createHtmlPortalNode();
  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return <div>
            Count is {count}
            <button onClick={() => setCount(count + 1)}>
                +1
            </button>
        </div>;
  };
  return React.createElement(() => {
    const [useOuterDiv, setDivToUse] = React.useState(false);
    return <div>
            <InPortal node={portalNode}>
                <Counter />
            </InPortal>

            <button onClick={() => setDivToUse(!useOuterDiv)}>
                Click to move the OutPortal
            </button>

            <hr />

            <p>Outer OutPortal:</p>
            {useOuterDiv === true && <OutPortal node={portalNode} />}
            <Container>
                <Container>
                    <Container>
                        <p>Inner OutPortal:</p>
                        {useOuterDiv === false && <OutPortal node={portalNode} />}
                    </Container>
                </Container>
            </Container>
        </div>;
  });
}`,...x.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`() => {
  const portalNode = createHtmlPortalNode();
  const Counter = (props: {
    bgColor: string;
  }) => {
    const [count, setCount] = React.useState(0);
    return <div style={{
      backgroundColor: props.bgColor
    }}>
            Count is {count}
            <button onClick={() => setCount(count + 1)}>
                +1
            </button>
        </div>;
  };
  return React.createElement(() => {
    const [useOuterDiv, setDivToUse] = React.useState(false);
    return <div>
            <InPortal node={portalNode}>
                <Counter bgColor="#faa" />
            </InPortal>

            <button onClick={() => setDivToUse(!useOuterDiv)}>
                Click to move the OutPortal
            </button>

            <hr />

            <p>Outer OutPortal:</p>
            {useOuterDiv === true && <OutPortal node={portalNode} bgColor="#aaf" />}
            <Container>
                <Container>
                    <Container>
                        <p>Inner OutPortal:</p>
                        {useOuterDiv === false && <OutPortal node={portalNode} bgColor="#afa" />}
                    </Container>
                </Container>
            </Container>
        </div>;
  });
}`,...v.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`() => {
  const portalNode1 = createHtmlPortalNode();
  const portalNode2 = createHtmlPortalNode();
  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return <div>
            Count is {count}
            <button onClick={() => setCount(count + 1)}>
                +1
            </button>
        </div>;
  };
  return React.createElement(() => {
    const [isPortalSwitched, switchPortal] = React.useState(false);
    let portalNode = isPortalSwitched ? portalNode2 : portalNode1;
    return <div>
            <InPortal node={portalNode1}>
                <Counter />
            </InPortal>
            <InPortal node={portalNode2}>
                <Counter />
            </InPortal>

            <button onClick={() => switchPortal(!isPortalSwitched)}>
                Click to swap the portal shown
            </button>

            <hr />

            <p>Inner OutPortal:</p>
            <OutPortal node={portalNode} />
        </div>;
  });
}`,...P.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`() => {
  const portalNode = createHtmlPortalNode();
  const Target = (p: {
    value: string | number;
  }) => <>{p.value.toString()}</>;
  const Parent = () => {
    const [state, setState] = React.useState(false);

    // Change frequently, to hunt for race conditions. On leaving this story, this might
    // complain about calling setState after unmount - that's totally fine, we don't care.
    // There should be no other errors though.
    setTimeout(() => {
      setState(!state);
    }, 100);
    return <div>
            Portal flickers between 2 / 3 / nothing here:
            {state
      // What happens if you render the same portal twice?
      ? <>
                    <OutPortal node={portalNode} value={1} />
                    <OutPortal node={portalNode} value={2} />
                </>
      // What happens if you switch from 2 portals to 1, to 2 to zero, at random?
      : Math.random() > 0.5 ? <OutPortal node={portalNode} value={3} /> : null}
        </div>;
  };
  return <div>
        <div>
            Portal defined here:
            <InPortal node={portalNode}>
                <Target value='unmounted' />
            </InPortal>
        </div>

        <Parent />
    </div>;
}`,...C.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`() => {
  const numberOfNodes = 5;
  const initialOrder: number[] = [];
  for (let i = 0; i < numberOfNodes; i++) {
    initialOrder[i] = i;
  }
  const ChangeLayoutWithoutUnmounting = () => {
    const nodes = React.useMemo(() => initialOrder.map(() => createHtmlPortalNode()), []);
    const [order, setOrder] = React.useState(initialOrder);
    return <div>
          <button onClick={() => setOrder(order.slice().reverse())}>
            Click to reverse the order
          </button>
          {nodes.map((node, index) => <InPortal node={node} key={index}>
                <span>{index}</span>
            </InPortal>)}
          {order.map(position => <OutPortal node={nodes[position]} key={position} />)}
        </div>;
  };
  return <ChangeLayoutWithoutUnmounting />;
}`,...j.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`() => {
  return React.createElement(() => {
    const [hasAttrOption, setHasAttrOption] = React.useState(false);
    const portalNode = createHtmlPortalNode(hasAttrOption ? {
      attributes: {
        id: "div-id-1",
        style: "background-color: #aaf; width: 204px;"
      }
    } : undefined);
    return <div>
            <button onClick={() => setHasAttrOption(!hasAttrOption)}>
                Click to pass attributes option to the intermediary div
            </button>

            <hr />

            <InPortal node={portalNode}>
                <div style={{
          width: '200px',
          height: '50px',
          border: '2px solid purple'
        }} />
            </InPortal>

            <OutPortal node={portalNode} />

            <br />
            <br />
            <br />

            <text>{!hasAttrOption ? \`const portalNode = createHtmlPortalNode();\` : \`const portalNode = createHtmlPortalNode({ attributes: { id: "div-id-1", style: "background-color: #aaf; width: 204px;" } });\`}</text>
        </div>;
  });
}`,...b.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`() => {
  const portalNode = createHtmlPortalNode({
    containerElement: 'span'
  });
  return <div>
        <p>
            Portal defined here:
            <InPortal node={portalNode}>
                Hi!
            </InPortal>
        </p>

        <p>
            Portal renders here:
            <OutPortal node={portalNode} />
        </p>
    </div>;
}`,...O.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`() => {
  const portalNode = createHtmlPortalNode({
    containerElement: "tr"
  });
  return React.createElement(() => {
    const [useFirstTable, setUseFirstTable] = React.useState(true);
    return <div>
            <InPortal node={portalNode}>
                <td>Cell 1</td>
                <td>Cell 2</td>
                <td>Cell 3</td>
            </InPortal>

            <button onClick={() => setUseFirstTable(!useFirstTable)}>
                Move row to {useFirstTable ? "second" : "first"} table
            </button>

            <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px"
      }}>
                <table border={1}>
                <thead>
                    <tr>
                    <th colSpan={3}>First Table</th>
                    </tr>
                </thead>
                <tbody>{useFirstTable && <OutPortal node={portalNode} />}</tbody>
                </table>

                <table border={1}>
                <thead>
                    <tr>
                    <th colSpan={3}>Second Table</th>
                    </tr>
                </thead>
                <tbody>{!useFirstTable && <OutPortal node={portalNode} />}</tbody>
                </table>
            </div>
            </div>;
  });
}`,...N.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => {
  const MyExpensiveComponent = (props: any) => 'expensive!';
  const MyComponent = (props: {
    componentToShow: string;
  }) => {
    const portalNode = React.useMemo(() => createHtmlPortalNode(), []);
    return <div>
            {/*
                Create the content that you want to move around.
                InPortals render as normal, but to detached DOM.
                Until this is used MyExpensiveComponent will not
                appear anywhere in the page.
             */}
            <InPortal node={portalNode}>
                <MyExpensiveComponent
        // Optionally provide props to use before this enters the DOM
        myProp={"defaultValue"} />
            </InPortal>

            {/* ... The rest of your UI ... */}

            {/* Pass the node to whoever might want to show it: */}
            {props.componentToShow === 'component-a' ? <ComponentA portalNode={portalNode} /> : <ComponentB portalNode={portalNode} />}
        </div>;
  };
  const ComponentA = (props: {
    portalNode: HtmlPortalNode;
  }) => {
    return <div>
            {/* ... Some more UI ... */}

            A:

            <OutPortal node={props.portalNode} // Show the content from this node here
      />
        </div>;
  };
  const ComponentB = (props: {
    portalNode: HtmlPortalNode;
  }) => {
    return <div>
            {/* ... Some more UI ... */}

            B:

            <OutPortal node={props.portalNode} // Pull in the content from this node
      myProp={"newValue"} // Optionally, override default values
      myOtherProp={123} // Or add new props

      // These props go back to the InPortal, and trigger a component
      // update (but on the same component instance) as if they had
      // been passed directly.
      />
        </div>;
  };
  return <MyComponent componentToShow='component-a' />;
}`,...g.parameters?.docs?.source}}};const E=["RenderThingsInDifferentPlaces","PersistDOMWhilstMoving","PersistComponentStateWhilstMoving","CanSetPropsRemotelyWhilstMoving","CanSwitchBetweenPortalsSafely","RendersReliablyEvenWithFrequentChangesAndMultiplePortals","SwapNodesBetweenDifferentLocations","CanPassAttributesOptionToCreateHtmlPortalNode","PortalContainerElementAsSpanInParagraph","PortalContainerElementAsTr","ExampleFromREADME"];export{b as CanPassAttributesOptionToCreateHtmlPortalNode,v as CanSetPropsRemotelyWhilstMoving,P as CanSwitchBetweenPortalsSafely,g as ExampleFromREADME,x as PersistComponentStateWhilstMoving,m as PersistDOMWhilstMoving,O as PortalContainerElementAsSpanInParagraph,N as PortalContainerElementAsTr,h as RenderThingsInDifferentPlaces,C as RendersReliablyEvenWithFrequentChangesAndMultiplePortals,j as SwapNodesBetweenDifferentLocations,E as __namedExportsOrder,k as default};
