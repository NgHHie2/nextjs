import Image from "next/image";
import { UpdateSubject, DeleteSubject } from "@/app/ui/subjects/buttons";
import { fetchFilteredSubjects } from "@/app/lib/learning-data";

export default async function SubjectsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const subjects = await fetchFilteredSubjects(query);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {subjects?.map((subject) => (
              <div
                key={subject.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm font-medium">{subject.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{subject.code}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateSubject id={subject.id} />
                    <DeleteSubject id={subject.id} />
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {subject.participantCount} participants
                    </p>
                    <p className="text-sm text-gray-500">
                      {subject.description}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        subject.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {subject.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Subject
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Code
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Participants
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {subjects?.map((subject) => (
                <tr
                  key={subject.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{subject.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subject.code}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subject.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {subject.participantCount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        subject.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {subject.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateSubject id={subject.id} />
                      <DeleteSubject id={subject.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
