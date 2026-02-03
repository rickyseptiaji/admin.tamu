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

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

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

export default function EditUserForm({ data }: { data: any }) {
  const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: data?.auth?.email || "",
      password: "",
      fullName: data?.data?.fullName || "",
      companyName: data?.data?.companyName || "",
      phone: data?.data?.phone || "",
    },
  });
  useEffect(() => {
    if (data) {
      form.reset({
        email: data?.auth?.email || "",
        password: "",
        fullName: data?.data?.fullName || "",
        companyName: data?.data?.companyName || "",
        phone: data?.data?.phone || "",
      });
    }
  }, [data, form]);
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const res = await fetch(`/api/user/${data?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const response = await res.json();
      if (!response.ok) {
        toast.error(response.message || "User updated failed");
        return;
      }
      toast.success("User updated successfully");
      router.push("/user");
    } catch (error) {
      toast.error("Failed to updated user");
    }
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
                <Input placeholder="Email" {...field} disabled={!isEditing} />
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
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel Edit" : "Edit Password"}
                </Button>
              </div>

              <FormControl>
                <Input
                  placeholder="Password"
                  {...field}
                  disabled={!isEditing}
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
                <Input placeholder="Full Name" {...field} disabled={!isEditing} />
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
                <Input placeholder="Company Name" {...field} disabled={!isEditing} />
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
                  disabled={!isEditing}
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
         {isEditing && <Button type="submit">Submit</Button>}
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="mb-4"
            >
              Edit
            </Button>
          )}
      </form>
    </Form>
  );
}
