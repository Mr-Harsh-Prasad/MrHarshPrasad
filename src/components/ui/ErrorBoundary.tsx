'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * ErrorBoundary - Catches JavaScript errors in child components
 * Provides a graceful fallback UI instead of crashing the whole app
 */
export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Return custom fallback if provided, otherwise default
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-accent-primary/10 via-bg-primary to-accent-tertiary/10 rounded-2xl p-8">
                    <div className="text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                            Something went wrong
                        </h3>
                        <p className="text-text-muted text-sm">
                            This component failed to load. Please refresh the page.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
