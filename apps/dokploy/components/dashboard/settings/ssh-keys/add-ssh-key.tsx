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
import { sshKeyCreate, type sshKeyType } from "@/server/db/validations";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useState } from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type SSHKey = z.infer<typeof sshKeyCreate>;

interface Props {
	children: ReactNode;
}

export const AddSSHKey = ({ children }: Props) => {
	const utils = api.useUtils();

	const [isOpen, setIsOpen] = useState(false);

	const { mutateAsync, isError, error, isLoading } =
		api.sshKey.create.useMutation();

	const generateMutation = api.sshKey.generate.useMutation();

	const form = useForm<SSHKey>({
		resolver: zodResolver(sshKeyCreate),
	});

	const onSubmit = async (data: SSHKey) => {
		await mutateAsync(data)
			.then(async () => {
				toast.success("SSH key created successfully");
				await utils.sshKey.all.invalidate();
				/*
					Flushsync is needed for a bug witht he react-hook-form reset method
					https://github.com/orgs/react-hook-form/discussions/7589#discussioncomment-10060621
				*/
				flushSync(() => form.reset());
				setIsOpen(false);
			})
			.catch(() => {
				toast.error("Error creating the SSH key");
			});
	};

	const onGenerateSSHKey = (type: z.infer<typeof sshKeyType>) =>
		generateMutation
			.mutateAsync(type)
			.then(async (data) => {
				toast.success("SSH Key Generated");
				form.setValue("privateKey", data.privateKey);
				form.setValue("publicKey", data.publicKey);
			})
			.catch(() => {
				toast.error("Error generating the SSH Key");
			});

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className="" asChild>
				{children}
			</DialogTrigger>
			<DialogContent className="max-h-screen  overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>کلید SSH جدید</DialogTitle>
					<DialogDescription className="space-y-4">
						<div>
							در این قسمت شما میتوانید کلید‌های SSH خود را تعریف کنید.
						</div>
						<div className="flex gap-4">
							<Button
								variant={"secondary"}
								disabled={generateMutation.isLoading}
								className="max-sm:w-full"
								onClick={() =>
									onGenerateSSHKey({
										type: "rsa",
									})
								}
								type="button"
							>
								تولید کلید RSA SSH 
							</Button>
							<Button
								variant={"secondary"}
								disabled={generateMutation.isLoading}
								className="max-sm:w-full"
								onClick={() =>
									onGenerateSSHKey({
										type: "ed25519",
									})
								}
								type="button"
							>
								تولید کلید ED25519 SSH 
							</Button>
						</div>
					</DialogDescription>
				</DialogHeader>
				{isError && <AlertBlock type="error">{error?.message}</AlertBlock>}

				<Form {...form}>
					<form
						className="grid w-full gap-4 "
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>اسم:</FormLabel>
										<FormControl>
											<Input placeholder={"پروژه‌های شخصی"} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>توضیحات:</FormLabel>
										<FormControl>
											<Input
												placeholder={"Used on my personal Hetzner VPS"}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="privateKey"
							render={({ field }) => (
								<FormItem>
									<div className="space-y-0.5">
										<FormLabel>کلید شخصی (Private Key)</FormLabel>
									</div>
									<FormControl>
										<Textarea
											placeholder={"-----BEGIN RSA PRIVATE KEY-----"}
											rows={5}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="publicKey"
							render={({ field }) => (
								<FormItem>
									<div className="space-y-0.5">
										<FormLabel>کلید پابلیک (Public Key)</FormLabel>
									</div>
									<FormControl>
										<Input placeholder={"ssh-rsa AAAAB3NzaC1yc2E"} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button isLoading={isLoading} type="submit">
								ساختن
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
