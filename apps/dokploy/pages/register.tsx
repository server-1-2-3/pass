import { AlertBlock } from "@/components/shared/alert-block";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { IS_CLOUD, isAdminPresent, validateRequest } from "@dokploy/server";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GetServerSidePropsContext } from "next";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z
	.object({
		email: z
			.string()
			.min(1, {
				message: "Email is required",
			})
			.email({
				message: "Email must be a valid email",
			}),
		password: z
			.string()
			.min(1, {
				message: "Password is required",
			})
			.refine((password) => password === "" || password.length >= 8, {
				message: "Password must be at least 8 characters",
			}),
		confirmPassword: z
			.string()
			.min(1, {
				message: "Password is required",
			})
			.refine(
				(confirmPassword) =>
					confirmPassword === "" || confirmPassword.length >= 8,
				{
					message: "Password must be at least 8 characters",
				},
			),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type Register = z.infer<typeof registerSchema>;

interface Props {
	hasAdmin: boolean;
	isCloud: boolean;
}

const Register = ({ isCloud }: Props) => {
	const router = useRouter();
	const { mutateAsync, error, isError, data } =
		api.auth.createAdmin.useMutation();

	const form = useForm<Register>({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(registerSchema),
	});

	useEffect(() => {
		form.reset();
	}, [form, form.reset, form.formState.isSubmitSuccessful]);

	const onSubmit = async (values: Register) => {
		await mutateAsync({
			email: values.email.toLowerCase(),
			password: values.password,
		})
			.then(() => {
				toast.success("User registered successfuly", {
					duration: 2000,
				});
				if (!isCloud) {
					router.push("/");
				}
			})
			.catch((e) => e);
	};
	return (
		<div>
			<div className="flex  h-screen w-full items-center justify-center ">
				<div className="flex flex-col items-center gap-4 w-full">
					<Link
						href="https://dokploy.com"
						target="_blank"
						className="flex flex-row items-center gap-2"
					>
						<Logo />
						<span className="font-medium text-sm">یک، دو، سه</span>
					</Link>

					<CardTitle className="text-2xl font-bold">
						یک حساب کاربری بسازید
					</CardTitle>
					<CardDescription>
						برای ورود، ایمیل و رمز عبور خود را وارد کنید{" "}
					</CardDescription>
					<Card className="mx-auto w-full max-w-lg bg-transparent">
						<div className="p-3" />
						{isError && (
							<div className="mx-5 my-2 flex flex-row items-center gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-950">
								<AlertTriangle className="text-red-600 dark:text-red-400" />
								<span className="text-sm text-red-600 dark:text-red-400">
									{error?.message}
								</span>
							</div>
						)}
						{data?.type === "cloud" && (
							<AlertBlock type="success" className="mx-4 my-2">
								<span>
									Registered successfully, please check your inbox or spam
									folder to confirm your account.
								</span>
							</AlertBlock>
						)}
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="grid gap-4"
								>
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>ایمیل	</FormLabel>
													<FormControl>
														<Input dir="ltr" placeholder="email@dokploy.com" {...field} />
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
													<FormLabel>رمز عبور</FormLabel>
													<FormControl>
														<Input
															dir="ltr"
															type="password"
															placeholder="Password"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="confirmPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>تائید رمز عبور</FormLabel>
													<FormControl>
														<Input
															dir="ltr"
															type="password"
															placeholder="رمز عبور"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Button
											type="submit"
											isLoading={form.formState.isSubmitting}
											className="w-full"
										>
											عضویت
										</Button>
									</div>
								</form>
							</Form>
							<div className="flex flex-row justify-between flex-wrap">
								{isCloud && (
									<div className="mt-4 text-center text-sm flex gap-2">
										اکانت دارید?
										<Link className="underline" href="/">
											ورود
										</Link>
									</div>
								)}

								<div className="mt-4 text-center text-sm flex flex-row justify-center gap-2">
									کمک نیاز دارید?
									<Link
										className="underline"
										href="https://dokploy.com"
										target="_blank"
									>
										با ما تماس بگیرید
									</Link>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Register;
export async function getServerSideProps(context: GetServerSidePropsContext) {
	if (IS_CLOUD) {
		const { user } = await validateRequest(context.req, context.res);

		if (user) {
			return {
				redirect: {
					permanent: true,
					destination: "/dashboard/projects",
				},
			};
		}
		return {
			props: {
				isCloud: true,
			},
		};
	}
	const hasAdmin = await isAdminPresent();

	if (hasAdmin) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		};
	}
	return {
		props: {
			isCloud: false,
		},
	};
}
