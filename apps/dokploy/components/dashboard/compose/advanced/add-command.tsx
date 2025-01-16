import { AlertBlock } from "@/components/shared/alert-block";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
interface Props {
	composeId: string;
}

const AddRedirectSchema = z.object({
	command: z.string(),
});

type AddCommand = z.infer<typeof AddRedirectSchema>;

export const AddCommandCompose = ({ composeId }: Props) => {
	const { data } = api.compose.one.useQuery(
		{
			composeId,
		},
		{ enabled: !!composeId },
	);

	const { data: defaultCommand, refetch } =
		api.compose.getDefaultCommand.useQuery(
			{
				composeId,
			},
			{ enabled: !!composeId },
		);

	const utils = api.useUtils();

	const { mutateAsync, isLoading } = api.compose.update.useMutation();

	const form = useForm<AddCommand>({
		defaultValues: {
			command: "",
		},
		resolver: zodResolver(AddRedirectSchema),
	});

	useEffect(() => {
		if (data?.command) {
			form.reset({
				command: data?.command || "",
			});
		}
	}, [form, form.reset, form.formState.isSubmitSuccessful, data?.command]);

	const onSubmit = async (data: AddCommand) => {
		await mutateAsync({
			composeId,
			command: data?.command,
		})
			.then(async () => {
				toast.success("دستور با موفقیت به‌روزرسانی شد");
				refetch();
				await utils.compose.one.invalidate({
					composeId,
				});
			})
			.catch(() => {
				toast.error("خطا در به‌روزرسانی دستور");
			});
	};

	return (
		<Card className="bg-background">
			<CardHeader className="flex flex-row justify-between">
				<div>
					<CardTitle className="text-xl">اجرای دستور</CardTitle>
					<CardDescription>
						دستور سفارشی را به فایل کامپوز اضافه کنید
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid w-full gap-4"
					>
						<AlertBlock type="warning">
							تغییر دستور پیش‌فرض ممکن است بر ثبات دیپلویمنت تأثیر بگذارد و بر لاگ‌ها و مانیتورینگ تأثیر بگذارد. با احتیاط پیش بروید و به‌طور کامل تست کنید. به‌طور پیش‌فرض، دستور با <strong>docker</strong> شروع می‌شود.
						</AlertBlock>
						<div className="flex flex-col gap-4">
							<FormField
								control={form.control}
								name="command"
								render={({ field }) => (
									<FormItem>
										<FormLabel>دستور</FormLabel>
										<FormControl>
											<Input placeholder="دستور سفارشی" {...field} />
										</FormControl>

										<FormDescription>
											دستور پیش‌فرض ({defaultCommand})
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-end">
							<Button isLoading={isLoading} type="submit" className="w-fit">
								ذخیره
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};