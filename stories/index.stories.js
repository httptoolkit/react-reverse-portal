import React from 'react';

import { storiesOf } from '@storybook/react';

// @FIXME: Need to update this based on whichever export style is preferred
// For now it's a mixed-up hybrid which should be easy to find/replace with either option
import { html, svg } from '..';

const {
    createPortalNode: createHtmlPortalNode,
    InPortal: HtmlInPortal,
    OutPortal: HtmlOutPortal,
} = html;
const {
    createPortalNode: createSvgPortalNode,
    InPortal: SvgInPortal,
    OutPortal: SvgOutPortal,
} = svg;

const Container = (props) =>
    <div style={{ "border": "1px solid #222", "padding": "10px" }}>
        { props.children }
    </div>;

storiesOf('Portals', module)
    .add('render things in different places', () => {
        const portalNode = createHtmlPortalNode();

        return <div>
            <div>
                Portal defined here:
                <HtmlInPortal node={portalNode}>
                    Hi!
                </HtmlInPortal>
            </div>

            <div>
                Portal renders here:
                <HtmlOutPortal node={portalNode} />
            </div>
        </div>;
    })
    .add('persist DOM whilst moving', () => {
        const portalNode = createHtmlPortalNode();

        return React.createElement(() => {
            const [useOuterDiv, setDivToUse] = React.useState(false);

            return <div>
                <HtmlInPortal node={portalNode}>
                    <video src="https://media.giphy.com/media/l0HlKghz8IvrQ8TYY/giphy.mp4" controls loop />
                </HtmlInPortal>

                <button onClick={() => setDivToUse(!useOuterDiv)}>
                    Click to move the OutPortal
                </button>

                <hr/>

                <div>
                    <p>Outer OutPortal:</p>
                    { useOuterDiv === true && <HtmlOutPortal node={portalNode} /> }
                    <Container>
                        <Container>
                            <Container>
                                <p>Inner OutPortal:</p>
                                { useOuterDiv === false && <HtmlOutPortal node={portalNode} /> }
                            </Container>
                        </Container>
                    </Container>
                </div>
            </div>;
        })
    })
    .add('persist component state whilst moving', () => {
        const portalNode = createHtmlPortalNode();

        const Counter = () => {
            const [count, setCount] = React.useState(0);

            return <div>
                Count is { count }
                <button onClick={() => setCount(count + 1)}>
                    +1
                </button>
            </div>;
        };

        return React.createElement(() => {
            const [useOuterDiv, setDivToUse] = React.useState(false);

            return <div>
                <HtmlInPortal node={portalNode}>
                    <Counter />
                </HtmlInPortal>

                <button onClick={() => setDivToUse(!useOuterDiv)}>
                    Click to move the OutPortal
                </button>

                <hr/>

                <p>Outer OutPortal:</p>
                { useOuterDiv === true && <HtmlOutPortal node={portalNode} /> }
                <Container>
                    <Container>
                        <Container>
                            <p>Inner OutPortal:</p>
                            { useOuterDiv === false && <HtmlOutPortal node={portalNode} /> }
                        </Container>
                    </Container>
                </Container>
            </div>
        });
    })
    .add('can set props remotely whilst moving', () => {
        const portalNode = createHtmlPortalNode();

        const Counter = (props) => {
            const [count, setCount] = React.useState(0);

            return <div style={{ "background-color": props.bgColor }}>
                Count is { count }
                <button onClick={() => setCount(count + 1)}>
                    +1
                </button>
            </div>;
        };

        return React.createElement(() => {
            const [useOuterDiv, setDivToUse] = React.useState(false);

            return <div>
                <HtmlInPortal node={portalNode}>
                    <Counter bgColor="#faa" />
                </HtmlInPortal>

                <button onClick={() => setDivToUse(!useOuterDiv)}>
                    Click to move the OutPortal
                </button>

                <hr/>

                <p>Outer OutPortal:</p>
                { useOuterDiv === true &&
                    <HtmlOutPortal node={portalNode} bgColor="#aaf" />
                }
                <Container>
                    <Container>
                        <Container>
                            <p>Inner OutPortal:</p>
                            { useOuterDiv === false &&
                                <HtmlOutPortal node={portalNode} bgColor="#afa" />
                            }
                        </Container>
                    </Container>
                </Container>
            </div>
        });
    })
    .add('can switch between portals safely', () => {
        const portalNode1 = createHtmlPortalNode();
        const portalNode2 = createHtmlPortalNode();

        const Counter = () => {
            const [count, setCount] = React.useState(0);

            return <div>
                Count is { count }
                <button onClick={() => setCount(count + 1)}>
                    +1
                </button>
            </div>;
        };

        return React.createElement(() => {
            const [isPortalSwitched, switchPortal] = React.useState(false);

            let portalNode = isPortalSwitched ? portalNode2 : portalNode1;

            return <div>
                <HtmlInPortal node={portalNode1}>
                    <Counter />
                </HtmlInPortal>
                <HtmlInPortal node={portalNode2}>
                    <Counter />
                </HtmlInPortal>

                <button onClick={() => switchPortal(!isPortalSwitched)}>
                    Click to swap the portal shown
                </button>

                <hr/>

                <p>Inner OutPortal:</p>
                <HtmlOutPortal node={portalNode} />
            </div>
        });
    })
    .add('renders reliably, even with frequent changes and multiple portals', () => {
        const portalNode = createHtmlPortalNode();

        const Target = (p) => p.value.toString();

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
                { state
                    // What happens if you render the same portal twice?
                    ? <>
                        <HtmlOutPortal node={portalNode} value={1} />
                        <HtmlOutPortal node={portalNode} value={2} />
                    </>
                    // What happens if you switch from 2 portals to 1, to 2 to zero, at random?
                    : Math.random() > 0.5
                        ? <HtmlOutPortal node={portalNode} value={3} />
                        : null
                }
            </div>;
        }

        return <div>
            <div>
                Portal defined here:
                <HtmlInPortal node={portalNode}>
                    <Target value='unmounted' />
                </HtmlInPortal>
            </div>

            <Parent />
        </div>;
    })
    .add('works with SVGs', () => {
        const portalNode = createSvgPortalNode();

        // From https://github.com/httptoolkit/react-reverse-portal/issues/2
        return <div>
            <svg>
                <rect x={0} y={0} width={300} height={50} fill="gray"></rect>
                <rect x={0} y={50} width={300} height={50} fill="lightblue"></rect>
                <svg x={30} y={10}>
                    <SvgInPortal node={portalNode}>
                        <text alignmentBaseline="text-before-edge" dominantBaseline="hanging" fill="red">
                            test
                        </text>
                    </SvgInPortal>
                </svg>
                <svg x={30} y={70}>
                    <SvgOutPortal node={portalNode} />
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

                <svg>
                    <SvgInPortal node={portalNode}>
                        <text alignmentBaseline="text-before-edge" dominantBaseline="hanging" fill="red">
                            test
                        </text>
                    </SvgInPortal>

                    <rect x={0} y={0} width={300} height={50} fill="gray"></rect>
                    <rect x={0} y={50} width={300} height={50} fill="lightblue"></rect>

                    <svg x={30} y={10}>
                        { inFirstSvg && <SvgOutPortal node={portalNode} /> }
                    </svg>
                    <svg x={30} y={70}>
                        { !inFirstSvg && <SvgOutPortal node={portalNode} /> }
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

                <div>
                    <svg width={600} height={800}>
                        <SvgInPortal node={portalNode}>
                            <foreignObject width="500" height="400">
                                <video src="https://media.giphy.com/media/l0HlKghz8IvrQ8TYY/giphy.mp4" controls loop />
                            </foreignObject>
                        </SvgInPortal>

                        <rect x={0} y={0} width={600} height={400} fill="gray"></rect>
                        <rect x={0} y={400} width={600} height={400} fill="lightblue"></rect>

                        <svg x={30} y={10}>
                            { inFirstSvg && <SvgOutPortal node={portalNode} /> }
                        </svg>
                        <svg x={30} y={410}>
                            { !inFirstSvg && <SvgOutPortal node={portalNode} /> }
                        </svg>
                    </svg>
                </div>
            </div>
        })
    })
    .add('Example from README', () => {
        const MyExpensiveComponent = () => 'expensive!';

        const MyComponent = (props) => {
            const portalNode = React.useMemo(() => createHtmlPortalNode(), []);

            return <div>
                {/*
                    Create the content that you want to move around.
                    InPortals render as normal, but to detached DOM.
                    Until this is used MyExpensiveComponent will not
                    appear anywhere in the page.
                */}
                <HtmlInPortal node={portalNode}>
                    <MyExpensiveComponent
                        // Optionally provide props to use before this enters the DOM
                        myProp={"defaultValue"}
                    />
                </HtmlInPortal>

                {/* ... The rest of your UI ... */}

                {/* Pass the node to whoever might want to show it: */}
                { props.componentToShow === 'component-a'
                    ? <ComponentA portalNode={portalNode} />
                    : <ComponentB portalNode={portalNode} /> }
            </div>;
        }

        const ComponentA = (props) => {
            return <div>
                {/* ... Some more UI ... */}

                A:

                <HtmlOutPortal
                    node={props.portalNode} // Show the content from this node here
                />
            </div>;
        }

        const ComponentB = (props) => {
            return <div>
                {/* ... Some more UI ... */}

                B:

                <HtmlOutPortal
                    node={props.portalNode} // Pull in the content from this node

                    myProp={"newValue"}     // Optionally, override default values
                    myOtherProp={123}       // Or add new props

                    // These props go back to the InPortal, and trigger a component
                    // update (but on the same component instance) as if they had
                    // been passed directly.
                />
            </div>;
        }

        return <MyComponent componentToShow='component-a' />
    });
