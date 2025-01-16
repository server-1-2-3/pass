import { SaveDockerProvider } from "@/components/dashboard/application/general/generic/save-docker-provider";
import { SaveGitProvider } from "@/components/dashboard/application/general/generic/save-git-provider";
import { SaveGithubProvider } from "@/components/dashboard/application/general/generic/save-github-provider";
import {
	BitbucketIcon,
	DockerIcon,
	GitIcon,
	GithubIcon,
	GitlabIcon,
} from "@/components/icons/data-tools-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { GitBranch, LockIcon, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SaveBitbucketProvider } from "./save-bitbucket-provider";
import { SaveDragNDrop } from "./save-drag-n-drop";
import { SaveGitlabProvider } from "./save-gitlab-provider";

type TabState = "github" | "docker" | "git" | "drop" | "gitlab" | "bitbucket";

interface Props {
	applicationId: string;
}

export const ShowProviderForm = ({ applicationId }: Props) => {
	const { data: githubProviders } = api.github.githubProviders.useQuery();
	const { data: gitlabProviders } = api.gitlab.gitlabProviders.useQuery();
	const { data: bitbucketProviders } =
		api.bitbucket.bitbucketProviders.useQuery();

	const { data: application } = api.application.one.useQuery({ applicationId });
	const [tab, setSab] = useState<TabState>(application?.sourceType || "github");
	return (
		<Card className="group relative w-full bg-transparent">
			<CardHeader>
				<CardTitle className="flex items-start justify-between">
					<div className="flex flex-col gap-2">
						<span className="flex flex-col space-y-0.5">Provider</span>
						<p className="flex items-center text-sm font-normal text-muted-foreground">
							سورس کد خود را انتخاب کنید
						</p>
					</div>
					<div className="hidden space-y-1 text-sm font-normal md:block">
						<GitBranch className="size-6 text-muted-foreground" />
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs
					value={tab}
					className="w-full"
					onValueChange={(e) => {
						setSab(e as TabState);
					}}
				>
					<div className="flex flex-row items-center justify-between  w-full gap-4">
						<TabsList className="md:grid md:w-fit md:grid-cols-7 max-md:overflow-x-scroll justify-start bg-transparent overflow-y-hidden">
							<TabsTrigger
								value="github"
								className="rounded-none border-b-2 gap-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-border"
							>
								گیت‌هاب
								<GithubIcon className="size-4 text-current fill-current" />
							</TabsTrigger>
							<TabsTrigger
								value="gitlab"
								className="rounded-none border-b-2 gap-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-border"
							>
								گیت‌لب
								<GitlabIcon className="size-4 text-current fill-current" />
							</TabsTrigger>
							<TabsTrigger
								value="bitbucket"
								className="rounded-none border-b-2 gap-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-border"
							>
								بیت‌باکت
								<BitbucketIcon className="size-4 text-current fill-current" />
							</TabsTrigger>
							<TabsTrigger
								value="docker"
								className="rounded-none border-b-2 gap-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-border"
							>
								داکر
								<DockerIcon className="size-5 text-current" />
							</TabsTrigger>
							<TabsTrigger
								value="git"
								className="rounded-none border-b-2 gap-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-border"
							>
								گیت
								<GitIcon />
							</TabsTrigger>
							<TabsTrigger
								value="drop"
								className="rounded-none border-b-2 gap-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-border"
							>
								دراپ
								<UploadCloud className="size-5 text-current" />
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="github" className="w-full p-2">
						{githubProviders && githubProviders?.length > 0 ? (
							<SaveGithubProvider applicationId={applicationId} />
						) : (
							<div className="flex flex-col items-center gap-3 min-h-[15vh] justify-center">
								<GithubIcon className="size-8 text-muted-foreground" />
								<span className="text-base text-muted-foreground">
									برای دیپلویمنت با استفاده از GitHub، ابتدا باید حساب خود را پیکربندی کنید. لطفاً به {" "}
									<Link href="/dashboard/settings/git-providers" className="text-foreground" > تنظیمات </Link>{" "} بروید تا این کار را انجام دهید.								</span>
							</div>
						)}
					</TabsContent>
					<TabsContent value="gitlab" className="w-full p-2">
						{gitlabProviders && gitlabProviders?.length > 0 ? (
							<SaveGitlabProvider applicationId={applicationId} />
						) : (
							<div className="flex flex-col items-center gap-3 min-h-[15vh] justify-center">
								<GitlabIcon className="size-8 text-muted-foreground" />
								<span className="text-base text-muted-foreground">
									برای دیپلویمنت با استفاده از GitLab، ابتدا باید حساب خود را پیکربندی کنید. لطفاً به {" "}
									<Link
										href="/dashboard/settings/git-providers"
										className="text-foreground"
									>
										تنظیمات
									</Link>{" "}
									بروید تا این کار را انجام دهید.
								</span>
							</div>
						)}
					</TabsContent>
					<TabsContent value="bitbucket" className="w-full p-2">
						{bitbucketProviders && bitbucketProviders?.length > 0 ? (
							<SaveBitbucketProvider applicationId={applicationId} />
						) : (
							<div className="flex flex-col items-center gap-3 min-h-[15vh] justify-center">
								<BitbucketIcon className="size-8 text-muted-foreground" />
								<span className="text-base text-muted-foreground">
									برای دیپلویمنت با استفاده از Bitbucket، ابتدا باید حساب خود را پیکربندی کنید. لطفاً به {" "}
									<Link
										href="/dashboard/settings/git-providers"
										className="text-foreground"
									>
										تنظیمات
									</Link>{" "}
									بروید تا این کار را انجام دهید.
								</span>
							</div>
						)}
					</TabsContent>
					<TabsContent value="docker" className="w-full p-2">
						<SaveDockerProvider applicationId={applicationId} />
					</TabsContent>

					<TabsContent value="git" className="w-full p-2">
						<SaveGitProvider applicationId={applicationId} />
					</TabsContent>
					<TabsContent value="drop" className="w-full p-2">
						<SaveDragNDrop applicationId={applicationId} />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};
