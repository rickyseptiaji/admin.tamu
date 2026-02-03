"use client";

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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { combineDateTime } from "@/hooks/combineDateTime";

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
  description: z.string().optional(),
  dataCheckIn: z.date().optional(),
  timeCheckIn: z.string().optional(),
  dataCheckOut: z.date().optional(),
  timeCheckOut: z.string().optional(),
});
export default function EditGuestHistory({ data }: { data: any }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      description: "",
      dataCheckIn: undefined,
      timeCheckIn: "",
      dataCheckOut: undefined,
      timeCheckOut: "",
    },
  });

  useEffect(() => {
    if (data) {
      const checkIn = data.checkIn
        ? new Date(data.checkIn.seconds * 1000)
        : undefined;
      const checkOut = data.checkOut
        ? new Date(data.checkOut.seconds * 1000)
        : undefined;
      form.reset({
        fullName: data.guest.fullName || "",
        email: data.guest.email || "",
        phone: data.guest.phone || "",
        description: data.description || "",
        dataCheckIn: checkIn,
        timeCheckIn: checkIn ? format(checkIn, "HH:mm") : "",
        dataCheckOut: checkOut,
        timeCheckOut: checkOut ? format(checkOut, "HH:mm") : "",
      });
    }
  }, [data, form]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const description = values.description || "";
    const checkIn = combineDateTime(values.dataCheckIn, values.timeCheckIn);

    const checkOut = combineDateTime(values.dataCheckOut, values.timeCheckOut);
    const payload: any = {};
    if (checkIn) payload.checkIn = checkIn;
    if (checkOut) payload.checkOut = checkOut;
    payload.description = description;

    try {
      const res = await fetch(`/api/guest/history/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const update = await res.json();
      if (!res.ok) {
        toast.error(update.message);
        return;
      }
      toast.success(update.message);
      router.push("/guest");
    } catch (error) {
      toast.error("Failed to submit form.");
    }
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
                <Input placeholder="Full Name" {...field} disabled />
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
                <Input placeholder="Email" {...field} disabled />
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
                <Input placeholder="No Phone" {...field} disabled />
              </FormControl>
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
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          {/* DATE */}
          <FormField
            control={form.control}
            name="dataCheckIn"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check In</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Select date"}
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TIME */}
          <FormField
            control={form.control}
            name="timeCheckIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* DATE */}
          <FormField
            control={form.control}
            name="dataCheckOut"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check Out</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Select date"}
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TIME */}
          <FormField
            control={form.control}
            name="timeCheckOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
