import { AuthPage } from "@/components/authPage";


export default function Page() {
  const data = {
    title: "Register",
    description: "Enter your email below to create a new account",
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthPage data={data}/>
      </div>
    </div>  
  )
}
