import { adminDB } from "@/lib/firebase-admin";
import {
  Timestamp,
  FieldValue,
} from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const snapshot = await adminDB
      .collection("visits")
      .where("guestId", "==", id)
      .get();

    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const visits = await Promise.all(
      snapshot.docs.map(async (visitDoc) => {
        const data = visitDoc.data();

        let employee = null;

        if (data.employeeId) {
          const employeeSnap = await adminDB
            .collection("employees")
            .doc(data.employeeId)
            .get();

          if (employeeSnap.exists) {
            employee = {
              id: employeeSnap.id,
              ...employeeSnap.data(),
            };
          }
        }

        let guest = null;

        if (data.guestId) {
          const guestSnap = await adminDB
            .collection("guests")
            .doc(data.guestId)
            .get();

          if (guestSnap.exists) {
            guest = {
              id: guestSnap.id,
              ...guestSnap.data(),
            };
          }
        }

        return {
          id: visitDoc.id,
          description: data.description ?? null,
          checkIn: data.checkIn ?? null,
          checkOut: data.checkOut ?? null,
          duration: data.duration ?? null,
          employee,
          guest,
        };
      })
    );

    return NextResponse.json(visits);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const visitRef = adminDB.collection("visits").doc(id);
    const updateData: Record<string, any> = {};

    if (body.checkIn) {
      updateData.checkIn = Timestamp.fromDate(
        new Date(body.checkIn)
      );
    }

    if (body.checkOut) {
      updateData.checkOut = Timestamp.fromDate(
        new Date(body.checkOut)
      );
    }

    if (body.description) {
      updateData.description = body.description;
    }

    const visitSnap = await visitRef.get();

    if (!visitSnap.exists) {
      return NextResponse.json(
        { error: "Visit not found" },
        { status: 404 }
      );
    }

    const existingData = visitSnap.data()!;

    const checkInDate =
      updateData.checkIn?.toDate() ??
      existingData.checkIn?.toDate?.();

    const checkOutDate =
      updateData.checkOut?.toDate() ??
      existingData.checkOut?.toDate?.();

    let duration: number | null = null;

    if (checkInDate && checkOutDate) {
      duration = Math.floor(
        (checkOutDate.getTime() - checkInDate.getTime()) /
          (1000 * 60)
      );

      updateData.duration = duration;
    }

    await visitRef.update(updateData);

    if (duration !== null) {
      const guestId = existingData.guestId;

      const guestVisits = await adminDB
        .collection("visits")
        .where("guestId", "==", guestId)
        .get();

      let totalVisits = 0;
      let totalDuration = 0;
      let totalCheckInMinute = 0;

      guestVisits.forEach((doc) => {
        const data = doc.data();

        totalVisits++;

        totalDuration += data.duration || 0;

        if (data.checkIn) {
          const checkInDate = data.checkIn.toDate();

          totalCheckInMinute +=
            checkInDate.getHours() * 60 +
            checkInDate.getMinutes();
        }
      });

      await adminDB
        .collection("visitor_features")
        .doc(guestId)
        .set(
          {
            totalVisits,
            avgDuration: Math.round(
              totalDuration / totalVisits
            ),
            avgCheckInMinute: Math.round(
              totalCheckInMinute / totalVisits
            ),
            lastUpdated: FieldValue.serverTimestamp(),
            role: "guest",
          },
          { merge: true }
        );
    }

    return NextResponse.json({
      message: "Visit updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await adminDB
      .collection("visits")
      .doc(id)
      .delete();

    return NextResponse.json({
      message: "Visit deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}