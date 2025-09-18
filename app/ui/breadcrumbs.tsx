// app/ui/breadcrumbs.tsx
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { lusitana } from "@/app/ui/fonts";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: BreadcrumbItem[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 w-full">
      <ol
        className={cn(
          lusitana.className,
          // luôn 1 dòng, có thể cuộn ngang
          "flex items-center text-xl md:text-2xl w-full overflow-x-auto whitespace-nowrap scrollbar-thin"
        )}
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center flex-shrink-0">
            {breadcrumb.active ? (
              <span className="font-medium text-foreground">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
            {index < breadcrumbs.length - 1 && (
              <ChevronRightIcon className="mx-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
