import { MainLayout } from "@/layout/mainLayout";
import CreateEmployeeForm from "./create-employee-form";

export default function CreatePageEmployee() {
  return (
    <MainLayout title="Create Employee">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto">
          <CreateEmployeeForm />
        </div>
      </div>
    </MainLayout>
  );
}
