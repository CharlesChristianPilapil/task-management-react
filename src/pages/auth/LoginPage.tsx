import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { InputField, PasswordField } from '@/components/Fields';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { env } from '@/config/env';
import { LOGIN_SCHEMA, useLogin, type LoginFormValues } from '@/features/auth';

export function LoginPage() {
    const { login, isLoading } = useLogin();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LOGIN_SCHEMA),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        login(data);
    };

    return (
        <div className="flex min-h-svh items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl">Sign in</CardTitle>
                    <CardDescription>
                        Enter your credentials to access {env.appName}.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <fieldset disabled={isLoading}>
                        <CardContent className="flex flex-col gap-4">
                            <InputField
                                label="Email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                error={errors.email?.message}
                                {...register('email')}
                            />

                            <PasswordField
                                label="Password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                error={errors.password?.message}
                                {...register('password')}
                            />
                        </CardContent>

                        <CardFooter className="border-t-0 bg-transparent">
                            <Button type="submit" className="w-full">
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </CardFooter>
                    </fieldset>
                </form>
            </Card>
        </div>
    );
}
