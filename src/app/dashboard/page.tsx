import { MainLayout } from "@/layout/mainLayout";
import { SectionCards } from "@/components/features/shared/section-cards";
import { ChartAreaInteractive } from "@/components/features/shared/chart-area-interactive";

export default function Page() {
  // This is the main dashboard page
  return (
    <MainLayout title="Dashboard">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </MainLayout>
  );
}
