import { MainLayout } from "@/layout/mainLayout";
import CreateGuestForm from "./form";

export default function CreatePageGuest() {
  return (
    <MainLayout title="Create Guest">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto">
          <CreateGuestForm />
        </div>
      </div>
    </MainLayout>
  );
}
