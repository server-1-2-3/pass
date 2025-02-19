import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import React from "react";

export type TimeFilter = "all" | "1h" | "6h" | "24h" | "168h" | "720h";

const timeRanges: Array<{ label: string; value: TimeFilter }> = [
	{
		label: "همه زمان‌ها",
		value: "all",
	},
	{
		label: "۱ ساعت گذشته",
		value: "1h",
	},
	{
		label: "۶ ساعت گذشته",
		value: "6h",
	},
	{
		label: "۲۴ ساعت گذشته",
		value: "24h",
	},
	{
		label: "۷ روز گذشته",
		value: "168h",
	},
	{
		label: "۳۰ روز گذشته",
		value: "720h",
	},
] as const;

interface SinceLogsFilterProps {
	value: TimeFilter;
	onValueChange: (value: TimeFilter) => void;
	showTimestamp: boolean;
	onTimestampChange: (show: boolean) => void;
	title?: string;
}

export function SinceLogsFilter({
	value,
	onValueChange,
	showTimestamp,
	onTimestampChange,
	title = "بازه زمانی",
}: SinceLogsFilterProps) {
	const selectedLabel =
		timeRanges.find((range) => range.value === value)?.label ??
		"انتخاب بازه زمانی";

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-9 bg-input text-sm placeholder-gray-400 w-full sm:w-auto"
				>
					{title}
					<Separator orientation="vertical" className="mx-2 h-4" />
					<div className="space-x-1 flex">
						<Badge variant="blank" className="rounded-sm px-1 font-normal">
							{selectedLabel}
						</Badge>
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandList>
						<CommandGroup>
							{timeRanges.map((range) => {
								const isSelected = value === range.value;
								return (
									<CommandItem
										key={range.value}
										onSelect={() => {
											if (!isSelected) {
												onValueChange(range.value);
											}
										}}
									>
										<div
											className={cn(
												"ml-2 flex h-4 w-4 items-center rounded-sm border border-primary",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<CheckIcon className={cn("h-4 w-4")} />
										</div>
										<span className="text-sm">{range.label}</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
				<Separator className="my-2" />
				<div className="p-2 flex items-center justify-between">
					<span className="text-sm">نمایش زمان‌ها</span>
					<Switch checked={showTimestamp} onCheckedChange={onTimestampChange} />
				</div>
			</PopoverContent>
		</Popover>
	);
}