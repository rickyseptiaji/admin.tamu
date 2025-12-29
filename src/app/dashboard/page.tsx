
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Dashboard from "@/components/features/dashboard/page";

export default async function Page() {
  const [user, guest, employee, division] =
    await Promise.all([
      getCountFromServer(collection(db, "users")),
      getCountFromServer(collection(db, "guests")),
      getCountFromServer(collection(db, "employees")),
      getCountFromServer(collection(db, "divisions")),
    ]);

  const data = {
    users: user.data().count,
    guests: guest.data().count,
    employees: employee.data().count,
    divisions: division.data().count,
  };

  return <Dashboard data={data} />;
}

