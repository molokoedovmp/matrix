import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Ошибка в компоненте:', error);
    console.error('Информация о компоненте:', errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-matrix-green mb-4">Что-то пошло не так</h1>
          <p className="mb-4 text-gray-300">Произошла ошибка при загрузке страницы.</p>
          <pre className="bg-gray-900 p-4 rounded-md text-red-400 max-w-full overflow-auto">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-matrix-green text-black rounded-md hover:bg-matrix-green/90 transition-colors"
          >
            Перезагрузить страницу
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 