import React from 'react';

import { storiesOf } from '@storybook/react';

import { createHtmlPortalNode, InPortal, OutPortal } from '..';

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
                <InPortal node={portalNode}>
                    Hi!
                </InPortal>
            </div>

            <div>
                Portal renders here:
                <OutPortal node={portalNode} />
            </div>
        </div>;
    })
    .add('persist DOM whilst moving', () => {
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

                <hr/>

                <div>
                    <p>Outer OutPortal:</p>
                    { useOuterDiv === true && <OutPortal node={portalNode} /> }
                    <Container>
                        <Container>
                            <Container>
                                <p>Inner OutPortal:</p>
                                { useOuterDiv === false && <OutPortal node={portalNode} /> }
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
                <InPortal node={portalNode}>
                    <Counter />
                </InPortal>

                <button onClick={() => setDivToUse(!useOuterDiv)}>
                    Click to move the OutPortal
                </button>

                <hr/>

                <p>Outer OutPortal:</p>
                { useOuterDiv === true && <OutPortal node={portalNode} /> }
                <Container>
                    <Container>
                        <Container>
                            <p>Inner OutPortal:</p>
                            { useOuterDiv === false && <OutPortal node={portalNode} /> }
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
                <InPortal node={portalNode}>
                    <Counter bgColor="#faa" />
                </InPortal>

                <button onClick={() => setDivToUse(!useOuterDiv)}>
                    Click to move the OutPortal
                </button>

                <hr/>

                <p>Outer OutPortal:</p>
                { useOuterDiv === true &&
                    <OutPortal node={portalNode} bgColor="#aaf" />
                }
                <Container>
                    <Container>
                        <Container>
                            <p>Inner OutPortal:</p>
                            { useOuterDiv === false &&
                                <OutPortal node={portalNode} bgColor="#afa" />
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
                <InPortal node={portalNode1}>
                    <Counter />
                </InPortal>
                <InPortal node={portalNode2}>
                    <Counter />
                </InPortal>

                <button onClick={() => switchPortal(!isPortalSwitched)}>
                    Click to swap the portal shown
                </button>

                <hr/>

                <p>Inner OutPortal:</p>
                <OutPortal node={portalNode} />
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
                        <OutPortal node={portalNode} value={1} />
                        <OutPortal node={portalNode} value={2} />
                    </>
                    // What happens if you switch from 2 portals to 1, to 2 to zero, at random?
                    : Math.random() > 0.5
                        ? <OutPortal node={portalNode} value={3} />
                        : null
                }
            </div>;
        }

        return <div>
            <div>
                Portal defined here:
                <InPortal node={portalNode}>
                    <Target value='unmounted' />
                </InPortal>
            </div>

            <Parent />
        </div>;
    })
    .add("swap nodes between different locations", () => {
        const numberOfNodes = 5;
        const initialOrder = [];
        for (let i = 0; i < numberOfNodes; i++) {
          initialOrder[i] = i;
        }
    
        const ExampleContent = ({ content }) => String(content);
    
        const ChangeLayoutWithoutUnmounting = () => {
          const nodes = React.useMemo(
            () => initialOrder.map(createHtmlPortalNode),
            []
          );
          const [order, setOrder] = React.useState(initialOrder);
          return (
            <div>
              <button onClick={() => setOrder(order.slice().reverse())}>
                Click to reverse the order
              </button>
              {nodes.map((node, index) => (
                <InPortal node={node}>
                  <ExampleContent content={index} />
                </InPortal>
              ))}
              {order.map((position) => (
                <OutPortal node={nodes[position]} />
              ))}
            </div>
          );
        };
    
        return <ChangeLayoutWithoutUnmounting />;
    })
    .add('can pass attributes option to createHtmlPortalNode', () => {
        return React.createElement(() => {
            const [hasAttrOption, setHasAttrOption] = React.useState(false);

            const portalNode = createHtmlPortalNode( hasAttrOption ? {
                attributes: { id: "div-id-1", style: "background-color: #aaf; width: 204px;" }
            } : null);

            return <div>
                <button onClick={() => setHasAttrOption(!hasAttrOption)}>
                    Click to pass attributes option to the intermediary div
                </button>

                <hr/>

                <InPortal node={portalNode}>
                    <div style={{width: '200px', height: '50px', border: '2px solid purple'}} />
                </InPortal>

                <OutPortal node={portalNode} />

                <br/>
                <br/>
                <br/>

                <text>{!hasAttrOption ? `const portalNode = createHtmlPortalNode();` : `const portalNode = createHtmlPortalNode({ attributes: { id: "div-id-1", style: "background-color: #aaf; width: 204px;" } });`}</text>
            </div>
        });
    })
    .add('portal container element as span in paragraph', () => {
        const portalNode = createHtmlPortalNode({ containerElement: 'span' });

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
    })
    .add("portal container element as tr", () => {
        const portalNode = createHtmlPortalNode({ containerElement: "tr" });

        return React.createElement(() => {
            const [useFirstTable, setUseFirstTable] = React.useState(true);

            return (
                <div>
                <InPortal node={portalNode}>
                    <td>Cell 1</td>
                    <td>Cell 2</td>
                    <td>Cell 3</td>
                </InPortal>

                <button onClick={() => setUseFirstTable(!useFirstTable)}>
                    Move row to {useFirstTable ? "second" : "first"} table
                </button>

                <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                    <table border="1">
                    <thead>
                        <tr>
                        <th colSpan="3">First Table</th>
                        </tr>
                    </thead>
                    <tbody>{useFirstTable && <OutPortal node={portalNode} />}</tbody>
                    </table>

                    <table border="1">
                    <thead>
                        <tr>
                        <th colSpan="3">Second Table</th>
                        </tr>
                    </thead>
                    <tbody>{!useFirstTable && <OutPortal node={portalNode} />}</tbody>
                    </table>
                </div>
                </div>
            );
        });
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
                <InPortal node={portalNode}>
                    <MyExpensiveComponent
                        // Optionally provide props to use before this enters the DOM
                        myProp={"defaultValue"}
                    />
                </InPortal>

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

                <OutPortal
                    node={props.portalNode} // Show the content from this node here
                />
            </div>;
        }

        const ComponentB = (props) => {
            return <div>
                {/* ... Some more UI ... */}

                B:

                <OutPortal
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
    }).add('Events bubbling from PortalOut', () => {
        const MyExpensiveComponent = () => <div onMouseDown={() => console.log('expensive')}>expensive!</div>;

        const MyComponent = () => {
            const portalNode = React.useMemo(() => createHtmlPortalNode(), []);

            return <div>
                {/*
                    Create the content that you want to move around.
                    InPortals render as normal, but to detached DOM.
                    Until this is used MyExpensiveComponent will not
                    appear anywhere in the page.
                */}
                <div onClick={() => alert('InPortal wrapper click event')}>
                    <InPortal node={portalNode}>
                        <MyExpensiveComponent
                            // Optionally provide props to use before this enters the DOM
                            myProp={"defaultValue"}
                        />
                    </InPortal>
                </div>

                {/* ... The rest of your UI ... */}

                {/* Pass the node to whoever might want to show it: */}
                <ComponentA portalNode={portalNode} />
            </div>;
        }

        const ComponentA = (props) => {
            return <div
                onClick={() => alert('OutPortal wrapper click event')}
                onMouseDown={() => console.log('Mouse Down')}
                onMouseEnter={() => console.log('Mouse enter')}
            >
                {/* ... Some more UI ... */}

                A:

                <OutPortal
                    node={props.portalNode} // Show the content from this node here
                />
            </div>;
        }

        return <MyComponent componentToShow='component-a' />
    });
