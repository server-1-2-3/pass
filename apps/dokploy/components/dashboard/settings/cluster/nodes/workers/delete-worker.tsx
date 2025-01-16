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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import { TrashIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
	nodeId: string;
}
export const DeleteWorker = ({ nodeId }: Props) => {
	const { mutateAsync, isLoading } = api.cluster.removeWorker.useMutation();
	const utils = api.useUtils();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					حذف
				</DropdownMenuItem>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل قابل بازگشت نیست. این کار کارگر (Worker) را به طور دائمی حذف خواهد کرد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await mutateAsync({
								nodeId,
							})
								.then(async () => {
									utils.cluster.getNodes.invalidate();
									toast.success("کارگر با موفقیت حذف شد");
								})
								.catch(() => {
									toast.error("خطا در حذف کارگر");
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
