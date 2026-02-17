import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "@firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const q = query(collection(db, "visits"), where("guestId", "==", id));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }
    const visits = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data() as {
          employeeId?: string;
          description?: string;
          guestId?: string;
          checkIn?: Timestamp | null;
          checkOut?: Timestamp | null;
          duration?: number | null;
        };

        let employee = null;
        if (data.employeeId) {
          const employeeSnap = await getDoc(
            doc(db, "employees", data.employeeId),
          );
          if (employeeSnap.exists()) {
            employee = { id: employeeSnap.id, ...employeeSnap.data() };
          }
        }

        let guest = null;
        if (data.guestId) {
          const guestSnap = await getDoc(doc(db, "guests", data.guestId));
          if (guestSnap.exists()) {
            guest = { id: guestSnap.id, ...guestSnap.data() };
          }
        }

        return {
          id: docSnap.id,
          description: data.description,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          duration: data.duration,
          employee,
          guest,
        };
      }),
    );

    return NextResponse.json(visits, { status: 200 });
  } catch (error) {
    console.error("Error fetching visit data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const visitRef = doc(db, "visits", id);
    const updateData: any = {};
    if (body.checkIn) {
      updateData.checkIn = Timestamp.fromDate(new Date(body.checkIn));
    }
    if (body.checkOut) {
      updateData.checkOut = Timestamp.fromDate(new Date(body.checkOut));
    }
    if (body.description) {
      updateData.description = body.description;
    }
    let duration = null;
    if (updateData.checkIn && updateData.checkOut) {
      const checkInDate = updateData.checkIn.toDate();
      const checkOutDate = updateData.checkOut.toDate();
      duration = Math.floor(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60),
      );
    } else if (updateData.checkIn || updateData.checkOut) {
      const visitSnap = await getDoc(visitRef);
      if (visitSnap.exists()) {
        const existingData = visitSnap.data();
        const existingCheckIn = existingData.checkIn as Timestamp | undefined;
        const existingCheckOut = existingData.checkOut as Timestamp | undefined;
        const checkInDate = updateData.checkIn
          ? updateData.checkIn.toDate()
          : existingCheckIn
            ? existingCheckIn.toDate()
            : null;
        const checkOutDate = updateData.checkOut
          ? updateData.checkOut.toDate()
          : existingCheckOut
            ? existingCheckOut.toDate()
            : null;
        if (checkInDate && checkOutDate) {
          duration = Math.floor(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60),
          );
        }
      }
    }
    if (duration !== null) {
      updateData.duration = duration;
    }

    await updateDoc(visitRef, { ...updateData, duration });
    if (duration !== null) {
      const visitSnap = await getDoc(visitRef);
      if (!visitSnap.exists()) return;

      const guestId = visitSnap.data().guestId;

      const q = query(
        collection(db, "visits"),
        where("guestId", "==", guestId),
      );
      const snapshot = await getDocs(q);

      let totalVisits = 0;
      let totalDuration = 0;
      let totalCheckInMinute = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        totalVisits++;

        totalDuration += data.duration;

        const checkInDate = data.checkIn.toDate();
        const checkInMinute =
          checkInDate.getHours() * 60 + checkInDate.getMinutes();

        totalCheckInMinute += checkInMinute;
      });

      const featureRef = doc(db, "visitor_features", guestId);

      await setDoc(
        featureRef,
        {
          totalVisits,
          avgDuration: Math.round(totalDuration / totalVisits),
          avgCheckInMinute: Math.round(totalCheckInMinute / totalVisits),
          lastUpdated: Timestamp.now(),
          role: "guest",
        },
        { merge: true },
      );
    }

    return NextResponse.json(
      { message: "Visit updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating visit data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteDoc(doc(db, "visits", id));
    return NextResponse.json(
      { message: "Visit deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting visit:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
