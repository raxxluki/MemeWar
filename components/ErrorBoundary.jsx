import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-white">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">We're sorry, but there was an error loading this component.</p>
          <details className="bg-black/30 p-2 rounded-md">
            <summary className="cursor-pointer font-medium">Error details</summary>
            <p className="mt-2 text-red-300">{this.state.error && this.state.error.toString()}</p>
            <pre className="mt-2 text-xs overflow-auto max-h-40 p-2 bg-black/50 rounded">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };