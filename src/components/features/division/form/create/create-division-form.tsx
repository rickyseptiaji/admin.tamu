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

const FormSchema = z.object({
  division: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function CreateDivisionForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      division: "",
    },
  });
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const { division } = values;
      const res = await fetch("/api/division", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: division }),
      });

      const data = await res.json();
      if (!data.ok) {
        toast.error("Division created failed");
        return;
      }
      toast.success("Division created successfully");
      router.push("/division");
    } catch (error) {
      toast.error("Failed to create division");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="division"
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
