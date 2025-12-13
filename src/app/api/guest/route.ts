import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "@firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const snapshot = await getDocs(collection(db, "guests"));
    const data = snapshot.docs.map((q) => ({
      id: q.id,
      ...q.data(),
    }));
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "failed fetch" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, companyName } = body;
    const q = query(collection(db, "guests"), where("phone", "==", phone));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return NextResponse.json(
        {
          message: "Nomor telepon sudah terdaftar",
        },
        {
          status: 409,
        }
      );
    }
    const newDocRef = doc(collection(db, "guests"));
    const guestId = newDocRef.id;
    await setDoc(newDocRef, {
      id: guestId,
      fullName,
      email,
      phone,
      companyName,
      createdAt: serverTimestamp(),
    });
    return NextResponse.json(
      {
        message: "Berhasil menambahkan guest",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
