import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';

const ErrorPage = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-muted-foreground">The page you are looking for does not exist.</p>
            <Link to={ROUTES.DASHBOARD}>
                <Button>Go to dashboard</Button>
            </Link>
        </div>
    );
};

export default ErrorPage;
