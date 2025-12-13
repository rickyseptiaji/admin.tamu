"use client"
import EditUserPage from "@/components/features/user/edit/[id]/page";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams()
    return(
        <EditUserPage userId={params.id as string}/>
    )
}