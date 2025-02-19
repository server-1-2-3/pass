import { AlertBlock } from "@/components/shared/alert-block";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { api } from "@/utils/api";
import { AlertTriangle, Package } from "lucide-react";
import React from "react";
import { AddVolumes } from "../../application/advanced/volumes/add-volumes";
import { DeleteVolume } from "../../application/advanced/volumes/delete-volume";
import { UpdateVolume } from "../../application/advanced/volumes/update-volume";
interface Props {
	mongoId: string;
}

export const ShowVolumes = ({ mongoId }: Props) => {
	const { data, refetch } = api.mongo.one.useQuery(
		{
			mongoId,
		},
		{ enabled: !!mongoId },
	);

	return (
		<Card className="bg-background">
			<CardHeader className="flex flex-row justify-between flex-wrap gap-4">
				<div>
					<CardTitle className="text-xl">حجم‌ها</CardTitle>
					<CardDescription>
						اگر می‌خواهید داده‌ها را در این MongoDB ذخیره کنید، از تنظیمات زیر برای راه‌اندازی حجم‌ها استفاده کنید.
					</CardDescription>
				</div>

				{data && data?.mounts.length > 0 && (
					<AddVolumes serviceId={mongoId} refetch={refetch} serviceType="mongo">
						افزودن حجم
					</AddVolumes>
				)}
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{data?.mounts.length === 0 ? (
					<div className="flex w-full flex-col items-center justify-center gap-3 pt-10">
						<Package className="size-8 text-muted-foreground" />
						<span className="text-base text-muted-foreground">
							هیچ حجم/مونت‌ای تنظیم نشده است
						</span>
						<AddVolumes
							serviceId={mongoId}
							refetch={refetch}
							serviceType="mongo"
						>
							افزودن حجم
						</AddVolumes>
					</div>
				) : (
					<div className="flex flex-col pt-2 gap-4">
						<AlertBlock type="info">
							لطفاً پس از افزودن، ویرایش یا حذف یک مونت، روی دکمه Redeploy کلیک کنید تا تغییرات اعمال شوند.
						</AlertBlock>
						<div className="flex flex-col gap-6">
							{data?.mounts.map((mount) => (
								<div key={mount.mountId}>
									<div
										key={mount.mountId}
										className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-10 border rounded-lg p-4"
									>
										<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 flex-col gap-4 sm:gap-8">
											<div className="flex flex-col gap-1">
												<span className="font-medium">نوع مونت</span>
												<span className="text-sm text-muted-foreground">
													{mount.type.toUpperCase()}
												</span>
											</div>
											{mount.type === "volume" && (
												<div className="flex flex-col gap-1">
													<span className="font-medium">نام حجم</span>
													<span className="text-sm text-muted-foreground">
														{mount.volumeName}
													</span>
												</div>
											)}

											{mount.type === "file" && (
												<div className="flex flex-col gap-1">
													<span className="font-medium">محتوا</span>
													<span className="text-sm text-muted-foreground">
														{mount.content}
													</span>
												</div>
											)}
											{mount.type === "bind" && (
												<div className="flex flex-col gap-1">
													<span className="font-medium">مسیر میزبان</span>
													<span className="text-sm text-muted-foreground">
														{mount.hostPath}
													</span>
												</div>
											)}
											<div className="flex flex-col gap-1">
												<span className="font-medium">مسیر مونت</span>
												<span className="text-sm text-muted-foreground">
													{mount.mountPath}
												</span>
											</div>
										</div>
										<div className="flex flex-row gap-1">
											<UpdateVolume
												mountId={mount.mountId}
												type={mount.type}
												refetch={refetch}
												serviceType="mongo"
											/>
											<DeleteVolume mountId={mount.mountId} refetch={refetch} />
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};