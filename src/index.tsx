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
}

interface InPortalProps {
    node: PortalNode;
    children: React.ReactNode;
}

export const createPortalNode = <C extends Component<any>>(): PortalNode<C> => {
    let initialProps = {} as ComponentProps<C>;
    return Object.assign(document.createElement('div'), {
        setPortalProps: (props: ComponentProps<C>) => {
            initialProps = props;
        },
        getInitialPortalProps: () => {
            return initialProps;
        }
    });
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

type OutPortalProps<C extends Component<any>> = { node: PortalNode } & Partial<ComponentProps<C>>;

export class OutPortal<C extends Component<any>> extends React.PureComponent<OutPortalProps<C>> {

    private placeholderNode = React.createRef<HTMLDivElement>();

    constructor(props: OutPortalProps<C>) {
        super(props);
        this.passPropsThroughPortal();
    }

    passPropsThroughPortal() {
        const propsForTarget = Object.assign({}, this.props, { node: undefined });
        this.props.node.setPortalProps(propsForTarget);
    }

    replacePlaceholder() {
        const placeholder = this.placeholderNode.current!;
        placeholder.parentNode!.replaceChild(
            this.props.node,
            placeholder
        );
    }

    componentDidMount() {
        this.replacePlaceholder();
        this.passPropsThroughPortal();
    }

    componentDidUpdate() {
        this.replacePlaceholder();
        this.passPropsThroughPortal();
    }

    componentWillUnmount() {
        const { node } = this.props;
        node.parentNode.replaceChild(
            this.placeholderNode.current,
            node
        );
        this.props.node.setPortalProps({});
    }

    render() {
        // Render a placeholder to the DOM, so we can get a reference into
        // our location in the DOM, and swap it out for the portaled node.
        return <div ref={this.placeholderNode} />;
    }

}