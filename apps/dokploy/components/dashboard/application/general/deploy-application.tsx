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
import { useRouter } from "next/router";
import { toast } from "sonner";

interface Props {
	applicationId: string;
}

export const DeployApplication = ({ applicationId }: Props) => {
	const router = useRouter();
	const { data, refetch } = api.application.one.useQuery(
		{
			applicationId,
		},
		{ enabled: !!applicationId },
	);

	const { mutateAsync: deploy } = api.application.deploy.useMutation();

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
						این عمل برنامه را دیپلویمنت خواهد داد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							await deploy({
								applicationId,
							})
								.then(async () => {
									toast.success("برنامه با موفقیت دیپلویمنت یافت");
									await refetch();
									router.push(
										`/dashboard/project/${data?.projectId}/services/application/${applicationId}?tab=deployments`,
									);
								})

								.catch(() => {
									toast.error("خطا در دیپلویمنت برنامه");
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
