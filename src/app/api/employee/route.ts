import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, email, phone, division } = body;
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