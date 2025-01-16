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
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface Props {
	mariadbId: string;
	appName: string;
}

export const ResetMariadb = ({ mariadbId, appName }: Props) => {
	const { refetch } = api.mariadb.one.useQuery(
		{
			mariadbId,
		},
		{ enabled: !!mariadbId },
	);
	const { mutateAsync: reload, isLoading } = api.mariadb.reload.useMutation();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="secondary" isLoading={isLoading}>
					بارگذاری مجدد
					<RefreshCcw className="size-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل سرویس را مجدداً بارگذاری خواهد کرد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await reload({
								mariadbId,
								appName,
							})
								.then(() => {
									toast.success("سرویس با موفقیت بارگذاری مجدد شد");
								})
								.catch(() => {
									toast.error("خطا در بارگذاری مجدد سرویس");
								});
							await refetch();
						}}
					>
						تأیید
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
