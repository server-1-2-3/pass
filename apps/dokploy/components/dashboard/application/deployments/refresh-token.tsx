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
	applicationId: string;
}
export const RefreshToken = ({ applicationId }: Props) => {
	const { mutateAsync } = api.application.refreshToken.useMutation();
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
						این عمل قابل بازگشت نیست. این کار توکن رفرش را تغییر می‌دهد و سایر توکن‌ها نامعتبر خواهند شد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await mutateAsync({
								applicationId,
							})
								.then(() => {
									utils.application.one.invalidate({
										applicationId,
									});
									toast.success("رفرش با موفقیت به‌روزرسانی شد");
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
