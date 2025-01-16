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

interface Props {
	redisId: string;
}

export const DeployRedis = ({ redisId }: Props) => {
	const { data, refetch } = api.redis.one.useQuery(
		{
			redisId,
		},
		{ enabled: !!redisId },
	);
	const { mutateAsync: deploy } = api.redis.deploy.useMutation();
	const { mutateAsync: changeStatus } = api.redis.changeStatus.useMutation();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button isLoading={data?.applicationStatus === "running"}>
					دیپلویمنت
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل پایگاه داده Redis را دیپلویمنت خواهد داد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await changeStatus({
								redisId,
								applicationStatus: "running",
							})
								.then(async () => {
									toast.success("در حال دیپلویمنت پایگاه داده...");
									await refetch();
									await deploy({
										redisId,
									}).catch(() => {
										toast.error("خطا در دیپلویمنت پایگاه داده");
									});
									await refetch();
								})
								.catch((e) => {
									toast.error(e.message || "خطا در دیپلویمنت پایگاه داده");
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
