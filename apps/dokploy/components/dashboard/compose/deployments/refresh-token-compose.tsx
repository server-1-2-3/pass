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
import { api } from "@/utils/api";
import { RefreshCcw } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
	composeId: string;
}
export const RefreshTokenCompose = ({ composeId }: Props) => {
	const { mutateAsync } = api.compose.refreshToken.useMutation();
	const utils = api.useUtils();
	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<RefreshCcw className="h-4 w-4 cursor-pointer text-muted-foreground" />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل قابل بازگشت نیست. این کار توکن را به طور دائمی تغییر می‌دهد و تمام توکن‌های قبلی نامعتبر خواهند شد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await mutateAsync({
								composeId,
							})
								.then(() => {
									utils.compose.one.invalidate({
										composeId,
									});
									toast.success("توکن رفرش با موفقیت به‌روزرسانی شد");
								})
								.catch(() => {
									toast.error("خطا در به‌روزرسانی توکن رفرش");
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
