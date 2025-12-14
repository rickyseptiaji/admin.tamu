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
import { LoadingSpinner } from "@/components/features/shared/LoadingSpinner";
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

export default function EditGuestForm({ guestId }: { guestId: string }) {
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
    },
  });
  useEffect(() => {
    async function fetchGuest() {
      try {
        setInitialLoading(true);
        const res = await fetch(`/api/guest/edit/${guestId}`);
        const data = await res.json();

        if (data) {
          form.reset({
            email: data.email,
            fullName: data.fullName || "",
            companyName: data.companyName || "",
            phone: data.phone || "",
          });
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setInitialLoading(false);
      }
    }

    fetchGuest();
  }, [guestId, form]);
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const res = await fetch("/api/guest", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      router.push("/guest");
    } catch (error) {
      toast.error("Failed to create guest");
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
