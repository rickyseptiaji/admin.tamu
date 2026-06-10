import { adminDB } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const featureSnap = await adminDB
      .collection("visitor_features")
      .where("role", "==", "guest")
      .get();

    const result = await Promise.all(
      featureSnap.docs.map(async (featureDoc) => {
        const guestId = featureDoc.id;

        const guestSnap = await adminDB
          .collection("guests")
          .doc(guestId)
          .get();

        return {
          guestId,
          guest: guestSnap.exists
            ? {
                id: guestSnap.id,
                ...guestSnap.data(),
              }
            : null,
          features: featureDoc.data(),
        };
      })
    );

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching guest features:", error);

    return NextResponse.json(
      {
        error: "failed fetch",
      },
      {
        status: 500,
      }
    );
  }
}