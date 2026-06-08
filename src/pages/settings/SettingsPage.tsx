import { ArrowLeft, Construction, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';

export function SettingsPage() {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-8">
            <Card className="w-full max-w-lg text-center">
                <CardHeader className="items-center gap-4 pb-2">
                    <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <Construction className="size-8 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Settings className="size-5" />
                            Settings
                        </CardTitle>
                        <CardDescription className="text-base">
                            This page is still under construction.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 pb-6">
                    <p className="max-w-sm text-sm text-muted-foreground">
                        We are working on account preferences, notifications, and other
                        configuration options. Check back soon for updates.
                    </p>
                    <Link to={ROUTES.DASHBOARD}>
                        <Button>
                            <ArrowLeft data-icon="inline-start" />
                            Go back to dashboard
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
