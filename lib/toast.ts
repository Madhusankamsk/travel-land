/**
 * Re-export sonner's toast for use in client components.
 * Use: import { toast } from "@/lib/toast"
 *
 * Examples:
 *   toast.success("Trip saved!");
 *   toast.error("Something went wrong.");
 *   toast.loading("Saving...");
 *   toast.promise(fn, { loading: "Saving...", success: "Done!", error: "Failed" });
 */
export { toast } from "sonner";
