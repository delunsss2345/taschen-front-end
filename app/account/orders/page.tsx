"use client";

import { Package, Calendar, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useTranslator from "@/hooks/use-translator";

const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-02-01",
    status: "delivered",
    total: "US$ 255",
    items: 3,
    shippingAddress: "123 Main St, Ho Chi Minh City",
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-28",
    status: "shipping",
    total: "US$ 150",
    items: 1,
    shippingAddress: "456 Le Loi St, Hanoi",
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-15",
    status: "processing",
    total: "US$ 80",
    items: 1,
    shippingAddress: "789 Nguyen Hue St, Da Nang",
  },
  {
    id: "ORD-2024-004",
    date: "2024-01-10",
    status: "cancelled",
    total: "US$ 425",
    items: 4,
    shippingAddress: "321 Tran Hung Dao St, Can Tho",
  },
];

const OrderPage = () => {
  const { t } = useTranslator();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipping":
        return "secondary";
      case "processing":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    return t(`orders.status.${status}`);
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            {t("orders.page.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("orders.page.subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          {mockOrders.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-center text-muted-foreground">
                  {t("orders.page.noOrders")}
                </p>
              </CardContent>
            </Card>
          ) : (
            mockOrders.map((order) => (
              <Card key={order.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold">
                        {order.id}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{order.date}</span>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("orders.page.itemsCount")}
                      </span>
                      <span className="font-medium">{order.items}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("orders.page.total")}
                      </span>
                      <span className="font-semibold">{order.total}</span>
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("orders.page.shippingAddress")}
                        </p>
                        <p className="mt-1">{order.shippingAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      {t("orders.page.viewDetails")}
                    </Button>
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm">
                        {t("orders.page.buyAgain")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default OrderPage;
