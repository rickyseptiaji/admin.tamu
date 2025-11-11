import { LoadingSpinner } from "@/components/features/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  division: z.string().min(1, {
    message: "Please select a division.",
  }),
});
export default function EditEmployeeForm({
  employeeId,
}: {
  employeeId: string;
}) {
  const router = useRouter();

  const [employee, setEmployee] = useState<any>(null);
  const [division, setDivision] = useState<any[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      division: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    async function updateEmployee() {
      try {
        const response = await fetch(`/api/employee/${employeeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to update employee");

        const updatedEmployee = await response.json();
        setEmployee(updatedEmployee);
        router.push("/division");
        toast.success("Employee updated successfully");
      } catch (error) {
        toast.error("Failed to update employee");
      }
    }

    updateEmployee();
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [divRes, empRes] = await Promise.all([
          fetch("/api/division"),
          fetch(`/api/employee/${employeeId}`),
        ]);

        if (!divRes.ok || !empRes.ok) throw new Error("Failed to fetch data");

        const divisionData = await divRes.json();
        const employeeData = await empRes.json();
        setDivision(divisionData);
        setEmployee(employeeData);

        form.reset({
          fullName: employeeData.fullName || "",
          email: employeeData.email || "",
          phone: employeeData.phone || "",
          address: employeeData.address || "",
          division: employeeData.division || "",
        });
      } catch (error) {
        toast.error("Failed to load data");
      }
    }

    fetchData();
  }, [form, employeeId]);
  if (!employee || division.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No Phone</FormLabel>
              <FormControl>
                <Input placeholder="No Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Division</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Division" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {division.map((div) => (
                    <SelectItem key={div.id} value={div.id}>
                      {div.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
