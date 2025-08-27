// app/ui/accounts/create-form.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SingleAccountForm from "@/app/ui/accounts/single-account-form";
import BulkUploadForm from "@/app/ui/accounts/bulk-upload-form";

export default function CreateAccountForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Account</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <SingleAccountForm />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkUploadForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
