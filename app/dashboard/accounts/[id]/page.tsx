import {
  fetchAccountById,
  fetchParticipationsByAccount,
} from "@/app/lib/data/account-data";
import { lusitana } from "@/app/ui/fonts";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const [account, participations] = await Promise.all([
    fetchAccountById(id),
    fetchParticipationsByAccount(id),
  ]);

  if (!account) {
    notFound();
  }

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Account Details</h1>
        <Link
          href={`/dashboard/accounts/${id}/edit`}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
        >
          Edit Account
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="mt-4 space-y-2">
            <p>
              <strong>Username:</strong> {account.username}
            </p>
            <p>
              <strong>Name:</strong> {account.firstName} {account.lastName}
            </p>
            <p>
              <strong>Email:</strong> {account.email}
            </p>
            <p>
              <strong>Phone:</strong> {account.phoneNumber}
            </p>
            <p>
              <strong>Birthday:</strong>{" "}
              {new Date(account.birthDay).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h2 className="text-lg font-semibold">Learning Statistics</h2>
          <div className="mt-4 space-y-2">
            <p>
              <strong>Total Subjects:</strong> {participations.length}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Enrolled Subjects</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {participations.map((participation) => (
                <tr key={participation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {participation.subject?.title || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {participation.subject?.code || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {participation.subject?.description || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
