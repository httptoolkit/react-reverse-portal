import{j as t}from"./index-CnoKS_tV.js";import{r as o}from"./iframe-CdqLD_Ol.js";import{a as c,I as h,O as s}from"./index-BclH8SrV.js";import"./index-BdGV8CkY.js";import"./preload-helper-PPVm8Dsz.js";const m={title:"SVG Portals"},i=()=>{const e=c();return t.jsx("div",{children:t.jsxs("svg",{children:[t.jsx("rect",{x:0,y:0,width:300,height:50,fill:"gray"}),t.jsx("rect",{x:0,y:50,width:300,height:50,fill:"lightblue"}),t.jsx("svg",{x:30,y:10,children:t.jsx(h,{node:e,children:t.jsx("text",{alignmentBaseline:"text-before-edge",dominantBaseline:"hanging",fill:"red",children:"test"})})}),t.jsx("svg",{x:30,y:70,children:t.jsx(s,{node:e})})]})})},l=()=>{const e=c();return o.createElement(()=>{const[n,r]=o.useState(!1);return t.jsxs("div",{children:[t.jsx("button",{onClick:()=>r(!n),children:"Click to move the OutPortal within the SVG"}),t.jsx("hr",{}),t.jsxs("svg",{children:[t.jsx(h,{node:e,children:t.jsx("text",{alignmentBaseline:"text-before-edge",dominantBaseline:"hanging",fill:"red",children:"test"})}),t.jsx("rect",{x:0,y:0,width:300,height:50,fill:"gray"}),t.jsx("rect",{x:0,y:50,width:300,height:50,fill:"lightblue"}),t.jsx("svg",{x:30,y:10,children:n&&t.jsx(s,{node:e})}),t.jsx("svg",{x:30,y:70,children:!n&&t.jsx(s,{node:e})})]})]})})},a=()=>{const e=c();return o.createElement(()=>{const[n,r]=o.useState(!1);return t.jsxs("div",{children:[t.jsx("button",{onClick:()=>r(!n),children:"Click to move the OutPortal within the SVG"}),t.jsx("hr",{}),t.jsxs("svg",{width:500,height:800,children:[t.jsx(h,{node:e,children:t.jsx("foreignObject",{width:"480",height:"360",children:t.jsx("video",{src:"https://media.giphy.com/media/l0HlKghz8IvrQ8TYY/giphy.mp4",controls:!0,loop:!0})})}),t.jsx("rect",{x:0,y:0,width:500,height:380,fill:"gray"}),t.jsx("rect",{x:0,y:380,width:500,height:380,fill:"lightblue"}),t.jsx("svg",{x:10,y:10,children:n&&t.jsx(s,{node:e})}),t.jsx("svg",{x:10,y:410,children:!n&&t.jsx(s,{node:e})})]})]})})},d=()=>o.createElement(()=>{const[e,n]=o.useState(!1),r=c(e?{attributes:{stroke:"blue"}}:void 0);return t.jsxs("div",{children:[t.jsx("button",{onClick:()=>n(!e),children:"Click to pass attributes option to the intermediary svg"}),t.jsx("hr",{}),t.jsxs("svg",{children:[t.jsx(h,{node:r,children:t.jsx("circle",{cx:"50",cy:"50",r:"40",fill:"lightblue"})}),t.jsx("svg",{x:30,y:10,children:t.jsx(s,{node:r})})]}),t.jsx("br",{}),t.jsx("pre",{children:e?'const portalNode = createSvgPortalNode({ attributes: { stroke: "blue" } });':"const portalNode = createSvgPortalNode();"})]})});i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const portalNode = createSvgPortalNode();

  // From https://github.com/httptoolkit/react-reverse-portal/issues/2
  return <div>
        <svg>
            <rect x={0} y={0} width={300} height={50} fill="gray"></rect>
            <rect x={0} y={50} width={300} height={50} fill="lightblue"></rect>
            <svg x={30} y={10}>
                <InPortal node={portalNode}>
                    <text alignmentBaseline="text-before-edge" dominantBaseline="hanging" fill="red">
                        test
                    </text>
                </InPortal>
            </svg>
            <svg x={30} y={70}>
                <OutPortal node={portalNode} />
            </svg>
        </svg>
    </div>;
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const portalNode = createSvgPortalNode();
  return React.createElement(() => {
    const [inFirstSvg, setSvgToUse] = React.useState(false);
    return <div>
            <button onClick={() => setSvgToUse(!inFirstSvg)}>
                Click to move the OutPortal within the SVG
            </button>

            <hr />

            <svg>
                <InPortal node={portalNode}>
                    <text alignmentBaseline="text-before-edge" dominantBaseline="hanging" fill="red">
                        test
                    </text>
                </InPortal>

                <rect x={0} y={0} width={300} height={50} fill="gray"></rect>
                <rect x={0} y={50} width={300} height={50} fill="lightblue"></rect>

                <svg x={30} y={10}>
                    {inFirstSvg && <OutPortal node={portalNode} />}
                </svg>
                <svg x={30} y={70}>
                    {!inFirstSvg && <OutPortal node={portalNode} />}
                </svg>
            </svg>
        </div>;
  });
}`,...l.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  const portalNode = createSvgPortalNode();
  return React.createElement(() => {
    const [inFirstSvg, setSvgToUse] = React.useState(false);
    return <div>
            <button onClick={() => setSvgToUse(!inFirstSvg)}>
                Click to move the OutPortal within the SVG
            </button>

            <hr />

            <svg width={500} height={800}>
                <InPortal node={portalNode}>
                    <foreignObject width="480" height="360">
                        <video src="https://media.giphy.com/media/l0HlKghz8IvrQ8TYY/giphy.mp4" controls loop />
                    </foreignObject>
                </InPortal>

                <rect x={0} y={0} width={500} height={380} fill="gray"></rect>
                <rect x={0} y={380} width={500} height={380} fill="lightblue"></rect>

                <svg x={10} y={10}>
                    {inFirstSvg && <OutPortal node={portalNode} />}
                </svg>
                <svg x={10} y={410}>
                    {!inFirstSvg && <OutPortal node={portalNode} />}
                </svg>
            </svg>
        </div>;
  });
}`,...a.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  return React.createElement(() => {
    const [hasAttrOption, setHasAttrOption] = React.useState(false);
    const portalNode = createSvgPortalNode(hasAttrOption ? {
      attributes: {
        stroke: 'blue'
      }
    } : undefined);
    return <div>
            <button onClick={() => setHasAttrOption(!hasAttrOption)}>
                Click to pass attributes option to the intermediary svg
            </button>

            <hr />

            <svg>
                <InPortal node={portalNode}>
                    <circle cx="50" cy="50" r="40" fill="lightblue" />
                </InPortal>

                <svg x={30} y={10}>
                  <OutPortal node={portalNode} />
                </svg>
            </svg>

            <br />

            <pre>{!hasAttrOption ? \`const portalNode = createSvgPortalNode();\` : \`const portalNode = createSvgPortalNode({ attributes: { stroke: "blue" } });\`}</pre>
        </div>;
  });
}`,...d.parameters?.docs?.source}}};const j=["WorksWithSVGs","CanMoveContentAroundWithinSVGs","PersistDOMWhileMovingWithinSVGs","CanPassAttributesOptionToCreateSvgPortalNode"];export{l as CanMoveContentAroundWithinSVGs,d as CanPassAttributesOptionToCreateSvgPortalNode,a as PersistDOMWhileMovingWithinSVGs,i as WorksWithSVGs,j as __namedExportsOrder,m as default};
