import { Component, ErrorInfo, PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren<{ fallback: ReactNode }>;

export default class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err: Error) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo.componentStack);
  }
  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return this.props.fallback;
  }
}
