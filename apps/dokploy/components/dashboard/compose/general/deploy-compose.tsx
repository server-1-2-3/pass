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
	composeId: string;
}

export const DeployCompose = ({ composeId }: Props) => {
	const router = useRouter();
	const { data, refetch } = api.compose.one.useQuery(
		{
			composeId,
		},
		{ enabled: !!composeId },
	);

	const { mutateAsync: deploy } = api.compose.deploy.useMutation();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button isLoading={data?.composeStatus === "running"}>دیپلویمنت</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
					<AlertDialogDescription>
						این عمل کامپوز را دیپلویمنت خواهد داد.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							toast.success("در حال دیپلویمنت کامپوز....");

							await refetch();
							await deploy({
								composeId,
							})
								.then(async () => {
									router.push(
										`/dashboard/project/${data?.project.projectId}/services/compose/${composeId}?tab=deployments`,
									);
								})
								.catch(() => {
									toast.error("خطا در دیپلویمنت کامپوز");
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
