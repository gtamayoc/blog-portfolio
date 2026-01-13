import React from 'react';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
}

export function EmptyState({
    title = "En construcción",
    message = "Esta sección estará disponible muy pronto. Estamos trabajando en ello.",
    icon
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg min-h-[200px] bg-gray-50/50 dark:bg-gray-900/50">
            {icon || (
                <span className="text-4xl mb-4" role="img" aria-label="construction">
                    🚧
                </span>
            )}
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                {message}
            </p>
        </div>
    );
}
