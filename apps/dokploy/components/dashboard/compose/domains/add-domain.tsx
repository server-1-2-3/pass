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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input, NumberInput } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { domainCompose } from "@/server/db/validations/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatabaseZap, Dices, RefreshCw } from "lucide-react";
import type z from "zod";

type Domain = z.infer<typeof domainCompose>;

export type CacheType = "fetch" | "cache";

interface Props {
	composeId: string;
	domainId?: string;
	children: React.ReactNode;
}

export const AddDomainCompose = ({
	composeId,
	domainId = "",
	children,
}: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [cacheType, setCacheType] = useState<CacheType>("cache");
	const utils = api.useUtils();
	const { data, refetch } = api.domain.one.useQuery(
		{
			domainId,
		},
		{
			enabled: !!domainId,
		},
	);

	const { data: compose } = api.compose.one.useQuery(
		{
			composeId,
		},
		{
			enabled: !!composeId,
		},
	);

	const {
		data: services,
		isFetching: isLoadingServices,
		error: errorServices,
		refetch: refetchServices,
	} = api.compose.loadServices.useQuery(
		{
			composeId,
			type: cacheType,
		},
		{
			retry: false,
			refetchOnWindowFocus: false,
		},
	);

	const { mutateAsync: generateDomain, isLoading: isLoadingGenerate } =
		api.domain.generateDomain.useMutation();

	const { mutateAsync, isError, error, isLoading } = domainId
		? api.domain.update.useMutation()
		: api.domain.create.useMutation();

	const form = useForm<Domain>({
		resolver: zodResolver(domainCompose),
	});

	const https = form.watch("https");

	useEffect(() => {
		if (data) {
			form.reset({
				...data,
				/* Convert null to undefined */
				path: data?.path || undefined,
				port: data?.port || undefined,
				serviceName: data?.serviceName || undefined,
			});
		}

		if (!domainId) {
			form.reset({});
		}
	}, [form, form.reset, data, isLoading]);

	const dictionary = {
		success: domainId ? "دامنه به‌روزرسانی شد" : "دامنه ایجاد شد",
		error: domainId
			? "خطا در به‌روزرسانی دامنه"
			: "خطا در ایجاد دامنه",
		submit: domainId ? "به‌روزرسانی" : "ایجاد",
		dialogDescription: domainId
			? "در این بخش می‌توانید دامنه را ویرایش کنید"
			: "در این بخش می‌توانید دامنه‌ها را اضافه کنید",
	};

	const onSubmit = async (data: Domain) => {
		await mutateAsync({
			domainId,
			composeId,
			domainType: "compose",
			...data,
		})
			.then(async () => {
				await utils.domain.byComposeId.invalidate({
					composeId,
				});
				toast.success(dictionary.success);
				if (domainId) {
					refetch();
				}
				setIsOpen(false);
			})
			.catch(() => {
				toast.error(dictionary.error);
			});
	};
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className="" asChild>
				{children}
			</DialogTrigger>
			<DialogContent className="max-h-screen overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>دامنه</DialogTitle>
					<DialogDescription>{dictionary.dialogDescription}</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<AlertBlock type="info">
						برای اعمال تغییرات پس از ایجاد یا به‌روزرسانی دامنه، نیاز به دیپلویمنت مجدد است.
					</AlertBlock>
					{isError && <AlertBlock type="error">{error?.message}</AlertBlock>}
				</div>

				<Form {...form}>
					<form
						id="hook-form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid w-full gap-8 "
					>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								{errorServices && (
									<AlertBlock
										type="warning"
										className="[overflow-wrap:anywhere]"
									>
										{errorServices?.message}
									</AlertBlock>
								)}
								<div className="flex flex-row items-end w-full gap-4">
									<FormField
										control={form.control}
										name="serviceName"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>نام سرویس</FormLabel>
												<div className="flex gap-2">
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value || ""}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="انتخاب نام سرویس" />
															</SelectTrigger>
														</FormControl>

														<SelectContent>
															{services?.map((service, index) => (
																<SelectItem
																	value={service}
																	key={`${service}-${index}`}
																>
																	{service}
																</SelectItem>
															))}
															<SelectItem value="none" disabled>
																خالی
															</SelectItem>
														</SelectContent>
													</Select>
													<TooltipProvider delayDuration={0}>
														<Tooltip>
															<TooltipTrigger asChild>
																<Button
																	variant="secondary"
																	type="button"
																	isLoading={isLoadingServices}
																	onClick={() => {
																		if (cacheType === "fetch") {
																			refetchServices();
																		} else {
																			setCacheType("fetch");
																		}
																	}}
																>
																	<RefreshCw className="size-4 text-muted-foreground" />
																</Button>
															</TooltipTrigger>
															<TooltipContent
																side="left"
																sideOffset={5}
																className="max-w-[10rem]"
															>
																<p>
																	Fetch: مخزن را کلون کرده و سرویس‌ها را بارگذاری می‌کند
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
													<TooltipProvider delayDuration={0}>
														<Tooltip>
															<TooltipTrigger asChild>
																<Button
																	variant="secondary"
																	type="button"
																	isLoading={isLoadingServices}
																	onClick={() => {
																		if (cacheType === "cache") {
																			refetchServices();
																		} else {
																			setCacheType("cache");
																		}
																	}}
																>
																	<DatabaseZap className="size-4 text-muted-foreground" />
																</Button>
															</TooltipTrigger>
															<TooltipContent
																side="left"
																sideOffset={5}
																className="max-w-[10rem]"
															>
																<p>
																	Cache: اگر قبلاً این کامپوز را مستقر کرده‌اید، سرویس‌ها را از آخرین دیپلویمنت/بارگذاری از مخزن می‌خواند
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>

												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="host"
									render={({ field }) => (
										<FormItem>
											<FormLabel>هاست</FormLabel>
											<div className="flex gap-2">
												<FormControl>
													<Input dir="ltr" placeholder="api.dokploy.com" {...field} />
												</FormControl>
												<TooltipProvider delayDuration={0}>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="secondary"
																type="button"
																isLoading={isLoadingGenerate}
																onClick={() => {
																	generateDomain({
																		serverId: compose?.serverId || "",
																		appName: compose?.appName || "",
																	})
																		.then((domain) => {
																			field.onChange(domain);
																		})
																		.catch((err) => {
																			toast.error(err.message);
																		});
																}}
															>
																<Dices className="size-4 text-muted-foreground" />
															</Button>
														</TooltipTrigger>
														<TooltipContent
															side="left"
															sideOffset={5}
															className="max-w-[10rem]"
														>
															<p>تولید دامنه traefik.me</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="path"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>مسیر</FormLabel>
												<FormControl>
													<Input dir="ltr" placeholder={"/"} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>

								<FormField
									control={form.control}
									name="port"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>پورت کانتینر</FormLabel>
												<FormControl>
													<NumberInput placeholder={"3000"} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>

								<FormField
									control={form.control}
									name="https"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between p-3 mt-4 border rounded-lg shadow-sm">
											<div className="space-y-0.5">
												<FormLabel>HTTPS</FormLabel>
												<FormDescription>
													صدور خودکار گواهی SSL.
												</FormDescription>
												<FormMessage />
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

								{https && (
									<FormField
										control={form.control}
										name="certificateType"
										render={({ field }) => (
											<FormItem className="col-span-2">
												<FormLabel>ارائه‌دهنده گواهی</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value || ""}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="انتخاب ارائه‌دهنده گواهی" />
														</SelectTrigger>
													</FormControl>

													<SelectContent>
														<SelectItem value="none">هیچ‌کدام</SelectItem>
														<SelectItem value={"letsencrypt"}>
															Let's Encrypt
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</div>
						</div>
					</form>

					<DialogFooter>
						<Button
							isLoading={form.formState.isSubmitting}
							form="hook-form"
							type="submit"
						>
							{dictionary.submit}
						</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	);
};