"use client";
import { MainLayout } from "@/layout/mainLayout";
import { GuestTable } from "./components/GuestTable";


export default function GuestPage({guests}: {guests: any}) {
  return (
    <>
      <MainLayout title="Guest">
        <GuestTable guests={guests}/>
      </MainLayout>
    </>
  );
}
