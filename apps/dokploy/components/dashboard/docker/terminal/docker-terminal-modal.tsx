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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
import { useState } from "react";

const Terminal = dynamic(
	() => import("./docker-terminal").then((e) => e.DockerTerminal),
	{
		ssr: false,
	},
);

interface Props {
	containerId: string;
	serverId?: string;
	children?: React.ReactNode;
}

export const DockerTerminalModal = ({
	children,
	containerId,
	serverId,
}: Props) => {
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
	return (
		<Dialog open={mainDialogOpen} onOpenChange={handleMainDialogOpenChange}>
			<DialogTrigger asChild>
				<DropdownMenuItem
					className="w-full cursor-pointer space-x-3"
					onSelect={(e) => e.preventDefault()}
				>
					{children}
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent
				className="max-h-screen  overflow-y-auto sm:max-w-7xl"
				onEscapeKeyDown={(event) => event.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>ترمینال Docker</DialogTitle>
					<DialogDescription>
						راه آسان برای دسترسی به کانتینر Docker
					</DialogDescription>
				</DialogHeader>

				<Terminal
					id="terminal"
					containerId={containerId}
					serverId={serverId || ""}
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