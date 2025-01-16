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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { S3_PROVIDERS } from "./constants";

const addDestination = z.object({
	name: z.string().min(1, "Name is required"),
	provider: z.string().optional(),
	accessKeyId: z.string(),
	secretAccessKey: z.string(),
	bucket: z.string(),
	region: z.string(),
	endpoint: z.string(),
	serverId: z.string().optional(),
});

type AddDestination = z.infer<typeof addDestination>;

export const AddDestination = () => {
	const utils = api.useUtils();
	const { data: servers } = api.server.withSSHKey.useQuery();
	const { data: isCloud } = api.settings.isCloud.useQuery();

	const { mutateAsync, isError, error, isLoading } =
		api.destination.create.useMutation();
	const { mutateAsync: testConnection, isLoading: isLoadingConnection } =
		api.destination.testConnection.useMutation();
	const form = useForm<AddDestination>({
		defaultValues: {
			provider: "",
			accessKeyId: "",
			bucket: "",
			name: "",
			region: "",
			secretAccessKey: "",
			endpoint: "",
		},
		resolver: zodResolver(addDestination),
	});
	useEffect(() => {
		form.reset();
	}, [form, form.reset, form.formState.isSubmitSuccessful]);

	const onSubmit = async (data: AddDestination) => {
		await mutateAsync({
			provider: data.provider || "",
			accessKey: data.accessKeyId,
			bucket: data.bucket,
			endpoint: data.endpoint,
			name: data.name,
			region: data.region,
			secretAccessKey: data.secretAccessKey,
		})
			.then(async () => {
				toast.success("Destination Created");
				await utils.destination.all.invalidate();
			})
			.catch(() => {
				toast.error("Error creating the Destination");
			});
	};
	return (
		<Dialog>
			<DialogTrigger className="" asChild>
				<Button>اضافه کردن</Button>
			</DialogTrigger>
			<DialogContent className="max-h-screen  overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>اضافه کردن S3 Object Storage</DialogTitle>
					<DialogDescription>
						اطلاعات مربوطه به S3 Storage رو اینجا وارد کنید.
					</DialogDescription>
				</DialogHeader>
				{isError && <AlertBlock type="error">{error?.message}</AlertBlock>}

				<Form {...form}>
					<form
						id="hook-form-destination-add"
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid w-full gap-4 "
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>اسم</FormLabel>
										<FormControl>
											<Input dir="ltr" placeholder={"my-bucket"} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="provider"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>سرویس دهنده</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a S3 Provider" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{S3_PROVIDERS.map((s3Provider) => (
														<SelectItem
															key={s3Provider.key}
															value={s3Provider.key}
														>
															{s3Provider.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<FormField
							control={form.control}
							name="accessKeyId"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>کلید آیدی</FormLabel>
										<FormControl>
											<Input dir="ltr" placeholder={"xcas41dasde"} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="secretAccessKey"
							render={({ field }) => (
								<FormItem>
									<div className="space-y-0.5">
										<FormLabel>کلید سکرت</FormLabel>
									</div>
									<FormControl>
										<Input dir="ltr" placeholder={"asd123asdasw"} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bucket"
							render={({ field }) => (
								<FormItem>
									<div className="space-y-0.5">
										<FormLabel>باکت</FormLabel>
									</div>
									<FormControl>
										<Input dir="ltr" placeholder={"dokploy-bucket"} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="region"
							render={({ field }) => (
								<FormItem>
									<div className="space-y-0.5">
										<FormLabel>منطقه (Region)</FormLabel>
									</div>
									<FormControl>
										<Input dir="ltr" placeholder={"us-east-1"} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="endpoint"
							render={({ field }) => (
								<FormItem>
									<FormLabel>آدرس (EndPoint)</FormLabel>
									<FormControl>
										<Input
											dir="ltr"
											placeholder={"https://us.bucket.aws/s3"}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>

					<DialogFooter
						className={cn(
							isCloud ? "!flex-col" : "flex-row",
							"flex w-full  !justify-between pt-3 gap-4",
						)}
					>
						{isCloud ? (
							<div className="flex flex-col gap-4 border p-2 rounded-lg">
								<span className="text-sm text-muted-foreground">
									یه سرور برای اتصال انتخاب کنید.
								</span>
								<FormField
									control={form.control}
									name="serverId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>سرور (اختیاری)</FormLabel>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select a server" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectLabel>لیست سرور‌ها</SelectLabel>
															{servers?.map((server) => (
																<SelectItem
																	key={server.serverId}
																	value={server.serverId}
																>
																	{server.name}
																</SelectItem>
															))}
															<SelectItem value={"none"}>هیچ کدوم</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="button"
									variant={"secondary"}
									isLoading={isLoading}
									onClick={async () => {
										await testConnection({
											provider: form.getValues("provider") || "",
											accessKey: form.getValues("accessKeyId"),
											bucket: form.getValues("bucket"),
											endpoint: form.getValues("endpoint"),
											name: "Test",
											region: form.getValues("region"),
											secretAccessKey: form.getValues("secretAccessKey"),
											serverId: form.getValues("serverId"),
										})
											.then(async () => {
												toast.success("با موفقیت متصل شد");
											})
											.catch((e) => {
												toast.error("نه، نشد که بشه. یه بار دیگه امتحان کنید", {
													description: e.message,
												});
											});
									}}
								>
									تست اتصال
								</Button>
							</div>
						) : (
							<Button
								isLoading={isLoadingConnection}
								type="button"
								variant="secondary"
								onClick={async () => {
									await testConnection({
										provider: form.getValues("provider") || "",
										accessKey: form.getValues("accessKeyId"),
										bucket: form.getValues("bucket"),
										endpoint: form.getValues("endpoint"),
										name: "Test",
										region: form.getValues("region"),
										secretAccessKey: form.getValues("secretAccessKey"),
									})
										.then(async () => {
											toast.success("با موفقیت متصل شد");
										})
										.catch(() => {
											toast.error("نه، نشد که بشه. یه بار دیگه امتحان کنید");
										});
								}}
							>
								تست اتصال
							</Button>
						)}

						<Button
							isLoading={isLoading}
							form="hook-form-destination-add"
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
