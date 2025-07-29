import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/acme-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { SimpleThemeToggle } from "@/components/theme-toggle";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-background dark:bg-gray-900">
      {/* Logo - giữ nguyên màu blue-600 */}
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 dark:bg-blue-900 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />

        {/* Spacer - adaptive cho dark mode */}
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 dark:bg-gray-800 md:block"></div>

        {/* Theme toggle - thêm vào trước Sign Out */}
        <div className="flex justify-center md:justify-start mb-2">
          <SimpleThemeToggle />
        </div>

        {/* Sign Out button - giữ style gốc + dark mode */}
        <Link href="/login">
          <form>
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-800 p-3 text-sm font-medium hover:bg-sky-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3">
              <PowerIcon className="w-6" />
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
        </Link>
      </div>
    </div>
  );
}
