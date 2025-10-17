import * as React from 'react';
import { createSvgPortalNode, InPortal, OutPortal } from '..';

export default {
  title: 'SVG Portals',
};

export const WorksWithSVGs = () => {
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
    </div>
};

export const CanMoveContentAroundWithinSVGs = () => {
    const portalNode = createSvgPortalNode();

    return React.createElement(() => {
        const [inFirstSvg, setSvgToUse] = React.useState(false);

        return <div>
            <button onClick={() => setSvgToUse(!inFirstSvg)}>
                Click to move the OutPortal within the SVG
            </button>

            <hr/>

            <svg>
                <InPortal node={portalNode}>
                    <text alignmentBaseline="text-before-edge" dominantBaseline="hanging" fill="red">
                        test
                    </text>
                </InPortal>

                <rect x={0} y={0} width={300} height={50} fill="gray"></rect>
                <rect x={0} y={50} width={300} height={50} fill="lightblue"></rect>

                <svg x={30} y={10}>
                    { inFirstSvg && <OutPortal node={portalNode} /> }
                </svg>
                <svg x={30} y={70}>
                    { !inFirstSvg && <OutPortal node={portalNode} /> }
                </svg>
            </svg>
        </div>
    });
};

export const PersistDOMWhileMovingWithinSVGs = () => {
    const portalNode = createSvgPortalNode();

    return React.createElement(() => {
        const [inFirstSvg, setSvgToUse] = React.useState(false);

        return <div>
            <button onClick={() => setSvgToUse(!inFirstSvg)}>
                Click to move the OutPortal within the SVG
            </button>

            <hr/>

            <svg width={500} height={800}>
                <InPortal node={portalNode}>
                    <foreignObject width="480" height="360">
                        <video src="https://media.giphy.com/media/l0HlKghz8IvrQ8TYY/giphy.mp4" controls loop />
                    </foreignObject>
                </InPortal>

                <rect x={0} y={0} width={500} height={380} fill="gray"></rect>
                <rect x={0} y={380} width={500} height={380} fill="lightblue"></rect>

                <svg x={10} y={10}>
                    { inFirstSvg && <OutPortal node={portalNode} /> }
                </svg>
                <svg x={10} y={410}>
                    { !inFirstSvg && <OutPortal node={portalNode} /> }
                </svg>
            </svg>
        </div>
    })
};

export const CanPassAttributesOptionToCreateSvgPortalNode = () => {
    return React.createElement(() => {
        const [hasAttrOption, setHasAttrOption] = React.useState(false);

        const portalNode = createSvgPortalNode(
            hasAttrOption
            ? {attributes: { stroke: 'blue' }}
            : undefined
        );

        return <div>
            <button onClick={() => setHasAttrOption(!hasAttrOption)}>
                Click to pass attributes option to the intermediary svg
            </button>

            <hr/>

            <svg>
                <InPortal node={portalNode}>
                    <circle cx="50" cy="50" r="40"  fill="lightblue" />
                </InPortal>

                <svg x={30} y={10}>
                  <OutPortal node={portalNode} />
                </svg>
            </svg>

            <br/>

            <pre>{
                !hasAttrOption
                ? `const portalNode = createSvgPortalNode();`
                : `const portalNode = createSvgPortalNode({ attributes: { stroke: "blue" } });`
            }</pre>
        </div>
    });
};
