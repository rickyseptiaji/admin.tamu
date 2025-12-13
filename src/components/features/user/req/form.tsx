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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import "react-phone-number-input/style.css";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "../../shared/LoadingSpinner";

const FormSchema = z.object({
  employeeId: z.string(),
  description: z
    .string()
    .min(2, { message: "full name must be at least 2 characters." }),
});

export default function CreateReqUserForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [employee, setEmployee] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      employeeId: "",
      description: "",
    },
  });
  useEffect(() => {
    async function fetchDivision() {
      try {
        setInitialLoading(true);
        const response = await fetch("/api/employee");
        if (!response.ok) {
          throw new Error("Failed to fetch employee");
        }
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchDivision();
  }, []);
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const { employeeId, description } = values;
      const res = await fetch(`/api/user/req/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          description,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        toast.error(data.message || "User created failed");
        return;
      }
      toast.success("User created successfully");
      router.push("/user");
    } catch (error) {
      toast.error("Failed to create user");
    }
  }
  if (initialLoading && employee.length != null) {
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
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employee.map((div) => (
                    <SelectItem key={div.id} value={div.id}>
                      {div.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
