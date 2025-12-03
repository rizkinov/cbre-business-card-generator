import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/lib/utils";

export interface CBREStyledCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  accentColor?: 'default' | 'accent-green' | 'dark-grey' | 'sage' | 'celadon';
  footerAction?: {
    label: string;
    onClick?: () => void;
  };
}

/**
 * CBREStyledCard - A card component styled according to CBRE brand guidelines
 * 
 * This component demonstrates proper theming and styling for CBRE branded components
 * using shadcn/ui components as a foundation.
 */
export function CBREStyledCard({
  title,
  description,
  children,
  className,
  headerClassName,
  footerClassName,
  accentColor = 'default',
  footerAction
}: CBREStyledCardProps) {
  const accentColorMap = {
    'default': 'border-gray-200',
    'accent-green': 'border-accent-green',
    'dark-grey': 'border-dark-grey',
    'sage': 'border-sage',
    'celadon': 'border-celadon'
  };

  return (
    <Card className={cn("flex flex-col border shadow-none rounded-none", accentColorMap[accentColor], className)}>
      <CardHeader className={headerClassName}>
        <CardTitle className="text-cbre-dark-green font-financier text-xl font-normal">{title}</CardTitle>
        {description && <CardDescription className="text-dark-grey">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow text-dark-grey">
        {children}
      </CardContent>
      {footerAction && (
        <CardFooter className={footerClassName}>
          <Button
            variant="ghost"
            size="sm"
            className="text-cbre-green p-0 hover:bg-transparent hover:text-accent-green"
            onClick={footerAction.onClick}
          >
            {footerAction.label}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 