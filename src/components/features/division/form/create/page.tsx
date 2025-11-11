import { MainLayout } from "@/layout/mainLayout";
import CreateDivisionForm from "./create-division-form";

export default function CreatePageDivision() {
  return (
    <MainLayout title="Create Division">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto">
          <CreateDivisionForm />
        </div>
      </div>
    </MainLayout>
  );
}
