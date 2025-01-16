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
import { toast } from "sonner";

export const Disable2FA = () => {
	const utils = api.useUtils();
	const { mutateAsync, isLoading } = api.auth.disable2FA.useMutation();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" isLoading={isLoading}>
					غیرفعال‌سازی 2FA
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل قابل بازگشت نیست. این کار 2FA را به طور دائمی غیرفعال خواهد کرد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await mutateAsync()
								.then(() => {
									utils.auth.get.invalidate();
									toast.success("2FA غیرفعال شد");
								})
								.catch(() => {
									toast.error("خطا در غیرفعال‌سازی 2FA");
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
