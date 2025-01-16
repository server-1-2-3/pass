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
	postgresId: string;
}

export const DeployPostgres = ({ postgresId }: Props) => {
	const { data, refetch } = api.postgres.one.useQuery(
		{
			postgresId,
		},
		{ enabled: !!postgresId },
	);
	const { mutateAsync: deploy } = api.postgres.deploy.useMutation();
	const { mutateAsync: changeStatus } = api.postgres.changeStatus.useMutation();

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
						این عمل پایگاه داده PostgreSQL را دیپلویمنت خواهد داد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await changeStatus({
								postgresId,
								applicationStatus: "running",
							})
								.then(async () => {
									toast.success("در حال دیپلویمنت پایگاه داده....");
									await refetch();
									await deploy({
										postgresId,
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
