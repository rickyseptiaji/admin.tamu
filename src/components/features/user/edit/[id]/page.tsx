import { MainLayout } from "@/layout/mainLayout";
import EditUserForm from "./form";

export default function EditUserPage({userId}: {userId: string}) {
  return (
    <MainLayout title="Edit user">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto">
          <EditUserForm userId={userId}/>
        </div>
      </div>
    </MainLayout>
  );
}
