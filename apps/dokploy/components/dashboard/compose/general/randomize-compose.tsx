import { AlertBlock } from "@/components/shared/alert-block";
import { CodeEditor } from "@/components/shared/code-editor";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Switch } from "@/components/ui/switch";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Dices } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
	composeId: string;
}

const schema = z.object({
	suffix: z.string(),
	randomize: z.boolean().optional(),
});

type Schema = z.infer<typeof schema>;

export const RandomizeCompose = ({ composeId }: Props) => {
	const utils = api.useUtils();
	const [compose, setCompose] = useState<string>("");
	const [isOpen, setIsOpen] = useState(false);
	const { mutateAsync, error, isError } =
		api.compose.randomizeCompose.useMutation();

	const { mutateAsync: updateCompose } = api.compose.update.useMutation();

	const { data, refetch } = api.compose.one.useQuery(
		{ composeId },
		{ enabled: !!composeId },
	);

	const form = useForm<Schema>({
		defaultValues: {
			suffix: "",
			randomize: false,
		},
		resolver: zodResolver(schema),
	});

	const suffix = form.watch("suffix");

	useEffect(() => {
		if (data) {
			form.reset({
				suffix: data?.suffix || "",
				randomize: data?.randomize || false,
			});
		}
	}, [form, form.reset, form.formState.isSubmitSuccessful, data]);

	const onSubmit = async (formData: Schema) => {
		await updateCompose({
			composeId,
			suffix: formData?.suffix || "",
			randomize: formData?.randomize || false,
		})
			.then(async (data) => {
				randomizeCompose();
				refetch();
				toast.success("Compose updated");
			})
			.catch(() => {
				toast.error("Error randomizing the compose");
			});
	};

	const randomizeCompose = async () => {
		await mutateAsync({
			composeId,
			suffix,
		})
			.then(async (data) => {
				await utils.project.all.invalidate();
				setCompose(data);
				toast.success("Compose randomized");
			})
			.catch(() => {
				toast.error("Error randomizing the compose");
			});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild onClick={() => randomizeCompose()}>
				<Button className="max-lg:w-full" variant="outline">
					<Dices className="h-4 w-4" />
					تصادفی‌سازی Compose
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-6xl max-h-[50rem] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>تصادفی‌سازی Compose (آزمایشی)</DialogTitle>
					<DialogDescription>
						در صورتی که می‌خواهید فایل Compose یکسان را مستقر کنید و با برخی ویژگی‌ها مانند حجم‌ها، شبکه‌ها و غیره تداخل دارید، از این گزینه استفاده کنید.
					</DialogDescription>
				</DialogHeader>
				<div className="text-sm text-muted-foreground flex flex-col gap-2">
					<span>
						این گزینه فایل Compose را تصادفی‌سازی کرده و یک پسوند به ویژگی‌ها اضافه می‌کند تا از تداخل جلوگیری شود.
					</span>
					<ul className="list-disc list-inside">
						<li>حجم‌ها</li>
						<li>شبکه‌ها</li>
						<li>سرویس‌ها</li>
						<li>پیکربندی‌ها</li>
						<li>رمزها</li>
					</ul>
					<AlertBlock type="info">
						وقتی این گزینه را فعال می‌کنید، یک متغیر محیطی `COMPOSE_PREFIX` به فایل Compose اضافه می‌شود تا بتوانید از آن در فایل Compose خود استفاده کنید.
					</AlertBlock>
				</div>
				{isError && <AlertBlock type="error">{error?.message}</AlertBlock>}
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						id="hook-form-add-project"
						className="grid w-full gap-4"
					>
						{isError && (
							<div className="flex flex-row gap-4 rounded-lg items-center bg-red-50 p-2 dark:bg-red-950">
								<AlertTriangle className="text-red-600 dark:text-red-400" />
								<span className="text-sm text-red-600 dark:text-red-400">
									{error?.message}
								</span>
							</div>
						)}

						<div className="flex flex-col lg:flex-col  gap-4 w-full ">
							<div>
								<FormField
									control={form.control}
									name="suffix"
									render={({ field }) => (
										<FormItem className="flex flex-col justify-center max-sm:items-center w-full">
											<FormLabel>پسوند</FormLabel>
											<FormControl>
												<Input
													placeholder="یک پسوند وارد کنید (اختیاری، مثال: prod)"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="randomize"
									render={({ field }) => (
										<FormItem className="mt-4 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
											<div className="space-y-0.5">
												<FormLabel>اعمال تصادفی‌سازی</FormLabel>
												<FormDescription>
													تصادفی‌سازی را روی فایل Compose اعمال کنید.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<div className="flex flex-col lg:flex-row  gap-4 w-full items-end justify-end">
								<Button
									form="hook-form-add-project"
									type="submit"
									className="lg:w-fit"
								>
									ذخیره
								</Button>
								<Button
									type="button"
									variant="secondary"
									onClick={async () => {
										await randomizeCompose();
									}}
									className="lg:w-fit"
								>
									تصادفی
								</Button>
							</div>
						</div>
						<pre>
							<CodeEditor
								style={{ direction: "ltr" }}

								value={compose || ""}
								language="yaml"
								readOnly
								height="50rem"
							/>
						</pre>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
