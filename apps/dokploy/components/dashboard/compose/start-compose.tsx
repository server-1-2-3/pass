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
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
	composeId: string;
}

export const StartCompose = ({ composeId }: Props) => {
	const { mutateAsync, isLoading } = api.compose.start.useMutation();
	const utils = api.useUtils();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="secondary" isLoading={isLoading}>
					شروع
					<CheckCircle2 className="size-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						آیا از شروع کامپوز مطمئن هستید؟
					</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل کامپوز را شروع خواهد کرد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await mutateAsync({
								composeId,
							})
								.then(async () => {
									await utils.compose.one.invalidate({
										composeId,
									});
									toast.success("کامپوز با موفقیت شروع شد");
								})
								.catch(() => {
									toast.error("خطا در شروع کامپوز");
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
