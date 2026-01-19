import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const ProfilePage = () => {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Contact Details</h1>

        <div className="mt-6 space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Name</div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-1">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="text-sm">huypham1459@gmail.com</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Addresses</CardTitle>
                <Button variant="ghost" className="h-8 px-2 text-sm">
                  + Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">
                No addresses added
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Gift Cards</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                You don't have any gift cards
              </div>
              <Separator className="my-4" />
              <div className="max-w-sm">
                <Input placeholder="Enter gift card code" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
