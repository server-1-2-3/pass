import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { Logo } from "../shared/logo";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import type { IUpdateData } from "@dokploy/server/index";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UpdateServer from "../dashboard/settings/web-server/update-server";

const AUTO_CHECK_UPDATES_INTERVAL_MINUTES = 7;

export const Navbar = () => {
	const [updateData, setUpdateData] = useState<IUpdateData>({
		latestVersion: null,
		updateAvailable: false,
	});
	const router = useRouter();
	const { data } = api.auth.get.useQuery();
	const { data: isCloud } = api.settings.isCloud.useQuery();
	const { data: user } = api.user.byAuthId.useQuery(
		{
			authId: data?.id || "",
		},
		{
			enabled: !!data?.id && data?.rol === "user",
		},
	);
	const { mutateAsync } = api.auth.logout.useMutation();
	const { mutateAsync: getUpdateData } =
		api.settings.getUpdateData.useMutation();

	const checkUpdatesIntervalRef = useRef<null | NodeJS.Timeout>(null);

	useEffect(() => {
		// Handling of automatic check for server updates
		if (isCloud) {
			return;
		}

		if (!localStorage.getItem("enableAutoCheckUpdates")) {
			// Enable auto update checking by default if user didn't change it
			localStorage.setItem("enableAutoCheckUpdates", "true");
		}

		const clearUpdatesInterval = () => {
			if (checkUpdatesIntervalRef.current) {
				clearInterval(checkUpdatesIntervalRef.current);
			}
		};

		const checkUpdates = async () => {
			try {
				if (localStorage.getItem("enableAutoCheckUpdates") !== "true") {
					return;
				}

				const fetchedUpdateData = await getUpdateData();

				if (fetchedUpdateData?.updateAvailable) {
					// Stop interval when update is available
					clearUpdatesInterval();
					setUpdateData(fetchedUpdateData);
				}
			} catch (error) {
				console.error("Error auto-checking for updates:", error);
			}
		};

		checkUpdatesIntervalRef.current = setInterval(
			checkUpdates,
			AUTO_CHECK_UPDATES_INTERVAL_MINUTES * 60000,
		);

		// Also check for updates on initial page load
		checkUpdates();

		return () => {
			clearUpdatesInterval();
		};
	}, []);

	return (
		<nav className="border-divider sticky inset-x-0 top-0 z-40 flex h-auto w-full items-center justify-center border-b bg-background/70 backdrop-blur-lg backdrop-saturate-150 data-[menu-open=true]:border-none data-[menu-open=true]:backdrop-blur-xl">
			<header className="relative z-40 flex w-full max-w-8xl flex-row flex-nowrap items-center justify-between gap-4 px-4 sm:px-6 h-16">
				<div className="text-medium box-border flex flex-grow basis-0 flex-row flex-nowrap items-center justify-start whitespace-nowrap bg-transparent no-underline">
					<Link
						href="/dashboard/projects"
						className={cn("flex flex-row items-center gap-2")}
					>
						<Logo />
						<span className="text-sm font-semibold text-primary max-sm:hidden">
							سرویس کلود یک، دو، سه
						</span>
					</Link>
				</div>
				{updateData.updateAvailable && (
					<div>
						<UpdateServer updateData={updateData} />
					</div>
				)}
				<ul
					className="ml-auto flex h-12 max-w-fit flex-row flex-nowrap items-center gap-0 data-[justify=end]:flex-grow data-[justify=start]:flex-grow data-[justify=end]:basis-0 data-[justify=start]:basis-0 data-[justify=start]:justify-start data-[justify=end]:justify-end data-[justify=center]:justify-center"
					data-justify="end"
				>
					<li className="text-medium mr-2 box-border hidden list-none whitespace-nowrap data-[active=true]:font-semibold data-[active=true]:text-primary lg:flex">
						{/* <Badge>PRO</Badge> */}
					</li>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className="size-10 cursor-pointer border border-border items-center">
								<AvatarImage src={data?.image || ""} alt="@shadcn" />
								<AvatarFallback>
									{data?.email
										?.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end">
							<DropdownMenuLabel className="flex flex-col">
								حساب من
								<span className="text-xs font-normal text-muted-foreground">
									{data?.email}
								</span>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => {
										router.push("/dashboard/projects");
									}}
								>
									پروژه‌ها
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => {
										router.push("/dashboard/monitoring");
									}}
								>
									مانیتورینگ
								</DropdownMenuItem>
								{(data?.rol === "admin" || user?.canAccessToTraefikFiles) && (
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={() => {
											router.push("/dashboard/traefik");
										}}
									>
										Traefik
									</DropdownMenuItem>
								)}
								{(data?.rol === "admin" || user?.canAccessToDocker) && (
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={() => {
											router.push("/dashboard/docker", undefined, {
												shallow: true,
											});
										}}
									>
										Docker
									</DropdownMenuItem>
								)}

								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => {
										router.push("/dashboard/settings/server");
									}}
								>
									تنظیمات
								</DropdownMenuItem>
							</DropdownMenuGroup>
							{isCloud && data?.rol === "admin" && (
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => {
										router.push("/dashboard/settings/billing");
									}}
								>
									صورتحساب
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={async () => {
									await mutateAsync().then(() => {
										router.push("/");
									});
								}}
							>
								خروج
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ul>
			</header>
		</nav>
	);
};
