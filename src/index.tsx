import * as React from 'react';
import * as ReactDOM from 'react-dom';

// ReactDOM can handle several different namespaces, but they're not exported publicly
// https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/shared/DOMNamespaces.js#L8-L10
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

type Component<P> = React.Component<P> | React.ComponentType<P>;

type ComponentProps<C extends Component<any>> = C extends Component<infer P> ? P : never;

type PortalNodeElement = HTMLElement | SVGElement;

export interface PortalNode<C extends Component<any> = Component<any>> {
    // The dom element used for the React portal. Created on portal mount.
    element: PortalNodeElement | null,
    callbackFn: (() => void) | null,
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
        element: null,
        callbackFn: null,
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

            // To support SVG and other non-html elements, the portalNode's element needs to created with
            // the correct namespace.
            if (!portalNode.element || portalNode.element.tagName !== newParent.tagName) {
                if (newParent instanceof SVGElement) {
                    portalNode.element = document.createElementNS(SVG_NAMESPACE, newParent.tagName);
                } else {
                    portalNode.element = document.createElement(newParent.tagName);
                }
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
                parent.replaceChild(
                    lastPlaceholder,
                    portalNode.element as PortalNodeElement
                );

                parent = undefined;
                lastPlaceholder = undefined;
            }
        }
    };

    return portalNode;
};

export class InPortal extends React.PureComponent<InPortalProps, { nodeProps: {}, outPortalCallback: boolean }> {

    constructor(props: InPortalProps) {
        super(props);
        this.state = {
            nodeProps: this.props.node.getInitialPortalProps(),
            outPortalCallback: false,
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
        const { children, node } = this.props;

        if (!node.element) {
            // The OutPortal has not yet determined whether or not we're in a special namespace like SVG:
            // delay our rendering for now, and attach a callbackFn which the OutPortal can use to
            // trigger a rerender once we're ready
            node.callbackFn = () => this.setState({ outPortalCallback: true })
            return null;
        }

        return ReactDOM.createPortal(
            React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                return React.cloneElement(child, this.state.nodeProps)
            }),
            node.element as PortalNodeElement
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

        if (this.props.node.callbackFn) {
            // There's an InPortal which is waiting on this OutPortal:
            // rerender it now that the OutPortal and portalNode are ready
            this.props.node.callbackFn();
            this.props.node.callbackFn = null;
        }
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
        // Render a placeholder to the DOM, so we can get a reference into
        // our location in the DOM, and swap it out for the portaled node.
        return <div ref={this.placeholderNode} />;
    }

}
