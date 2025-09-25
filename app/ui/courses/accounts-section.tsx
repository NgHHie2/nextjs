import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Eye, ChevronDown } from "lucide-react";
import { Account } from "@/app/lib/definitions";

type AccountsSectionProps = {
  semesterAccounts: any[];
  accountMap: Map<number, Account>;
};

export default function AccountsSection({
  semesterAccounts,
  accountMap,
}: AccountsSectionProps) {
  const totalAccounts = semesterAccounts?.length || 0;

  return (
    <Collapsible className="group">
      <Card>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <CardTitle className="flex items-center gap-2 cursor-pointer">
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              <Users className="h-5 w-5" />
              Participants ({totalAccounts})
            </CardTitle>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            {semesterAccounts && semesterAccounts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[37.5%]">Name</TableHead>
                    <TableHead className="w-[12.5%] text-center">
                      CCCD
                    </TableHead>
                    <TableHead className="w-[37.5%] text-center">
                      Position
                    </TableHead>
                    <TableHead className="w-[12.5%] text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semesterAccounts.map((semAccount) => {
                    const account = accountMap.get(semAccount.accountId);
                    return (
                      <TableRow key={semAccount.id}>
                        <TableCell className="font-medium">
                          {account
                            ? `${account.lastName} ${account.firstName}`
                            : "Unknown"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap justify-center">
                            {account ? account.cccd : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap justify-center">
                            <Badge variant="outline">
                              {semAccount.position.name}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center flex-wrap gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No participants in this course.
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
