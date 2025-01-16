import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const deleteMongoSchema = z.object({
	projectName: z.string().min(1, {
		message: "Database name is required",
	}),
});

type DeleteMongo = z.infer<typeof deleteMongoSchema>;

interface Props {
	mongoId: string;
}

// commen

export const DeleteMongo = ({ mongoId }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const { mutateAsync, isLoading } = api.mongo.remove.useMutation();
	const { data } = api.mongo.one.useQuery({ mongoId }, { enabled: !!mongoId });
	const { push } = useRouter();
	const form = useForm<DeleteMongo>({
		defaultValues: {
			projectName: "",
		},
		resolver: zodResolver(deleteMongoSchema),
	});

	const onSubmit = async (formData: DeleteMongo) => {
		const expectedName = `${data?.name}/${data?.appName}`;
		if (formData.projectName === expectedName) {
			await mutateAsync({ mongoId })
				.then((data) => {
					push(`/dashboard/project/${data?.projectId}`);
					toast.success("Database deleted successfully");
					setIsOpen(false);
				})
				.catch(() => {
					toast.error("Error deleting the database");
				});
		} else {
			form.setError("projectName", {
				message: "Database name does not match",
			});
		}
	};
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" isLoading={isLoading}>
					<TrashIcon className="size-4 text-muted-foreground" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>آیا مطمئن هستید؟</DialogTitle>
					<DialogDescription>
						این عمل قابل بازگشت نیست. این کار پایگاه داده را به طور دائمی حذف خواهد کرد. اگر مطمئن هستید، لطفاً نام پایگاه داده را وارد کنید تا این پایگاه داده حذف شود.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							id="hook-form-delete-mongo"
							className="grid w-full gap-4"
						>
							<FormField
								control={form.control}
								name="projectName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<span>
												برای تأیید، عبارت{" "}
												<Badge
													className="p-2 rounded-md ml-1 mr-1 hover:border-primary hover:text-primary-foreground hover:bg-primary hover:cursor-pointer"
													variant="outline"
													onClick={() => {
														if (data?.name && data?.appName) {
															navigator.clipboard.writeText(
																`${data.name}/${data.appName}`,
															);
															toast.success("در کلیپ‌بورد کپی شد. مراقب باشید!");
														}
													}}
												>
													{data?.name}/{data?.appName}&nbsp;
													<Copy className="h-4 w-4 ml-1 text-muted-foreground" />
												</Badge>{" "}
												را در کادر زیر وارد کنید:
											</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="نام پایگاه داده را برای تأیید وارد کنید"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</div>
				<DialogFooter>
					<Button
						variant="secondary"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						لغو
					</Button>
					<Button
						isLoading={isLoading}
						form="hook-form-delete-mongo"
						type="submit"
						variant="destructive"
					>
						تأیید
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
