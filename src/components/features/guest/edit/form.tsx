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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useEffect, useState } from "react";
const FormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full Name must be at least 2 characters.",
  }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, {
    message: "phone must be at least 10 characters.",
  }),
  companyName: z.string().min(2, {
    message: "company name must be at least 2 characters.",
  }),
});

export default function EditGuestForm({ data }: { data: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: data?.fullName || "",
      email: data?.email || "",
      phone: data?.phone || "",
      companyName: data?.companyName || "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        companyName: data.companyName || "",
      });
    }
  }, [data, form]);
  
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch(`/api/guest/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const res = await response.json();
      if (!response.ok) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setIsEditing(false);
      router.push("/guest");
    } catch (error) {
      toast.error("Failed to create guest");
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Full Name"
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
                    placeholder="Phone Number"
                  />
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
                  <Input
                    placeholder="Company Name"
                    {...field}
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
    </>
  );
}
