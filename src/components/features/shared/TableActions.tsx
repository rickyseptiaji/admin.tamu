"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


type TableActionsProps = {
  id: string | number
  editPath: string 
  deletePath?: string
}

export const TableActions = ({ id, editPath, deletePath }: TableActionsProps) => {
  const router = useRouter()

  const handleEdit = () => router.push(`${editPath}/${id}`)
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this item?")) {
      fetch(`/api${deletePath}/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          router.refresh()
        })
        .catch((error) => {
          console.error("Failed to delete item:", error)
        })
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={handleEdit}>Edit</Button>
      <Button size="sm" variant="destructive" onClick={handleDelete}>Delete</Button>
    </div>
  )
}
