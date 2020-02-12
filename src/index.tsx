import * as React from 'react';
import * as ReactDOM from 'react-dom';

console.log('React = ', React)
console.log('ReactDOM = ', ReactDOM)

// These namespaces come from react-dom, which does not export them publicly
// https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/shared/DOMNamespaces.js#L8-L16
const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
const MATH_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
export const Namespaces = {
    html: HTML_NAMESPACE,
    mathml: MATH_NAMESPACE,
    svg: SVG_NAMESPACE,
};

type Component<P> = React.Component<P> | React.ComponentType<P>;

type ComponentProps<C extends Component<any>> = C extends Component<infer P> ? P : never;

type PortalNodeElement = HTMLElement | SVGElement;

export interface PortalNode<C extends Component<any> = Component<any>> {
    element: PortalNodeElement,
    // Used by the out portal to send props back to the real element
    // Hooked by InPortal to become a state update (and thus rerender)
    setPortalProps(p: ComponentProps<C>): void;
    // Used to track props set before the InPortal hooks setPortalProps
    getInitialPortalProps(): ComponentProps<C>;
    // Move the node from wherever it is, to this parent, replacing the placeholder
    mount(newParent: Node, placeholder: Node): void;
    // If mounted, unmount the node and put the initial placeholder back
    // If an expected placeholder is provided, only unmount if that's still that was the
    // latest placeholder we replaced. This avoids some race conditions.
    unmount(expectedPlaceholder?: Node): void;
}

interface InPortalProps {
    node: PortalNode;
    children: React.ReactNode;
}

export const createPortalNode = <C extends Component<any>>(): PortalNode<C> => {
    let initialProps = {} as ComponentProps<C>;

    let parent: Node | undefined;
    let lastPlaceholder: Node | undefined;

    const portalNode: PortalNode = {
        // @ts-ignore
        element: null,
        // element: document.createElement('div'),
        setPortalProps: (props: ComponentProps<C>) => {
            initialProps = props;
        },
        getInitialPortalProps: () => {
            return initialProps;
        },
        mount: (newParent: PortalNodeElement, newPlaceholder: PortalNodeElement) => {
            if (newPlaceholder === lastPlaceholder) {
                // Already mounted - noop.
                return;
            }
            portalNode.unmount();

            console.log('portalNode.mount()', {
                newParent, newPlaceholder,
                parent, lastPlaceholder,
                portalNode,
            });

            if (!portalNode.element) {
                if (newParent instanceof SVGElement) {
                    portalNode.element = document.createElementNS(SVG_NAMESPACE, newParent.tagName);
                } else {
                    portalNode.element = document.createElement(newParent.tagName);
                }

                console.log('CREATED portalNode.element!!!', portalNode.element);

            } else if (newParent.tagName !== portalNode.element.tagName) {
                const oldElement = portalNode.element;

                if (newParent instanceof SVGElement) {
                    portalNode.element = document.createElementNS(SVG_NAMESPACE, newParent.tagName);
                } else {
                    portalNode.element = document.createElement(newParent.tagName);
                }

                console.log('REPLACED portalNode.element!!!', oldElement, ' -> ', portalNode.element)
            }

            newParent.replaceChild(
                portalNode.element,
                newPlaceholder
            );

            parent = newParent;
            lastPlaceholder = newPlaceholder;
        },
        unmount: (expectedPlaceholder?: Node) => {
            if (expectedPlaceholder && expectedPlaceholder !== lastPlaceholder) {
                // Skip unmounts for placeholders that aren't currently mounted
                // They will have been automatically unmounted already by a subsequent mount()
                return;
            }

            if (parent && lastPlaceholder) {
                if (portalNode.element) {
                    parent.replaceChild(
                        lastPlaceholder,
                        portalNode.element
                    );

                    parent = undefined;
                    lastPlaceholder = undefined;
                } else {
                    // Panic!
                    throw new Error('No element available, in portalNode.mount!');
                }
            }
        }
    };

    return portalNode;
};

export class InPortal extends React.PureComponent<InPortalProps, { nodeProps: {} }> {

    constructor(props: InPortalProps) {
        super(props);
        this.state = {
            nodeProps: this.props.node.getInitialPortalProps()
        };
    }

    addPropsChannel = () => {
        Object.assign(this.props.node, {
            setPortalProps: (props: {}) => {
                // Rerender the child node here if/when the out portal props change
                this.setState({ nodeProps: props });
            }
        });
    };

    componentDidMount() {
        this.addPropsChannel();
    }

    componentDidUpdate() {
        this.addPropsChannel();
    }

    render() {
        console.log('InPortal.render()', this);
        const { children, node } = this.props;
        console.log('InPortal.render()...node = ', node);
        console.log('InPortal.render()...node.element = ', node.element);

        if (!node.element) return null;

        return ReactDOM.createPortal(
            React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                return React.cloneElement(child, this.state.nodeProps)
            }),
            node.element
        );
    }
}

type OutPortalProps<C extends Component<any>> = {
    node: PortalNode<C>
} & Partial<ComponentProps<C>>;

export class OutPortal<C extends Component<any>> extends React.PureComponent<OutPortalProps<C>> {

    private placeholderNode = React.createRef<HTMLDivElement>();
    private currentPortalNode?: PortalNode<C>;

    constructor(props: OutPortalProps<C>) {
        super(props);
        this.passPropsThroughPortal();
    }

    passPropsThroughPortal() {
        const propsForTarget = Object.assign({}, this.props, { node: undefined });
        this.props.node.setPortalProps(propsForTarget);
    }

    componentDidMount() {
        const node = this.props.node as PortalNode<C>;
        this.currentPortalNode = node;

        const placeholder = this.placeholderNode.current!;
        const parent = placeholder.parentNode!;
        node.mount(parent, placeholder);
        this.passPropsThroughPortal();
    }

    componentDidUpdate() {
        // We re-mount on update, just in case we were unmounted (e.g. by
        // a second OutPortal, which has now been removed)
        const node = this.props.node as PortalNode<C>;

        // If we're switching portal nodes, we need to clean up the current one first.
        if (this.currentPortalNode && node !== this.currentPortalNode) {
            this.currentPortalNode.unmount();
            this.currentPortalNode = node;
        }

        const placeholder = this.placeholderNode.current!;
        const parent = placeholder.parentNode!;
        node.mount(parent, placeholder);
        this.passPropsThroughPortal();
    }

    componentWillUnmount() {
        const node = this.props.node as PortalNode<C>;
        node.unmount(this.placeholderNode.current!);
    }

    render() {
        console.log('OutPortal.render()', this);

        // Render a placeholder to the DOM, so we can get a reference into
        // our location in the DOM, and swap it out for the portaled node.
        return <div ref={this.placeholderNode} />;
    }

}
