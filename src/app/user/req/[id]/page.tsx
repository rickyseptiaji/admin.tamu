import ReqUserPage from "@/components/features/user/req/page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReqUserPage userId={id} />;
}
