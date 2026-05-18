import { type ReactNode } from 'react';
import { cn } from '../utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        padding && 'p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
