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
	postgresId: string;
	appName: string;
}

export const ResetPostgres = ({ postgresId, appName }: Props) => {
	const { refetch } = api.postgres.one.useQuery(
		{
			postgresId,
		},
		{ enabled: !!postgresId },
	);
	const { mutateAsync: reload, isLoading } = api.postgres.reload.useMutation();

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
								postgresId,
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
