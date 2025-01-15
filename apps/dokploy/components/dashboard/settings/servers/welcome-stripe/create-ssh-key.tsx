import { CodeEditor } from "@/components/shared/code-editor";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/utils/api";
import copy from "copy-to-clipboard";
import { ExternalLinkIcon, Loader2 } from "lucide-react";
import { CopyIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const CreateSSHKey = () => {
	const { data, refetch } = api.sshKey.all.useQuery();
	const generateMutation = api.sshKey.generate.useMutation();
	const { mutateAsync, isLoading } = api.sshKey.create.useMutation();
	const hasCreatedKey = useRef(false);

	const cloudSSHKey = data?.find(
		(sshKey) => sshKey.name === "dokploy-cloud-ssh-key",
	);

	useEffect(() => {
		const createKey = async () => {
			if (!data || cloudSSHKey || hasCreatedKey.current || isLoading) {
				return;
			}

			hasCreatedKey.current = true;

			try {
				const keys = await generateMutation.mutateAsync({
					type: "rsa",
				});
				await mutateAsync({
					name: "dokploy-cloud-ssh-key",
					description: "استفاده شده روی سرویس ابری یک دو سه",
					privateKey: keys.privateKey,
					publicKey: keys.publicKey,
				});
				await refetch();
			} catch (error) {
				console.error("Error creating SSH key:", error);
				hasCreatedKey.current = false;
			}
		};

		createKey();
	}, [data]);

	return (
		<Card className="h-full bg-transparent">
			<CardContent>
				<div className="grid w-full gap-4 pt-4">
					{isLoading || !cloudSSHKey ? (
						<div className="min-h-[25vh] justify-center flex items-center gap-4">
							<Loader2
								className="animate-spin text-muted-foreground"
								size={32}
							/>
						</div>
					) : (
						<>
							<div className="flex flex-col gap-2 text-sm text-muted-foreground">
								<p className="text-primary text-base font-semibold">
									شما دو راه برای اضافه کردن کلید‌ها به سرور خود دارید:
								</p>

								<ul>
									<li>1. اضافه کردن کلید‌ها به صورت دستی.</li>

									<li>
										2. اضافه کردن کلید زمان ساخت سرور سمت سرویس دهنده.{" "}
									</li>
								</ul>

								<div className="flex flex-col gap-2 w-full border rounded-lg p-4">
									<span className="text-base font-semibold text-primary">
										راه اول اول
									</span>
									<ul>
										<li className="items-center flex gap-1">
											1. به سرور خود لاگین کنید{" "}
										</li>
										<li>
											2. بعد از ورود کامند زیر را اجرا کنید
											<div className="flex  relative flex-col gap-4 w-full mt-2">
												<CodeEditor
													lineWrapping
													language="properties"
													value={`echo "${cloudSSHKey?.publicKey}" >> ~/.ssh/authorized_keys`}
													readOnly
													className="font-mono opacity-60"
												/>
												<button
													type="button"
													className="absolute right-2 top-2"
													onClick={() => {
														copy(
															`echo "${cloudSSHKey?.publicKey}" >> ~/.ssh/authorized_keys`,
														);
														toast.success("Copied to clipboard");
													}}
												>
													<CopyIcon className="size-4" />
												</button>
											</div>
										</li>
										<li className="mt-1">
											3. تمام شد. حالا می‌توانید از سرور خود استفاده کنید.
										</li>
									</ul>
								</div>
								{/* <div className="flex flex-col gap-2 w-full mt-2 border rounded-lg p-4">
									<span className="text-base font-semibold text-primary">
										Option 2
									</span>
									<div className="flex flex-col gap-4 w-full overflow-auto">
										<div className="flex relative flex-col gap-2 overflow-y-auto">
											<div className="text-sm text-primary flex flex-row gap-2 items-center">
												Copy Public Key
												<button
													type="button"
													className=" right-2 top-8"
													onClick={() => {
														copy(
															cloudSSHKey?.publicKey || "Generate a SSH Key",
														);
														toast.success("SSH Copied to clipboard");
													}}
												>
													<CopyIcon className="size-4 text-muted-foreground" />
												</button>
											</div>
										</div>
									</div>
									<Link
										href="https://docs.dokploy.com/docs/core/multi-server/instructions#requirements"
										target="_blank"
										className="text-primary flex flex-row gap-2"
									>
										View Tutorial <ExternalLinkIcon className="size-4" />
									</Link>
								</div> */}
							</div>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
