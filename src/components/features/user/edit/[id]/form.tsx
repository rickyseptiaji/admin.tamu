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
import PhoneInput from "react-phone-number-input";
import { LoadingSpinner } from "@/components/features/shared/LoadingSpinner";

const FormSchema = z.object({
  email: z.string().email({ message: "Must format email" }),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters." })
    .optional()
    .or(z.literal("")),
  fullName: z
    .string()
    .min(2, { message: "full name must be at least 2 characters." }),
  companyName: z.string().min(2, {
    message: "company name must be at least 2 characters.",
  }),
  phone: z
    .string()
    .min(10, { message: "phone must be at least 10 characters." }),
});

export default function EditUserForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [editPassword, setEditPassword] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      companyName: "",
      phone: "",
    },
  });
  useEffect(() => {
    async function fetchUser() {
      try {
        setInitialLoading(true);
        const res = await fetch(`/api/user/edit/${userId}`);
        const data = await res.json();

        if (data) {
          form.reset({
            email: data.auth.email,
            password: "",
            fullName: data.data?.fullName || "",
            companyName: data.data?.companyName || "",
            phone: data.data?.phone || "",
          });
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setInitialLoading(false);
      }
    }

    fetchUser();
  }, [userId, form]);
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const res = await fetch(`/api/user/edit/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!data.ok) {
        toast.error(data.message || "User updated failed");
        return;
      }
      toast.success("User updated successfully");
      router.push("/user");
    } catch (error) {
      toast.error("Failed to updated user");
    }
  }
  if (initialLoading) {
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
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>

                {!editPassword ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditPassword(true)}
                  >
                    Ubah
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setEditPassword(false);
                      form.setValue("password", "");
                    }}
                  >
                    Batal
                  </Button>
                )}
              </div>

              <FormControl>
                <Input
                  type="password"
                  disabled={!editPassword}
                  placeholder={
                    editPassword
                      ? "Masukkan password baru"
                      : "Password tidak ditampilkan"
                  }
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
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
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Company Name" {...field} />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  country={"id"}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        /> */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
