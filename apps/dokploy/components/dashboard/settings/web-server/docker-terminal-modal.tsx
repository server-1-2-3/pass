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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import type React from "react";
import { useEffect, useState } from "react";

const Terminal = dynamic(
	() =>
		import("@/components/dashboard/docker/terminal/docker-terminal").then(
			(e) => e.DockerTerminal,
		),
	{
		ssr: false,
	},
);

interface Props {
	appName: string;
	children?: React.ReactNode;
	serverId?: string;
}

export const DockerTerminalModal = ({ children, appName, serverId }: Props) => {
	const { data, isLoading } = api.docker.getContainersByAppNameMatch.useQuery(
		{
			appName,
			serverId,
		},
		{
			enabled: !!appName,
		},
	);
	const [containerId, setContainerId] = useState<string | undefined>();
	const [mainDialogOpen, setMainDialogOpen] = useState(false);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	const handleMainDialogOpenChange = (open: boolean) => {
		if (!open) {
			setConfirmDialogOpen(true);
		} else {
			setMainDialogOpen(true);
		}
	};

	const handleConfirm = () => {
		setConfirmDialogOpen(false);
		setMainDialogOpen(false);
	};

	const handleCancel = () => {
		setConfirmDialogOpen(false);
	};

	useEffect(() => {
		if (data && data?.length > 0) {
			setContainerId(data[0]?.containerId);
		}
	}, [data]);

	return (
		<Dialog open={mainDialogOpen} onOpenChange={handleMainDialogOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className="max-h-[85vh]    overflow-y-auto sm:max-w-7xl"
				onEscapeKeyDown={(event) => event.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>ترمینال Docker</DialogTitle>
					<DialogDescription>
						راه آسان برای دسترسی به کانتینر Docker
					</DialogDescription>
				</DialogHeader>
				<Label>یک کانتینر برای مشاهده لاگ‌ها انتخاب کنید</Label>
				<Select onValueChange={setContainerId} value={containerId}>
					<SelectTrigger>
						{isLoading ? (
							<div className="flex flex-row gap-2 items-center justify-center text-sm text-muted-foreground">
								<span>در حال بارگذاری...</span>
								<Loader2 className="animate-spin size-4" />
							</div>
						) : (
							<SelectValue placeholder="یک کانتینر انتخاب کنید" />
						)}
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{data?.map((container) => (
								<SelectItem
									key={container.containerId}
									value={container.containerId}
								>
									{container.name} ({container.containerId}) {container.state}
								</SelectItem>
							))}
							<SelectLabel>کانتینرها ({data?.length})</SelectLabel>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Terminal
					serverId={serverId || ""}
					id="terminal"
					containerId={containerId || "select-a-container"}
				/>
				<Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
					<DialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
						<DialogHeader>
							<DialogTitle>
								آیا مطمئن هستید که می‌خواهید ترمینال را ببندید؟
							</DialogTitle>
							<DialogDescription>
								با کلیک روی دکمه تأیید، ترمینال بسته خواهد شد.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={handleCancel}>
								لغو
							</Button>
							<Button onClick={handleConfirm}>تأیید</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</DialogContent>
		</Dialog>
	);
};