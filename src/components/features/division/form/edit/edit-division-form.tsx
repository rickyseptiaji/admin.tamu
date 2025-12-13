"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Division name must be at least 2 characters.",
  }),
});

type Division = {
  id: string;
  name: string;
};

export default function EditDivisionForm({
  divisionId,
}: {
  divisionId: string;
}) {
  const router = useRouter();
  const [division, setDivision] = useState<Division | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    async function fetchDivision() {
      try {
        const response = await fetch(`/api/division/${divisionId}`);
        const result = await response.json();
        const data = Array.isArray(result) ? result[0] : result;
        setDivision(data);
        form.reset({ name: data?.name ?? "" });
      } catch (error) {
        console.error("Failed to fetch division:", error);
      }
    }

    fetchDivision();
  }, [divisionId, form]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const res = await fetch(`/api/division/${divisionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      router.push("/division");
      router.refresh();
    } catch (error) {
      console.error("Failed to update division:", error);
      toast.error("Failed to update division");
    }
  }

  if (!division) {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Division Name</FormLabel>
              <FormControl>
                <Input placeholder="Division" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Division</Button>
      </form>
    </Form>
  );
}
