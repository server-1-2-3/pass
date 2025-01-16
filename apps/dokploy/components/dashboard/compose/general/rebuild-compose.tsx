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
import { Hammer } from "lucide-react";
import { toast } from "sonner";

interface Props {
	composeId: string;
}

export const RedbuildCompose = ({ composeId }: Props) => {
	const { data } = api.compose.one.useQuery(
		{
			composeId,
		},
		{ enabled: !!composeId },
	);
	const { mutateAsync } = api.compose.redeploy.useMutation();
	const utils = api.useUtils();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="secondary"
					isLoading={data?.composeStatus === "running"}
				>
					بازسازی
					<Hammer className="size-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						آیا از بازسازی کامپوز مطمئن هستید؟
					</AlertDialogTitle>
					<AlertDialogDescription>
						برای استفاده مجدد از همان کد، حداقل یک بار باید دیپلویمنت انجام شود.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							toast.success("در حال دیپلویمنت مجدد کامپوز....");
							await mutateAsync({
								composeId,
							})
								.then(async () => {
									await utils.compose.one.invalidate({
										composeId,
									});
								})
								.catch(() => {
									toast.error("خطا در بازسازی کامپوز");
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
