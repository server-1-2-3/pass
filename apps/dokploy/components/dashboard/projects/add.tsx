import { AlertBlock } from "@/components/shared/alert-block";
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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const AddProjectSchema = z.object({
	name: z.string().min(1, {
		message: "Name is required",
	}),
	description: z.string().optional(),
});

type AddProject = z.infer<typeof AddProjectSchema>;

export const AddProject = () => {
	const utils = api.useUtils();
	const [isOpen, setIsOpen] = useState(false);
	const { mutateAsync, error, isError } = api.project.create.useMutation();
	const router = useRouter();
	const form = useForm<AddProject>({
		defaultValues: {
			description: "",
			name: "",
		},
		resolver: zodResolver(AddProjectSchema),
	});

	useEffect(() => {
		form.reset({
			description: "",
			name: "",
		});
	}, [form, form.reset, form.formState.isSubmitSuccessful]);

	const onSubmit = async (data: AddProject) => {
		await mutateAsync({
			name: data.name,
			description: data.description,
		})
			.then(async (data) => {
				await utils.project.all.invalidate();
				toast.success("Project Created");
				setIsOpen(false);
				router.push(`/dashboard/project/${data.projectId}`);
			})
			.catch(() => {
				toast.error("Error creating a project");
			});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					پروژه جدید
					<PlusIcon className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent dir="rtl" className="sm:m:max-w-lg ">
				<DialogHeader>
					<DialogTitle>یک پروژه جدید اضافه کنید</DialogTitle>
					<DialogDescription>یه پروژه‌ی خفن!</DialogDescription>
				</DialogHeader>
				{isError && <AlertBlock type="error">{error?.message}</AlertBlock>}
				<Form {...form}>
					<form
						id="hook-form-add-project"
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid w-full gap-4"
					>
						<div className="flex flex-col gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>اسم</FormLabel>
										<FormControl>
											<Input placeholder="Tesla" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>توضیحات</FormLabel>
									<FormControl>
										<Textarea
											placeholder="توضیحات در مورد پروژه..."
											className="resize-none"
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</form>

					<DialogFooter>
						<Button
							isLoading={form.formState.isSubmitting}
							form="hook-form-add-project"
							type="submit"
						>
							ساخت
						</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
