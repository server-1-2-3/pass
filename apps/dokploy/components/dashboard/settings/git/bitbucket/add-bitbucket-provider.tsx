import {
	BitbucketIcon,
	GithubIcon,
	GitlabIcon,
} from "@/components/icons/data-tools-icons";
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const Schema = z.object({
	name: z.string().min(1, {
		message: "Name is required",
	}),
	username: z.string().min(1, {
		message: "Username is required",
	}),
	password: z.string().min(1, {
		message: "App Password is required",
	}),
	workspaceName: z.string().optional(),
});

type Schema = z.infer<typeof Schema>;

export const AddBitbucketProvider = () => {
	const utils = api.useUtils();
	const [isOpen, setIsOpen] = useState(false);
	const url = useUrl();
	const { mutateAsync, error, isError } = api.bitbucket.create.useMutation();
	const { data: auth } = api.auth.get.useQuery();
	const router = useRouter();
	const form = useForm<Schema>({
		defaultValues: {
			username: "",
			password: "",
			workspaceName: "",
		},
		resolver: zodResolver(Schema),
	});

	useEffect(() => {
		form.reset({
			username: "",
			password: "",
			workspaceName: "",
		});
	}, [form, isOpen]);

	const onSubmit = async (data: Schema) => {
		await mutateAsync({
			bitbucketUsername: data.username,
			appPassword: data.password,
			bitbucketWorkspaceName: data.workspaceName || "",
			authId: auth?.id || "",
			name: data.name || "",
		})
			.then(async () => {
				await utils.gitProvider.getAll.invalidate();
				toast.success("Bitbucket configured successfully");
				setIsOpen(false);
			})
			.catch(() => {
				toast.error("Error configuring Bitbucket");
			});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					className="flex items-center space-x-1 bg-blue-700 text-white hover:bg-blue-600"
				>
					<span>بیت‌باکت</span>
					<BitbucketIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl  overflow-y-auto max-h-screen">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						پروایدر بیت‌باکت <BitbucketIcon className="size-5" />
					</DialogTitle>
				</DialogHeader>

				{isError && <AlertBlock type="error">{error?.message}</AlertBlock>}
				<Form {...form}>
					<form
						id="hook-form-add-bitbucket"
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid w-full gap-1"
					>
						<CardContent className="p-0">
							<div className="flex flex-col gap-4">
								<p className="text-muted-foreground text-sm">
									برای اینتگریت کردن بیت باکت، مراحل زیر را انجام دهید:
								</p>
								<ol className="list-decimal list-inside text-sm text-muted-foreground">
									<li className="flex flex-row gap-2 items-center">
										یک اپلیکیشن بسازید{" "}
										<Link
											href="https://bitbucket.org/account/settings/app-passwords/new"
											target="_blank"
										>
											<ExternalLink className="w-fit text-primary size-4" />
										</Link>
									</li>
									<li>
										در زمان ساخت رمز عبور، مطمئن شوید که دسترسی های زیر را به اپلیکیشن بدهید:
										<ul className="list-disc list-inside ml-4">
											<li>Account: Read</li>
											<li>Workspace membership: Read</li>
											<li>Projects: Read</li>
											<li>Repositories: Read</li>
											<li>Pull requests: Read</li>
											<li>Webhooks: Read and write</li>
										</ul>
									</li>
									<li>
										بعد از انجام مراحل، رمز عبور خود را کپی کنید و همراه با اطلاعات دیگر اینجا وارد کنید.
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
													placeholder="اسم رندوم my-personal-account"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>نام کاربری بیت‌باکت</FormLabel>
											<FormControl>
												<Input
													placeholder="ghazanfar"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>رمز عبور اپلیکیشن</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="ATBBPDYUC94nR96Nj7Cqpp4pfwKk03573DD2"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="workspaceName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>اسم ورک اسپیس (اختیاری)</FormLabel>
											<FormControl>
												<Input
													placeholder="برای اکانت‌های شرکتی‌ (Organization) "
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button isLoading={form.formState.isSubmitting}>
									اضافه کردن بیت باکت
								</Button>
							</div>
						</CardContent>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
