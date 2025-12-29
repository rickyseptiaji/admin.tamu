import { MainLayout } from "@/layout/mainLayout";
import { SectionCards } from "../shared/section-cards";
import { ChartAreaInteractive } from "../shared/chart-area-interactive";

export default function Dashboard({ data }: { data: any }) {
  return (
    <MainLayout title="Dashboard">
      <SectionCards data={data} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </MainLayout>
  );
}
