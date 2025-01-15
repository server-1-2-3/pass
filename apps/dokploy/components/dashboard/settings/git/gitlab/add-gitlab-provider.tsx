import { GitlabIcon } from "@/components/icons/data-tools-icons";
import { AlertBlock } from "@/components/shared/alert-block";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
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
import { useUrl } from "@/utils/hooks/use-url";
import { zodResolver } from "@hookform/resolvers/zod";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const Schema = z.object({
	name: z.string().min(1, {
		message: "Name is required",
	}),
	gitlabUrl: z.string().min(1, {
		message: "GitLab URL is required",
	}),
	applicationId: z.string().min(1, {
		message: "Application ID is required",
	}),
	applicationSecret: z.string().min(1, {
		message: "Application Secret is required",
	}),

	redirectUri: z.string().min(1, {
		message: "Redirect URI is required",
	}),
	groupName: z.string().optional(),
});

type Schema = z.infer<typeof Schema>;

export const AddGitlabProvider = () => {
	const utils = api.useUtils();
	const [isOpen, setIsOpen] = useState(false);
	const url = useUrl();
	const { data: auth } = api.auth.get.useQuery();
	const { mutateAsync, error, isError } = api.gitlab.create.useMutation();
	const webhookUrl = `${url}/api/providers/gitlab/callback`;

	const form = useForm<Schema>({
		defaultValues: {
			applicationId: "",
			applicationSecret: "",
			groupName: "",
			redirectUri: webhookUrl,
			name: "",
			gitlabUrl: "https://gitlab.com",
		},
		resolver: zodResolver(Schema),
	});

	const gitlabUrl = form.watch("gitlabUrl");

	useEffect(() => {
		form.reset({
			applicationId: "",
			applicationSecret: "",
			groupName: "",
			redirectUri: webhookUrl,
			name: "",
			gitlabUrl: "https://gitlab.com",
		});
	}, [form, isOpen]);

	const onSubmit = async (data: Schema) => {
		await mutateAsync({
			applicationId: data.applicationId || "",
			secret: data.applicationSecret || "",
			groupName: data.groupName || "",
			authId: auth?.id || "",
			name: data.name || "",
			redirectUri: data.redirectUri || "",
			gitlabUrl: data.gitlabUrl || "https://gitlab.com",
		})
			.then(async () => {
				await utils.gitProvider.getAll.invalidate();
				toast.success("GitLab created successfully");
				setIsOpen(false);
			})
			.catch(() => {
				toast.error("Error configuring GitLab");
			});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="default"
					className="flex items-center space-x-1 bg-purple-700 text-white hover:bg-purple-600"
				>
					<span>گیت‌لب</span>
					<GitlabIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl  overflow-y-auto max-h-screen ">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						پروایدر گیت‌لب <GitlabIcon className="size-5" />
					</DialogTitle>
				</DialogHeader>

				{isError && <AlertBlock type="error">{error?.message}</AlertBlock>}
				<Form {...form}>
					<form
						id="hook-form-add-gitlab"
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid w-full gap-1"
					>
						<CardContent className="p-0">
							<div className="flex flex-col gap-4">
								<p className="text-muted-foreground text-sm">
									برای اینتگریت کردن گیت‌لب خود باید استپ‌های زیر را دنبال کنید.
								</p>
								<ol className="list-decimal list-inside text-sm text-muted-foreground">
									<li className="flex flex-row gap-2 items-center">
										به پروفایل گیتلب خود بروید{" "}
										<Link
											href={`${gitlabUrl}/-/profile/applications`}
											target="_blank"
										>
											<ExternalLink className="w-fit text-primary size-4" />
										</Link>
									</li>
									<li>به قسمت (Applications) بروید</li>
									<li>
										یک اپلیکیشن با اطلاعات زیر بسازید:
										<ul className="list-disc list-inside ml-4">
											<li>اسم: YekDoSe</li>
											<li>
												ادرس ریدایرکت:{" "}
												<span className="text-primary">{webhookUrl}</span>{" "}
											</li>
											<li>اسکوپ‌های مورد نیاز: api, read_user, read_repository</li>
										</ul>
									</li>
									<li>
										بعد از اضافه کردن، آدرس و اطلاعات دریافتی را در فرم زیر وارد کنید.
									</li>
								</ol>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>اسم</FormLabel>
											<FormControl>
												<Input
													placeholder="خیلی رندم مثل: my-personal-account"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="gitlabUrl"
									render={({ field }) => (
										<FormItem>
											<FormLabel>آدرس گیت‌لب</FormLabel>
											<FormControl>
												<Input placeholder="https://gitlab.com/" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="redirectUri"
									render={({ field }) => (
										<FormItem>
											<FormLabel>آدرس ریدایرکت</FormLabel>
											<FormControl>
												<Input
													disabled
													placeholder="Random Name eg(my-personal-account)"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="applicationId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>آیدی اپلیکیشن</FormLabel>
											<FormControl>
												<Input placeholder="daflkjafiow22" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="applicationSecret"
									render={({ field }) => (
										<FormItem>
											<FormLabel>سکرت اپلیکیشن</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="lkasjfiowjOIfjwj22"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="groupName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>اسم گروه (اختیاری)</FormLabel>
											<FormControl>
												<Input
													placeholder="برای organization/group نیاز به یک اسم مانند: my-org داریم"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button isLoading={form.formState.isSubmitting}>
									کانفیگ گیتلب
								</Button>
							</div>
						</CardContent>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
