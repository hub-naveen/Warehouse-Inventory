import React from 'react';
import { cn } from "../../lib/utils";

const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={cn(
                "glass-panel p-6 text-card-foreground",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ className, children, ...props }) => {
    return (
        <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
            {children}
        </div>
    );
};

const CardTitle = ({ className, children, ...props }) => {
    return (
        <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
            {children}
        </h3>
    );
};

const CardContent = ({ className, children, ...props }) => {
    return (
        <div className={cn("", className)} {...props}>
            {children}
        </div>
    );
};

export { Card, CardHeader, CardTitle, CardContent };
