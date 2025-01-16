import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/utils/api";
import { InfoIcon, TrashIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
	gitProviderId: string;
	gitProviderType: "github" | "gitlab" | "bitbucket";
}

export const RemoveGitProvider = ({
	gitProviderId,
	gitProviderType,
}: Props) => {
	const utils = api.useUtils();
	const { mutateAsync } = api.gitProvider.remove.useMutation();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="ghost">
					<TrashIcon className="size-4 text-muted-destructive" />
					{gitProviderType === "github" && (
						<TooltipProvider delayDuration={0}>
							<Tooltip>
								<TooltipTrigger asChild>
									<InfoIcon className="size-4 fill-muted-destructive text-muted-destructive" />
								</TooltipTrigger>
								<TooltipContent>
									توصیه می‌کنیم ابتدا برنامه GitHub را حذف کنید، سپس از اینجا آن را حذف کنید.
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل قابل بازگشت نیست. این کار برنامه مرتبط با GitHub را به طور دائمی حذف خواهد کرد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await mutateAsync({
								gitProviderId: gitProviderId,
							})
								.then(async () => {
									utils.gitProvider.getAll.invalidate();
									toast.success("ارائه‌دهنده Git با موفقیت حذف شد.");
								})
								.catch(() => {
									toast.error("خطا در حذف ارائه‌دهنده Git.");
								});
						}}
					>
						تأیید
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
