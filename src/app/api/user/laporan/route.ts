import { adminDB } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const featureSnap = await adminDB
      .collection("visitor_features")
      .where("role", "==", "user")
      .get();

    const result = await Promise.all(
      featureSnap.docs.map(async (featureDoc) => {
        const userId = featureDoc.id;

        const guestSnap = await adminDB
          .collection("users")
          .doc(userId)
          .get();

        return {
          userId,
          user: guestSnap.exists
            ? guestSnap.data()
            : null,
          features: featureDoc.data(),
        };
      })
    );

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch data",
      },
      {
        status: 500,
      }
    );
  }
}