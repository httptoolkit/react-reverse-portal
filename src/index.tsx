import * as React from 'react';
import * as ReactDOM from 'react-dom';

type Component<P> = React.Component<P> | React.ComponentType<P>;

type ComponentProps<C extends Component<any>> = C extends Component<infer P> ? P : never;

export interface PortalNode<C extends Component<any> = Component<any>> extends HTMLElement {
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

    const portalNode = Object.assign(document.createElement('div'), {
        setPortalProps: (props: ComponentProps<C>) => {
            initialProps = props;
        },
        getInitialPortalProps: () => {
            return initialProps;
        },
        mount: (newParent: Node, newPlaceholder: Node) => {
            if (newPlaceholder === lastPlaceholder) {
                // Already mounted - noop.
                return;
            }
            portalNode.unmount();

            newParent.replaceChild(
                portalNode,
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
                    portalNode
                );

                parent = undefined;
                lastPlaceholder = undefined;
            }
        }
    });

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
        const { children, node } = this.props;

        return ReactDOM.createPortal(
            React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                return React.cloneElement(child, this.state.nodeProps)
            }),
            node
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
        // Render a placeholder to the DOM, so we can get a reference into
        // our location in the DOM, and swap it out for the portaled node.
        return <div ref={this.placeholderNode} />;
    }

}