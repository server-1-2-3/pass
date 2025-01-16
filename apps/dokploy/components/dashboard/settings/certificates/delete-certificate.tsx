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
import { TrashIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
	certificateId: string;
}
export const DeleteCertificate = ({ certificateId }: Props) => {
	const { mutateAsync, isLoading } = api.certificates.remove.useMutation();
	const utils = api.useUtils();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" isLoading={isLoading}>
					<TrashIcon className="size-4 text-muted-foreground" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل قابل بازگشت نیست. این کار گواهی را به طور دائمی حذف خواهد کرد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await mutateAsync({
								certificateId,
							})
								.then(async () => {
									utils.certificates.all.invalidate();
									utils.auth.get.invalidate();
									toast.success("گواهی با موفقیت حذف شد");
								})
								.catch(() => {
									toast.error("خطا در حذف گواهی");
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
