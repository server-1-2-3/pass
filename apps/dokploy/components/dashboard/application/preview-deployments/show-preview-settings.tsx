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
import { Secrets } from "@/components/ui/secrets";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
	env: z.string(),
	buildArgs: z.string(),
	wildcardDomain: z.string(),
	port: z.number(),
	previewLimit: z.number(),
	previewHttps: z.boolean(),
	previewPath: z.string(),
	previewCertificateType: z.enum(["letsencrypt", "none"]),
});

type Schema = z.infer<typeof schema>;

interface Props {
	applicationId: string;
}

export const ShowPreviewSettings = ({ applicationId }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isEnabled, setIsEnabled] = useState(false);
	const { mutateAsync: updateApplication, isLoading } =
		api.application.update.useMutation();

	const { data, refetch } = api.application.one.useQuery({ applicationId });

	const form = useForm<Schema>({
		defaultValues: {
			env: "",
			wildcardDomain: "*.traefik.me",
			port: 3000,
			previewLimit: 3,
			previewHttps: false,
			previewPath: "/",
			previewCertificateType: "none",
		},
		resolver: zodResolver(schema),
	});

	const previewHttps = form.watch("previewHttps");

	useEffect(() => {
		setIsEnabled(data?.isPreviewDeploymentsActive || false);
	}, [data?.isPreviewDeploymentsActive]);

	useEffect(() => {
		if (data) {
			form.reset({
				env: data.previewEnv || "",
				buildArgs: data.previewBuildArgs || "",
				wildcardDomain: data.previewWildcard || "*.traefik.me",
				port: data.previewPort || 3000,
				previewLimit: data.previewLimit || 3,
				previewHttps: data.previewHttps || false,
				previewPath: data.previewPath || "/",
				previewCertificateType: data.previewCertificateType || "none",
			});
		}
	}, [data]);

	const onSubmit = async (formData: Schema) => {
		updateApplication({
			previewEnv: formData.env,
			previewBuildArgs: formData.buildArgs,
			previewWildcard: formData.wildcardDomain,
			previewPort: formData.port,
			applicationId,
			previewLimit: formData.previewLimit,
			previewHttps: formData.previewHttps,
			previewPath: formData.previewPath,
			previewCertificateType: formData.previewCertificateType,
		})
			.then(() => {
				toast.success("Preview Deployments settings updated");
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};
	return (
		<div>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button variant="outline">
						<Settings2 className="size-4" />
						پیکربندی
					</Button>
				</DialogTrigger>
				<DialogContent className="max-h-screen overflow-y-auto sm:max-w-5xl w-full">
					<DialogHeader>
						<DialogTitle>پیش‌نمایش تنظیمات دیپلویمنت</DialogTitle>
						<DialogDescription>
							تنظیمات مربوط به پیش‌نمایش دیپلویمنت این برنامه، شامل متغیرهای محیطی، گزینه‌های ساخت و قوانین دیپلویمنت را تنظیم کنید.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								id="hook-form-delete-application"
								className="grid w-full gap-4"
							>
								<div className="grid gap-4 lg:grid-cols-2">
									<FormField
										control={form.control}
										name="wildcardDomain"
										render={({ field }) => (
											<FormItem>
												<FormLabel>دامنه Wildcard</FormLabel>
												<FormControl>
													<Input placeholder="*.traefik.me" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="previewPath"
										render={({ field }) => (
											<FormItem>
												<FormLabel>مسیر پیش‌نمایش</FormLabel>
												<FormControl>
													<Input placeholder="/" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="port"
										render={({ field }) => (
											<FormItem>
												<FormLabel>پورت</FormLabel>
												<FormControl>
													<NumberInput placeholder="3000" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="previewLimit"
										render={({ field }) => (
											<FormItem>
												<FormLabel>محدودیت پیش‌نمایش</FormLabel>
												<FormControl>
													<NumberInput placeholder="3000" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="previewHttps"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between p-3 mt-4 border rounded-lg shadow-sm">
												<div className="space-y-0.5">
													<FormLabel>HTTPS</FormLabel>
													<FormDescription>
														به طور خودکار گواهی SSL صادر کنید.
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
									{previewHttps && (
										<FormField
											control={form.control}
											name="previewCertificateType"
											render={({ field }) => (
												<FormItem>
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
								<div className="grid gap-4 lg:grid-cols-2">
									<div className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-2">
										<div className="space-y-0.5">
											<FormLabel className="text-base">
												فعال‌سازی دیپلویمنت‌های پیش‌نمایش
											</FormLabel>
											<FormDescription>
												دیپلویمنت‌های پیش‌نمایش را برای این برنامه فعال یا غیرفعال کنید.
											</FormDescription>
										</div>
										<Switch
											checked={isEnabled}
											onCheckedChange={(checked) => {
												updateApplication({
													isPreviewDeploymentsActive: checked,
													applicationId,
												})
													.then(() => {
														refetch();
														toast.success("دیپلویمنت‌های پیش‌نمایش فعال شدند");
													})
													.catch((error) => {
														toast.error(error.message);
													});
											}}
										/>
									</div>
								</div>

								<FormField
									control={form.control}
									name="env"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Secrets
													name="env"
													title="تنظیمات محیطی"
													description="می‌توانید متغیرهای محیطی را به منبع خود اضافه کنید."
													placeholder={["NODE_ENV=production", "PORT=3000"].join("\n")}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{data?.buildType === "dockerfile" && (
									<Secrets
										name="buildArgs"
										title="متغیرهای زمان ساخت"
										description={
											<span>
												فقط در زمان ساخت در دسترس هستند. مستندات را ببینید&nbsp;
												<a
													className="text-primary"
													href="https://docs.docker.com/build/guide/build-args/"
													target="_blank"
													rel="noopener noreferrer"
												>
													اینجا
												</a>
												.
											</span>
										}
										placeholder="NPM_TOKEN=xyz"
									/>
								)}
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
							form="hook-form-delete-application"
							type="submit"
						>
							ذخیره
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
