import React from 'react';

import { storiesOf } from '@storybook/react';

import { createHtmlPortalNode, createSvgPortalNode, InPortal, OutPortal } from '..';

storiesOf('SVG Portals', module)
    .add('works with SVGs', () => {
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

    })
    .add('can move content around within SVGs', () => {
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
    })
    .add('persist DOM while moving within SVGs', () => {
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
    });
