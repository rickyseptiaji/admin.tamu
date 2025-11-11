import { MainLayout } from "@/layout/mainLayout";
import EditDivisionForm from "./edit-division-form";

export default function EditDivisionPage({
  divisionId,
}: {
  divisionId: string;
}) {
  return (
    <MainLayout title="Edit Division">
      <div className="flex items-center justify-center">
        <div className="w-full max-x-md px-4 mx-auto">
          <EditDivisionForm divisionId={divisionId} />
        </div>
      </div>
    </MainLayout>
  );
}
