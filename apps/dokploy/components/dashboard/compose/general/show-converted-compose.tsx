import { AlertBlock } from "@/components/shared/alert-block";
import { CodeEditor } from "@/components/shared/code-editor";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { Puzzle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
	composeId: string;
}

export const ShowConvertedCompose = ({ composeId }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const {
		data: compose,
		error,
		isError,
		refetch,
	} = api.compose.getConvertedCompose.useQuery(
		{ composeId },
		{
			retry: false,
		},
	);

	const { mutateAsync, isLoading } = api.compose.fetchSourceType.useMutation();

	useEffect(() => {
		if (isOpen) {
			mutateAsync({ composeId })
				.then(() => {
					refetch();
				})
				.catch((err) => { });
		}
	}, [isOpen]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="max-lg:w-full" variant="outline">
					<Puzzle className="h-4 w-4" />
					پیش‌نمایش Compose
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-6xl max-h-[50rem] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Compose تبدیل‌شده</DialogTitle>
					<DialogDescription>
						فایل docker-compose خود را با دامنه‌های اضافه‌شده پیش‌نمایش کنید. توجه: حداقل یک دامنه باید مشخص شود تا این تبدیل انجام شود.
					</DialogDescription>
				</DialogHeader>
				{isError && <AlertBlock type="error">{error?.message}</AlertBlock>}

				<div className="flex flex-row gap-2 justify-end">
					<Button
						variant="secondary"
						isLoading={isLoading}
						onClick={() => {
							mutateAsync({ composeId })
								.then(() => {
									refetch();
									toast.success("نوع منبع با موفقیت دریافت شد");
								})
								.catch((err) => {
									toast.error("خطا در دریافت نوع منبع", {
										description: err.message,
									});
								});
						}}
					>
						بروزرسانی <RefreshCw className="ml-2 h-4 w-4" />
					</Button>
				</div>

				<pre>
					<CodeEditor
						style={{ direction: "ltr" }}

						value={compose || ""}
						language="yaml"
						readOnly
						height="50rem"
					/>
				</pre>
			</DialogContent>
		</Dialog>
	);
};
