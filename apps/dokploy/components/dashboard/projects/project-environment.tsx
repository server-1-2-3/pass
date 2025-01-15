import { AlertBlock } from "@/components/shared/alert-block";
import { CodeEditor } from "@/components/shared/code-editor";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateProjectSchema = z.object({
	env: z.string().optional(),
});

type UpdateProject = z.infer<typeof updateProjectSchema>;

interface Props {
	projectId: string;
	children?: React.ReactNode;
}

export const ProjectEnvironment = ({ projectId, children }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const utils = api.useUtils();
	const { mutateAsync, error, isError, isLoading } =
		api.project.update.useMutation();
	const { data } = api.project.one.useQuery(
		{
			projectId,
		},
		{
			enabled: !!projectId,
		},
	);

	const form = useForm<UpdateProject>({
		defaultValues: {
			env: data?.env ?? "",
		},
		resolver: zodResolver(updateProjectSchema),
	});
	useEffect(() => {
		if (data) {
			form.reset({
				env: data.env ?? "",
			});
		}
	}, [data, form, form.reset]);

	const onSubmit = async (formData: UpdateProject) => {
		await mutateAsync({
			env: formData.env || "",
			projectId: projectId,
		})
			.then(() => {
				toast.success("Project env updated successfully");
				utils.project.all.invalidate();
			})
			.catch(() => {
				toast.error("Error updating the env");
			})
			.finally(() => {});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{children ?? (
					<DropdownMenuItem
						className="w-full cursor-pointer flex justify-between items-center"
						onSelect={(e) => e.preventDefault()}
					>
						<span >مقادیر محیطی</span>
						<FileIcon className="size-4" />
					</DropdownMenuItem>
				)}
			</DialogTrigger>
			<DialogContent style={{
				direction: "rtl"
			}} className="max-h-screen overflow-y-auto sm:max-w-6xl">
				<DialogHeader>
					<DialogTitle>متغیر‌های محیطی (Environment Variables)</DialogTitle>
					<DialogDescription>
						متغیر‌های محیطی مورد نیاز سرویس‌های خود را اینجا تعریف کنید و سپس در سرویس‌های خود آن‌هارا فراخوانی کنید.
					</DialogDescription>
				</DialogHeader>
				{isError && <AlertBlock type="error">{error?.message}</AlertBlock>}
				<AlertBlock type="info">
					از این قالب برای دسترسی به متغیر های پراجکت استفاده کنید:
					مثال: <code>DATABASE_URL=${"{{project.DATABASE_URL}}"}</code>
				</AlertBlock>
				<div className="grid gap-4">
					<div className="grid items-center gap-4">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="grid w-full gap-4 "
							>
								<FormField
									control={form.control}
									name="env"
									render={({ field }) => (
										<FormItem>
											<FormLabel>متغیر‌ها</FormLabel>
											<FormControl>
												<CodeEditor
													dir="ltr"
													style={{
														direction: "ltr !important"
													}}
													lineWrapping
													language="properties"
													wrapperClassName="h-[35rem] font-mono"
													placeholder={`NODE_ENV=production
PORT=3000

                                                    `}
													{...field}
												/>
											</FormControl>

											<pre>
												<FormMessage />
											</pre>
										</FormItem>
									)}
								/>
								<DialogFooter>
									<Button isLoading={isLoading} type="submit">
										Update
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
