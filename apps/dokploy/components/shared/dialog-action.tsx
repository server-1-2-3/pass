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

interface Props {
	title?: string | React.ReactNode;
	description?: string | React.ReactNode;
	onClick: () => void;
	children?: React.ReactNode;
	disabled?: boolean;
}

export const DialogAction = ({
	onClick,
	children,
	description,
	title,
	disabled,
}: Props) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{title ?? "آیا مطمئن هستید؟"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{description ?? "این عمل قابل بازگشت نیست."}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>لغو</AlertDialogCancel>
					<AlertDialogAction disabled={disabled} onClick={onClick}>
						تأیید
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
