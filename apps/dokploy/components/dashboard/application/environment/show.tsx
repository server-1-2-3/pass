import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Secrets } from "@/components/ui/secrets";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addEnvironmentSchema = z.object({
	env: z.string(),
	buildArgs: z.string(),
});

type EnvironmentSchema = z.infer<typeof addEnvironmentSchema>;

interface Props {
	applicationId: string;
}

export const ShowEnvironment = ({ applicationId }: Props) => {
	const { mutateAsync, isLoading } =
		api.application.saveEnvironment.useMutation();

	const { data, refetch } = api.application.one.useQuery(
		{
			applicationId,
		},
		{
			enabled: !!applicationId,
		},
	);

	const form = useForm<EnvironmentSchema>({
		defaultValues: {
			env: data?.env || "",
			buildArgs: data?.buildArgs || "",
		},
		resolver: zodResolver(addEnvironmentSchema),
	});

	const onSubmit = async (data: EnvironmentSchema) => {
		mutateAsync({
			env: data.env,
			buildArgs: data.buildArgs,
			applicationId,
		})
			.then(async () => {
				toast.success("Environments Added");
				await refetch();
			})
			.catch(() => {
				toast.error("Error adding environment");
			});
	};

	return (
		<Card className="bg-background px-6 pb-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex w-full flex-col gap-4"
				>
					<Secrets
						name="env"
						title="تنظیمات محیطی"
						description="می‌توانید متغیرهای محیطی را به منبع خود اضافه کنید."
						placeholder={["NODE_ENV=production", "PORT=3000"].join("\n")}
					/>
					{data?.buildType === "dockerfile" && (
						<Secrets
							name="buildArgs"
							title="متغیرهای زمان ساخت"
							description={
								<span>
									فقط در زمان ساخت در دسترس هستند. مستندات را ببینید&nbsp;
									<a
										className="text-primary"
										href="https://docs.docker.com/build/guide/build-args/"
										target="_blank"
										rel="noopener noreferrer"
									>
										اینجا
									</a>
									.
								</span>
							}
							placeholder="NPM_TOKEN=xyz"
						/>
					)}
					<div className="flex flex-row justify-end">
						<Button isLoading={isLoading} className="w-fit" type="submit">
							ذخیره
						</Button>
					</div>
				</form>
			</Form>
		</Card>
	);
};
