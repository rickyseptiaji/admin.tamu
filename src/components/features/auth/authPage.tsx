import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login/loginForm";
import { RegisterForm } from "./register/registerForm";

interface AuthPageProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    title: string;
    description: string;
  };
}

export function AuthPage({ data, className, ...props }: AuthPageProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {data.title === "Login" ? <LoginForm /> : <RegisterForm />}
        </CardContent>
      </Card>
    </div>
  );
}
