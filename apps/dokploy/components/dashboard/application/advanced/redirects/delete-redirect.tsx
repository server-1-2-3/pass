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
import { toast } from "sonner";

interface Props {
	redirectId: string;
}

export const DeleteRedirect = ({ redirectId }: Props) => {
	const utils = api.useUtils();
	const { mutateAsync, isLoading } = api.redirects.delete.useMutation();
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
						این عمل قابل بازگشت نیست. این کار ریدایرکت را به طور دائمی حذف خواهد کرد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await mutateAsync({
								redirectId,
							})
								.then((data) => {
									utils.application.one.invalidate({
										applicationId: data?.applicationId,
									});
									utils.application.readTraefikConfig.invalidate({
										applicationId: data?.applicationId,
									});
									toast.success("ریدایرکت با موفقیت حذف شد");
								})
								.catch(() => {
									toast.error("خطا در حذف ریدایرکت");
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
