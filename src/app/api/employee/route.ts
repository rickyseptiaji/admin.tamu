import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "@firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, address, division } = body;
    if (!fullName || !email || !phone || !division) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const docRef = await addDoc(collection(db, "employees"), {
      fullName,
      email,
      phone,
      address,
      division,
      createdAt: serverTimestamp(),
    });

    return new Response(
      JSON.stringify({ message: "Employee created", id: docRef.id }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create employee" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  try {

    const employeesSnapshot = await getDocs(collection(db, "employees"));
    const employees = employeesSnapshot.docs.map((doc) => {
      const data = doc.data() as {
        fullName?: string;
        email?: string;
        phone?: string;
        address?: string;
        division?: string;
        [key: string]: any;
      };
      return {
        id: doc.id,
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        division: data.division || "",
      };
    });

    const divisionsSnapshot = await getDocs(collection(db, "divisions"));
    const divisions = divisionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { name: string }),
    }));

    const divisionMap: Record<string, string> = {};
    divisions.forEach((division) => {
      divisionMap[division.id] = division.name;
    });

    const enrichedEmployees = employees.map((emp) => ({
      ...emp,
      division: {
        id: emp.division,
        name: divisionMap[emp.division] || "Unknown",
      },
    }));
    return new Response(JSON.stringify(enrichedEmployees), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch employees" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
