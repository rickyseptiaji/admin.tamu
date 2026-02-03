import { NextResponse } from "next/server"
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase" 

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const to = searchParams.get("to")
    ? new Date(searchParams.get("to")!)
    : new Date()

  const from = searchParams.get("from")
    ? new Date(searchParams.get("from")!)
    : new Date(new Date().setDate(to.getDate() - 90))

  const q = query(
    collection(db, "visits"),
    where("createdAt", ">=", Timestamp.fromDate(from)),
    where("createdAt", "<=", Timestamp.fromDate(to)),
    orderBy("createdAt", "asc")
  )

  const snapshot = await getDocs(q)

  const map = new Map<string, number>()

  snapshot.forEach(doc => {
    const data = doc.data()
    const date = data.createdAt
      .toDate()
      .toISOString()
      .slice(0, 10)

    map.set(date, (map.get(date) ?? 0) + 1)
  })

  const result = Array.from(map.entries()).map(([date, total]) => ({
    createdAt: date,
    total,
  }))


  return NextResponse.json(result)
}
