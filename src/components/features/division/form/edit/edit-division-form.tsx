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
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});
export default function EditDivisionForm() {
  const router = useRouter();
  const params = useParams();
  const divisionId = params.id as string;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const { name } = data;
      await fetch(`/api/division/${divisionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      router.push("/division");
    } catch (error) {
      console.error("Failed to update division:", error);
    }
    toast.success("Division updated successfully!");
  }

  useEffect(() => {
    async function fetchDivision() {
      const response = await fetch(`/api/division/${divisionId}`);
      const result = await response.json();
      const data = result[0];
      form.reset(data);
    }
    fetchDivision();
  }, [divisionId, form]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Division</FormLabel>
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
