import { adminDB } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, address, division } = body;

    if (!fullName || !email || !phone || !division) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const docRef = adminDB.collection("employees").doc();

    await docRef.set({
      id: docRef.id,
      fullName,
      email,
      phone,
      address,
      division,
      createdAt: FieldValue.serverTimestamp(),
    });

    return Response.json(
      { message: "Employee created" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to create employee" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const employeesSnapshot =
      await adminDB.collection("employees").get();

    const divisionsSnapshot =
      await adminDB.collection("divisions").get();

    const divisionMap: Record<string, string> = {};

    divisionsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      divisionMap[doc.id] = data.name;
    });

    const employees = employeesSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        fullName: data.fullName ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        division: {
          id: data.division,
          name: divisionMap[data.division] ?? "Unknown",
        },
      };
    });

    return Response.json(employees);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}
