"use client";
import React from "react";


interface CardContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function CardContainer({ children, className = "" }: CardContainerProps) {
    return (
        <div
            className={`
        bg-[var(--color-card)]
        border border-[var(--color-border)]
        rounded-xl
        shadow-soft
        p-2 md:p-4
        transition-theme
        ${className}
      `}
        >
            {children}
        </div>
    );
}
