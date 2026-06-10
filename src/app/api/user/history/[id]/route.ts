import { adminDB } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const snapshot = await adminDB
      .collection("visits")
      .where("userId", "==", id)
      .get();

    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const visits = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();

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

        let user = null;

        if (data.userId) {
          const userSnap = await adminDB
            .collection("users")
            .doc(data.userId)
            .get();

          if (userSnap.exists) {
            user = {
              id: userSnap.id,
              ...userSnap.data(),
            };
          }
        }

        return {
          id: docSnap.id,
          description: data.description,
          checkIn: data.checkIn ?? null,
          checkOut: data.checkOut ?? null,
          duration: data.duration ?? null,
          employee,
          user,
        };
      })
    );

    return NextResponse.json(visits, { status: 200 });
  } catch (error) {
    console.error("Error fetching user visits:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user visits",
      },
      {
        status: 500,
      }
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

    let duration: number | null = null;

    if (updateData.checkIn && updateData.checkOut) {
      const checkInDate = updateData.checkIn.toDate();
      const checkOutDate = updateData.checkOut.toDate();

      duration = Math.floor(
        (checkOutDate.getTime() - checkInDate.getTime()) /
          (1000 * 60)
      );
    } else if (updateData.checkIn || updateData.checkOut) {
      const visitSnap = await visitRef.get();

      if (visitSnap.exists) {
        const existingData = visitSnap.data();

        const existingCheckIn = existingData?.checkIn as
          | Timestamp
          | undefined;

        const existingCheckOut = existingData?.checkOut as
          | Timestamp
          | undefined;

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
            (checkOutDate.getTime() -
              checkInDate.getTime()) /
              (1000 * 60)
          );
        }
      }
    }

    if (duration !== null) {
      updateData.duration = duration;
    }

    await visitRef.update({
      ...updateData,
      ...(duration !== null ? { duration } : {}),
    });

    if (duration !== null) {
      const visitSnap = await visitRef.get();

      if (visitSnap.exists) {
        const userId = visitSnap.data()?.userId;

        if (userId) {
          const visitsSnapshot = await adminDB
            .collection("visits")
            .where("userId", "==", userId)
            .get();

          let totalVisits = 0;
          let totalDuration = 0;
          let totalCheckInMinute = 0;

          visitsSnapshot.forEach((visitDoc) => {
            const data = visitDoc.data();

            totalVisits++;

            totalDuration += data.duration ?? 0;

            if (data.checkIn) {
              const checkInDate = data.checkIn.toDate();

              totalCheckInMinute +=
                checkInDate.getHours() * 60 +
                checkInDate.getMinutes();
            }
          });

          await adminDB
            .collection("visitor_features")
            .doc(userId)
            .set(
              {
                totalVisits,
                avgDuration:
                  totalVisits > 0
                    ? Math.round(
                        totalDuration / totalVisits
                      )
                    : 0,
                avgCheckInMinute:
                  totalVisits > 0
                    ? Math.round(
                        totalCheckInMinute /
                          totalVisits
                      )
                    : 0,
                lastUpdated: Timestamp.now(),
                role: "user",
              },
              {
                merge: true,
              }
            );
        }
      }
    }

    return NextResponse.json(
      {
        message: "Visit updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating visit:", error);

    return NextResponse.json(
      {
        error: "Failed to update visit",
      },
      {
        status: 500,
      }
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

    return NextResponse.json(
      {
        message: "Visit deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting visit:", error);

    return NextResponse.json(
      {
        error: "Failed to delete visit",
      },
      {
        status: 500,
      }
    );
  }
}