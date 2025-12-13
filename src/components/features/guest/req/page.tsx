import { MainLayout } from "@/layout/mainLayout";
import CreateReqGuestForm from "./form";

export default function ReqGuestPage({guestId}: {guestId: string}) {
    return(
            <MainLayout title="Create Req guest">
              <div className="flex items-center justify-center">
                <div className="w-full max-x-md px-4 mx-auto">
                  <CreateReqGuestForm guestId={guestId}/>
                </div>
              </div>
            </MainLayout>
    )
}