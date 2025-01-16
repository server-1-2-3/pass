import { DeleteSSHKey } from "@/components/dashboard/settings/ssh-keys/delete-ssh-key";
import { AlertBlock } from "@/components/shared/alert-block";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sshKeyUpdate } from "@/server/db/validations";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import copy from "copy-to-clipboard";
import { CopyIcon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type SSHKey = z.infer<typeof sshKeyUpdate>;

interface Props {
    children: ReactNode;
    sshKeyId?: string;
}

export const UpdateSSHKey = ({ children, sshKeyId = "" }: Props) => {
    const utils = api.useUtils();

    const [isOpen, setIsOpen] = useState(false);
    const { data } = api.sshKey.one.useQuery({
        sshKeyId,
    });

    const { mutateAsync, isError, error, isLoading } =
        api.sshKey.update.useMutation();

    const form = useForm<SSHKey>({
        resolver: zodResolver(sshKeyUpdate),
    });

    useEffect(() => {
        if (data) {
            form.reset({
                ...data,
                /* Convert null to undefined */
                description: data.description || undefined,
            });
        }
    }, [data]);

    const onSubmit = async (data: SSHKey) => {
        await mutateAsync({
            sshKeyId,
            ...data,
        })
            .then(async () => {
                toast.success("کلید SSH به‌روزرسانی شد");
                await utils.sshKey.all.invalidate();
                setIsOpen(false);
            })
            .catch(() => {
                toast.error("خطا در به‌روزرسانی کلید SSH");
            });
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="" asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>کلید SSH</DialogTitle>
                    <DialogDescription>
                        در این بخش می‌توانید یک کلید SSH را ویرایش کنید
                    </DialogDescription>
                </DialogHeader>
                {isError && <AlertBlock type="error">{error?.message}</AlertBlock>}

                <Form {...form}>
                    <form
                        className="grid w-full gap-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>نام</FormLabel>
                                        <FormControl>
                                            <Input dir="ltr" placeholder={"پروژه‌های شخصی"} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>توضیحات</FormLabel>
                                        <FormControl>
                                            <Input
																								dir="ltr"
                                                placeholder={"استفاده شده در VPS شخصی Hetzner"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormItem>
                            <FormLabel>کلید عمومی</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Textarea
																				dir="ltr"
                                        rows={7}
                                        readOnly
                                        disabled
                                        value={data?.publicKey}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-2"
                                        onClick={() => {
                                            copy(data?.publicKey || "یک کلید SSH ایجاد کنید");
                                            toast.success("کلید SSH در کلیپ‌بورد کپی شد");
                                        }}
                                    >
                                        <CopyIcon className="size-4" />
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                        <DialogFooter>
                            <Button isLoading={isLoading} type="submit">
                                به‌روزرسانی
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};