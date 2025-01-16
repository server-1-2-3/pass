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
import { api } from "@/utils/api";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
	notificationId: string;
}
export const DeleteNotification = ({ notificationId }: Props) => {
	const { mutateAsync, isLoading } = api.notification.remove.useMutation();
	const utils = api.useUtils();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-9 w-9 group hover:bg-red-500/10"
					isLoading={isLoading}
				>
					<Trash2 className="size-4 text-muted-foreground group-hover:text-red-500" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل قابل بازگشت نیست. این کار اعلان را به طور دائمی حذف خواهد کرد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await mutateAsync({
								notificationId,
							})
								.then(() => {
									utils.notification.all.invalidate();
									toast.success("اعلان با موفقیت حذف شد");
								})
								.catch(() => {
									toast.error("خطا در حذف اعلان");
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
