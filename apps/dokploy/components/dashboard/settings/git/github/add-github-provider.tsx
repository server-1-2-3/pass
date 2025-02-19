import { GithubIcon } from "@/components/icons/data-tools-icons";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { api } from "@/utils/api";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export const AddGithubProvider = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { data } = api.auth.get.useQuery();
	const [manifest, setManifest] = useState("");
	const [isOrganization, setIsOrganization] = useState(false);
	const [organizationName, setOrganization] = useState("");

	useEffect(() => {
		const url = document.location.origin;
		const manifest = JSON.stringify(
			{
				redirect_url: `${origin}/api/providers/github/setup?authId=${data?.id}`,
				name: `Dokploy-${format(new Date(), "yyyy-MM-dd")}`,
				url: origin,
				hook_attributes: {
					url: `${url}/api/deploy/github`,
				},
				callback_urls: [`${origin}/api/providers/github/setup`],
				public: false,
				request_oauth_on_install: true,
				default_permissions: {
					contents: "read",
					metadata: "read",
					emails: "read",
					pull_requests: "write",
				},
				default_events: ["pull_request", "push"],
			},
			null,
			4,
		);

		setManifest(manifest);
	}, [data?.id]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="secondary" className="flex items-center space-x-1">
					<span>گیت‌هاب</span>
					<GithubIcon className="text-current fill-current" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl ">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						پروایدر گیت‌هاب <GithubIcon className="size-5" />
					</DialogTitle>
				</DialogHeader>

				<div id="hook-form-add-project" className="grid w-full gap-1">
					<CardContent className="p-0">
						<div className="flex flex-col ">
							<p className="text-muted-foreground text-sm">
								برای اینتگریت گیت‌هاب با سرویس یک، دو، سه, شما نیاز به تعریف یک اپ با حساب خود در گیت‌هاب دارید.
								مراحل انجام بسیار ساده خواهد بود و فقط یک دقیقه زمان میبرد. 
								روی کلید زیر کلیک کنید تا شروع کنید.
							</p>
							<div className="mt-4 flex flex-col gap-4">
								<div className="flex flex-row gap-4">
									<span>میخواهم یک حساب شرکتی اضافه کنم ؟</span>
									<Switch
										checked={isOrganization}
										onCheckedChange={(checked) => setIsOrganization(checked)}
									/>
								</div>

								{isOrganization && (
									<Input
										required
										placeholder="اسم Organization گیت‌هاب"
										onChange={(e) => setOrganization(e.target.value)}
									/>
								)}
							</div>
							<form
								action={
									isOrganization
										? `https://github.com/organizations/${organizationName}/settings/apps/new?state=gh_init:${data?.id}`
										: `https://github.com/settings/apps/new?state=gh_init:${data?.id}`
								}
								method="post"
							>
								<input
									type="text"
									name="manifest"
									id="manifest"
									defaultValue={manifest}
									className="invisible"
								/>
								<br />

								<div className="flex w-full items-center justify-between">
									<a
										href={
											isOrganization && organizationName
												? `https://github.com/organizations/${organizationName}/settings/installations`
												: "https://github.com/settings/installations"
										}
										className={`text-muted-foreground text-sm hover:underline duration-300
											 ${
													isOrganization && !organizationName
														? "pointer-events-none opacity-50"
														: ""
												}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										مطمئن نیستی که چطوری یه اپ بسازی؟
									</a>
									<Button
										disabled={isOrganization && organizationName.length < 1}
										type="submit"
										className="self-end"
									>
										اضافه کردن
									</Button>
								</div>
							</form>
						</div>
					</CardContent>
				</div>
			</DialogContent>
		</Dialog>
	);
};
