import Image from "next/image";
import Link from "next/link";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { AccountTable } from "@/app/lib/definitions";
import { fetchFilteredAccounts } from "@/app/lib/data/account-data";
import { DeleteAccountButton } from "@/app/ui/accounts/buttons";

export default async function AccountsTable({ query }: { query: string }) {
  const accounts = await fetchFilteredAccounts(query);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* Mobile view */}
              <div className="md:hidden">
                {accounts?.map((account) => (
                  <div
                    key={account.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <p>
                              {account.firstName} {account.lastName}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{account.email}</p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex flex-col">
                        <p className="text-xs">Username</p>
                        <p className="font-medium">{account.username}</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs">Phone</p>
                        <p className="font-medium">{account.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <p className="text-sm">{account.birthDay}</p>
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/accounts/${account.id}`}
                          className="rounded-md border p-2 hover:bg-gray-100"
                        >
                          <EyeIcon className="w-5" />
                        </Link>
                        <Link
                          href={`/dashboard/accounts/${account.id}/edit`}
                          className="rounded-md border p-2 hover:bg-gray-100"
                        >
                          <PencilIcon className="w-5" />
                        </Link>
                        <DeleteAccountButton id={account.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop view */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Username
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Phone
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Birthday
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {accounts.map((account) => (
                    <tr key={account.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>
                            {account.firstName} {account.lastName}
                          </p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {account.username}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {account.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {account.phoneNumber}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {account.birthDay}
                      </td>
                      <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/dashboard/accounts/${account.id}`}
                            className="rounded-md border p-2 hover:bg-gray-100"
                          >
                            <EyeIcon className="w-5" />
                          </Link>
                          <Link
                            href={`/dashboard/accounts/${account.id}/edit`}
                            className="rounded-md border p-2 hover:bg-gray-100"
                          >
                            <PencilIcon className="w-5" />
                          </Link>
                          <DeleteAccountButton id={account.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
