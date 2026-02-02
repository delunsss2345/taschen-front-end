import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { selectCurrentUser } from "@/features/auth";
import useTranslator from "@/hooks/use-translator";
import { useAppSelector } from "@/store";

const ProfilePage = () => {
  const { t } = useTranslator();
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold">
          {t("profile.page.contactDetailsTitle")}
        </h1>

        <div className="mt-6 space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {t("profile.page.nameLabel")}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={t("profile.page.editName")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-base font-medium">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "N/A"}
                </div>

                <div className="grid gap-1">
                  <div className="text-sm text-muted-foreground">
                    {t("profile.page.emailLabel")}
                  </div>
                  <div className="text-sm">{currentUser?.email || "N/A"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {t("profile.page.addressesTitle")}
                </CardTitle>
                <Button variant="ghost" className="h-8 px-2 text-sm">
                  {t("profile.page.addAddress")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">
                {t("profile.page.noAddresses")}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {t("profile.page.giftCardsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                {t("profile.page.noGiftCards")}
              </div>
              <Separator className="my-4" />
              <div className="max-w-sm">
                <Input placeholder={t("profile.page.giftCardPlaceholder")} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
