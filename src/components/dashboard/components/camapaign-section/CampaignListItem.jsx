import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

/**
 * CampaignListItem - clickable campaign row for use inside collapsibles/cards
 */
export default function CampaignListItem({ campaign }) {
  if (!campaign) return null;

  const campaignId = campaign.campaign_id ?? campaign.id;
  const title = campaign.name ?? campaign.title ?? "Untitled campaign";
  const open_rate = campaign.open_rate ?? null;
  const reply_rate = campaign.reply_rate ?? null;
  const bounce_rate = campaign.bounce_rate ?? null;

  function formatPercentage(percentage) {
    if (typeof percentage === 'string') return percentage

    try {
        return (percentage* 100).toFixed(1) + '%';
    } catch (err) {
        return percentage
    }
  }

  return (
    <Button
      asChild
      variant="ghost"
      className="w-full h-auto justify-start p-2 hover:bg-muted/50 rounded-md focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Link
        to={`/campaigns/${campaignId}`}
        className="flex w-full items-center gap-3"
      >

        {/* Text block */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-medium truncate">{title}</span>
          <span className="text-xs text-muted-foreground truncate">
            {open_rate !== null ? `Open Rate: ${formatPercentage(open_rate)}` : ""}
            {bounce_rate !== null ? `Bounce Rate: ${formatPercentage(bounce_rate)}` : ""}
            {reply_rate ? ` • Reply Rate: ${formatPercentage(reply_rate)}` : ""}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </Link>
    </Button>
  );
}
