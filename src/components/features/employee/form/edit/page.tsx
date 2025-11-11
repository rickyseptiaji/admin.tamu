import { MainLayout } from "@/layout/mainLayout";
import EditEmployeeForm from "./edit-employee-form";

export default function EditPageEmployee({employeeId}: {employeeId: string}) {
    return (
        <MainLayout title="Edit Employee">
            <div className="flex items-center justify-center">
            <div className="w-full max-x-md px-4 mx-auto">
                <EditEmployeeForm employeeId={employeeId}/>
            </div>
            </div>
        </MainLayout>
    )
}