import React from 'react';

import { storiesOf } from '@storybook/react';

import * as portals from '..';

const Container = (props) =>
    <div style={{ "border": "1px solid #222", "padding": "10px" }}>
        { props.children }
    </div>;

storiesOf('Portals', module)
    .add('render things in different places', () => {
        const portalNode = portals.createPortalNode('span');

        return <div>
            <div>
                Portal defined here:
                <portals.InPortal node={portalNode}>
                    Hi!
                </portals.InPortal>
            </div>

            <div>
                Portal renders here:
                <portals.OutPortal node={portalNode} />
            </div>
        </div>;
    })
    .add('persist DOM whilst moving', () => {
        const portalNode = portals.createPortalNode();

        return React.createElement(() => {
            const [useOuterDiv, setDivToUse] = React.useState(false);

            return <div>
                <portals.InPortal node={portalNode}>
                    <video src="https://media.giphy.com/media/l0HlKghz8IvrQ8TYY/giphy.mp4" controls loop />
                </portals.InPortal>

                <button onClick={() => setDivToUse(!useOuterDiv)}>
                    Click to move the OutPortal
                </button>

                <hr/>

                <div>
                    <p>Outer OutPortal:</p>
                    { useOuterDiv === true && <portals.OutPortal node={portalNode} /> }
                    <Container>
                        <Container>
                            <Container>
                                <p>Inner OutPortal:</p>
                                { useOuterDiv === false && <portals.OutPortal node={portalNode} /> }
                            </Container>
                        </Container>
                    </Container>
                </div>
            </div>;
        })
    })
    .add('persist component state whilst moving', () => {
        const portalNode = portals.createPortalNode();

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
                <portals.InPortal node={portalNode}>
                    <Counter />
                </portals.InPortal>

                <button onClick={() => setDivToUse(!useOuterDiv)}>
                    Click to move the OutPortal
                </button>

                <hr/>

                <p>Outer OutPortal:</p>
                { useOuterDiv === true && <portals.OutPortal node={portalNode} /> }
                <Container>
                    <Container>
                        <Container>
                            <p>Inner OutPortal:</p>
                            { useOuterDiv === false && <portals.OutPortal node={portalNode} /> }
                        </Container>
                    </Container>
                </Container>
            </div>
        });
    })
    .add('can set props remotely whilst moving', () => {
        const portalNode = portals.createPortalNode();

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
                <portals.InPortal node={portalNode}>
                    <Counter bgColor="#faa" />
                </portals.InPortal>

                <button onClick={() => setDivToUse(!useOuterDiv)}>
                    Click to move the OutPortal
                </button>

                <hr/>

                <p>Outer OutPortal:</p>
                { useOuterDiv === true &&
                    <portals.OutPortal node={portalNode} bgColor="#aaf" />
                }
                <Container>
                    <Container>
                        <Container>
                            <p>Inner OutPortal:</p>
                            { useOuterDiv === false &&
                                <portals.OutPortal node={portalNode} bgColor="#afa" />
                            }
                        </Container>
                    </Container>
                </Container>
            </div>
        });
    })
    .add('renders reliably, even with frequent changes and multiple portals', () => {
        const portalNode = portals.createPortalNode('div');

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
                        <portals.OutPortal node={portalNode} value={1} />
                        <portals.OutPortal node={portalNode} value={2} />
                    </>
                    // What happens if you switch from 2 portals to 1, to 2 to zero, at random?
                    : Math.random() > 0.5
                        ? <portals.OutPortal node={portalNode} value={3} />
                        : null
                }
            </div>;
        }

        return <div>
            <div>
                Portal defined here:
                <portals.InPortal node={portalNode}>
                    <Target value='unmounted' />
                </portals.InPortal>
            </div>

            <Parent />
        </div>;
    })
    .add('Example from README', () => {
        const MyExpensiveComponent = () => 'expensive!';

        const MyComponent = (props) => {
            const portalNode = React.useMemo(() => portals.createPortalNode(), []);

            return <div>
                {/*
                    Create the content that you want to move around.
                    InPortals render as normal, but to detached DOM.
                    Until this is used MyExpensiveComponent will not
                    appear anywhere in the page.
                */}
                <portals.InPortal node={portalNode}>
                    <MyExpensiveComponent
                        // Optionally provide props to use before this enters the DOM
                        myProp={"defaultValue"}
                    />
                </portals.InPortal>

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

                <portals.OutPortal
                    node={props.portalNode} // Show the content from this node here
                />
            </div>;
        }

        const ComponentB = (props) => {
            return <div>
                {/* ... Some more UI ... */}

                B:

                <portals.OutPortal
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