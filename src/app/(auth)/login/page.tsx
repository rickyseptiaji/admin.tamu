import { AuthPage } from "@/components/features/auth/authPage";

export default function Page() {
  const data = {
    title: "Login",
    description: "Enter your email below to login to your account",
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthPage data={data} />
      </div>
    </div>  
  )
}
