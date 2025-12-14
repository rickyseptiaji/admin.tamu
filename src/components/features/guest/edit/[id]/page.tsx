import { MainLayout } from "@/layout/mainLayout";
import EditGuestForm from "./form";

export default function EditPageGuest({guestId}: {guestId: string}) {
  return (
    <MainLayout title="Create Guest">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto">
          <EditGuestForm guestId={guestId} />
        </div>
      </div>
    </MainLayout>
  );
}
