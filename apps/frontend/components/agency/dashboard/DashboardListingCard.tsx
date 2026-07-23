import Link from "next/link";
import { Building } from "lucide-react";
import Card from "@/components/ui/Card";

interface ListingItem {
  title: string;
  location: string;
  price: string;
  type: string;
  status: string;
}

interface DashboardListingCardProps {
  title: string;
  items: ListingItem[];
}

export default function DashboardListingCard({
  title,
  items,
}: DashboardListingCardProps) {
  // show a compact preview (limit items) and match welcome card height
  const preview = items.slice(0, 2);

  return (
    <Card className="space-y-4 min-h-[14rem]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-primary">{title}</p>
          <p className="text-sm text-muted">Suivi des dernières annonces et demandes d&apos;agence.</p>
        </div>
        <Link
          href="/agency/properties"
          className="text-sm font-medium text-accent transition hover:text-accent/80"
        >
          Voir toutes
        </Link>
      </div>

      <div className="space-y-3">
        {preview.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                  <Building size={16} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-primary">{item.title}</p>
                  <p className="text-xs text-muted">{item.location} · {item.price}</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
