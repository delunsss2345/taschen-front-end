"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    AlertCircle,
    Info,
    Send,
    Truck
} from "lucide-react";


const orderItems = [
    {
        id: "1",
        title: "Sách",
        variant: "39G | 24.5 cm",
        qty: 1,
        price: 249500,
        imageUrl:
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=120&q=60",
    }
];

const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + " đ";



export default function CheckoutPage() {
    return (
        <div className="mx-auto w-full max-w-[var(--container-main)] px-6 py-10">
            <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

                <div className="space-y-10">
                    {/* ---- Liên hệ (Contact) ---- */}
                    <section>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Liên hệ</h2>
                            <a
                                href="#"
                                className="text-sm text-blue-600 underline underline-offset-2"
                            >
                                Đăng nhập
                            </a>
                        </div>

                        <div className="mt-4">
                            <Input
                                placeholder="Email (Nhập để theo dõi thông tin đơn hàng)"
                                className="h-12 rounded-md border-zinc-300 text-sm"
                            />
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                            <Checkbox id="newsletter" defaultChecked />
                            <Label htmlFor="newsletter" className="text-sm text-zinc-600">
                                Gửi cho tôi tin tức và ưu đãi qua email
                            </Label>
                        </div>
                    </section>

                    {/* ---- Giao hàng (Shipping) ---- */}
                    <section>
                        <h2 className="text-xl font-semibold">Giao hàng</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Địa chỉ này cũng sẽ được dùng làm địa chỉ thanh toán cho đơn
                            hàng này.
                        </p>


                        {/* Shipping method tabs */}
                        <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200">
                            <div className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500">
                                    <Truck className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-sm font-medium">Vận chuyển</span>
                                <Send className="ml-auto h-4 w-4 text-teal-500" />
                            </div>
                            <div className="flex items-center gap-3 bg-zinc-50 px-4 py-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 bg-white" />
                                <span className="text-sm text-zinc-600">Lấy hàng</span>
                                <span className="ml-auto text-zinc-400">🏬</span>
                            </div>
                        </div>

                        {/* Address form */}
                        <div className="mt-6 space-y-4">
                            {/* Country */}
                            <Select defaultValue="vn">
                                <SelectTrigger className="h-12 w-full rounded-md border-zinc-300 text-sm">
                                    <SelectValue placeholder="Quốc gia/ Vùng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vn">Việt Nam</SelectItem>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="jp">Japan</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Name row */}
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="Anh/ Chị (không bắt buộc)"
                                    className="h-12 rounded-md border-zinc-300 text-sm"
                                />
                                <Input
                                    placeholder="Tên"
                                    className="h-12 rounded-md border-zinc-300 text-sm"
                                />
                            </div>

                            {/* Address */}
                            <Input
                                placeholder="Địa chỉ (Số nhà, tên, đường, phường và quận)"
                                className="h-12 rounded-md border-zinc-300 text-sm"
                            />

                            {/* City + Postal */}
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="Tỉnh/ Thành phố (Ví dụ: Đà Nẵng)"
                                    className="h-12 rounded-md border-zinc-300 text-sm"
                                />
                                <Input
                                    placeholder="Mã bưu chính (không bắt buộc)"
                                    className="h-12 rounded-md border-zinc-300 text-sm"
                                />
                            </div>

                            {/* Phone */}
                            <div className="relative">
                                <Input
                                    placeholder="Điện thoại"
                                    className="h-12 rounded-md border-zinc-300 pr-10 text-sm"
                                />
                                <Info className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            </div>

                            {/* Save info */}
                            <div className="flex items-center gap-2">
                                <Checkbox id="save-info" />
                                <Label htmlFor="save-info" className="text-sm text-zinc-600">
                                    Lưu lại thông tin này cho lần sau
                                </Label>
                            </div>
                        </div>
                    </section>

                    {/* ---- Phương thức vận chuyển (Shipping method) ---- */}
                    <section>
                        <h2 className="text-xl font-semibold">Phương thức vận chuyển</h2>

                        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                <div className="text-sm text-zinc-700">
                                    <p className="font-medium">Không có dịch vụ vận chuyển</p>
                                    <p className="mt-1 text-zinc-500">
                                        Sản phẩm này chỉ đang có tại cửa hàng, vui lòng chọn nhận
                                        hàng tại cửa hàng để hoàn tất đặt hàng.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">Thanh toán</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Địa chỉ thanh toán của phương thức thanh toán phải khớp với địa
                            chỉ giao hàng.
                        </p>
                        <p className="mt-0.5 text-sm text-zinc-500">
                            Toàn bộ các giao dịch được bảo mật và mã hóa.
                        </p>

                        <RadioGroup
                            defaultValue="vnpay"
                            className="mt-5 gap-0 overflow-hidden rounded-lg border border-zinc-200"
                        >
                            {/* VNPAY */}
                            <label
                                htmlFor="vnpay"
                                className="flex cursor-pointer items-center gap-3 border-b border-zinc-200 bg-sky-50/60 px-4 py-4"
                            >
                                <RadioGroupItem value="vnpay" id="vnpay" />
                                <span className="text-sm font-medium">VNPAY</span>
                                <div className="ml-auto flex items-center gap-1.5">
                                    <span className="rounded bg-blue-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        VISA
                                    </span>
                                    <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        MC
                                    </span>
                                    <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        JCB
                                    </span>
                                </div>
                            </label>

                            {/* ZaloPay */}
                            <label
                                htmlFor="zalopay"
                                className="flex cursor-pointer items-center gap-3 border-b border-zinc-200 px-4 py-4"
                            >
                                <RadioGroupItem value="zalopay" id="zalopay" />
                                <span className="text-sm text-zinc-700">
                                    Thanh toán online qua cổng thanh toán ZaloPay
                                </span>
                                <div className="ml-auto flex items-center gap-1.5">
                                    <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        MC
                                    </span>
                                    <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        JCB
                                    </span>
                                    <span className="rounded bg-blue-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        VISA
                                    </span>
                                    <span className="text-xs text-zinc-400">+2</span>
                                </div>
                            </label>

                            {/* COD */}
                            <label
                                htmlFor="cod"
                                className="flex cursor-pointer items-center gap-3 px-4 py-4"
                            >
                                <RadioGroupItem value="cod" id="cod" />
                                <span className="text-sm text-zinc-700">
                                    Thanh toán khi nhận hàng (COD)
                                </span>
                            </label>
                        </RadioGroup>

                        {/* Submit */}
                        <Button className="mt-6 h-14 w-full rounded-lg bg-zinc-900 text-base font-semibold text-white hover:bg-zinc-800">
                            Thanh toán ngay
                        </Button>
                    </section>
                </div>


                <aside className="lg:border-l lg:pl-10">
                    {/* Product list */}
                    <div className="space-y-5">
                        {orderItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-4">
                                {/* Thumbnail with badge */}
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">

                                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-500 text-[10px] font-bold text-white">
                                        {item.qty}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium leading-snug">
                                        {item.title}
                                    </p>
                                    {item.variant && (
                                        <p className="mt-0.5 text-xs text-zinc-500">
                                            {item.variant}
                                        </p>
                                    )}

                                </div>

                            </div>
                        ))}
                    </div>

                    <Separator className="my-6" />

                    {/* Discount code */}
                    <div className="flex gap-3">
                        <Input
                            placeholder="Mã giảm giá"
                            className="h-11 flex-1 rounded-md border-zinc-300 text-sm"
                        />
                        <Button
                            variant="outline"
                            className="h-11 rounded-md border-zinc-300 px-5 text-sm"
                        >
                            Áp dụng
                        </Button>
                    </div>

                    <Separator className="my-6" />

                    {/* Totals */}
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-600">
                                Tổng phụ · 4 mặt hàng
                            </span>
                            <span>{fmt(927800)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-600">
                                Vận chuyển{" "}
                                <Info className="inline h-3.5 w-3.5 text-zinc-400" />
                            </span>
                            <span className="text-sm text-zinc-500">
                                Nhập địa chỉ giao hàng
                            </span>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Grand total */}
                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold">Tổng</span>
                        <div className="text-right">
                            <span className="mr-2 text-xs text-zinc-400">VND</span>
                            <span className="text-2xl font-bold">{fmt(927800)}</span>
                        </div>
                    </div>


                </aside>
            </div>
        </div>
    );
}