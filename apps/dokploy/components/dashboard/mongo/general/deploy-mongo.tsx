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
	mongoId: string;
}

export const DeployMongo = ({ mongoId }: Props) => {
	const { data, refetch } = api.mongo.one.useQuery(
		{
			mongoId,
		},
		{ enabled: !!mongoId },
	);
	const { mutateAsync: deploy } = api.mongo.deploy.useMutation();
	const { mutateAsync: changeStatus } = api.mongo.changeStatus.useMutation();

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
						این عمل پایگاه داده MongoDB را دیپلویمنت خواهد داد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await changeStatus({
								mongoId,
								applicationStatus: "running",
							})
								.then(async () => {
									toast.success("در حال دیپلویمنت پایگاه داده....");
									await refetch();
									await deploy({
										mongoId,
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
