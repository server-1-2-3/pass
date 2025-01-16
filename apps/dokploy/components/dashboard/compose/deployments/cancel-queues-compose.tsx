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
import { Paintbrush } from "lucide-react";
import { toast } from "sonner";

interface Props {
	composeId: string;
}

export const CancelQueuesCompose = ({ composeId }: Props) => {
	const { mutateAsync, isLoading } = api.compose.cleanQueues.useMutation();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className="w-fit" isLoading={isLoading}>
					لغو صف‌ها
					<Paintbrush className="size-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						آیا مطمئن هستید که می‌خواهید دیپلویمنت در حال ورود را لغو کنید؟
					</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل تمام دیپلویمنت‌های در حال ورود را لغو خواهد کرد.
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
									toast.success("صف‌ها در حال پاک‌سازی هستند");
								})
								.catch((err) => {
									toast.error(err.message);
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
