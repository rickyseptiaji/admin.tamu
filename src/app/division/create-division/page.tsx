"use client";

import { MainLayout } from "@/layout/mainLayout";
import CreateDivisionForm from "@/components/features/division/form/create/create-division-form";

export default function CreateDivision() {
  return (
    <MainLayout title="Create Division">
      <div className="px-4">
        <div className="grid w-full max-w-sm items-center gap-3">
          <CreateDivisionForm />
        </div>
      </div>
    </MainLayout>
  );
}
