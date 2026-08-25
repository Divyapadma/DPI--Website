import { Mail, MessageSquare, Phone } from "lucide-react";
import { getLeads } from "@/lib/queries";
import { deleteLead } from "@/lib/mutations";
import DeleteButton from "@/components/admin/DeleteButton";
import type { Lead } from "@/lib/types";

// Not built on the shared AdminListPage (Projects/Blog/Careers all use it) —
// that component assumes every row has an edit page and an "Add New"
// action, neither of which applies here: a lead only ever arrives via a
// site visitor submitting a form (lib/actions.ts submitLead), never
// created or edited from the admin side, so "add"/"edit" would be dead UI.
// A message field also reads much better as its own block than squeezed
// into a fixed table column.

const FORM_TYPE_LABEL: Record<Lead["form_type"], string> = {
  contact: "Contact Form",
  "project-enquiry": "Project Enquiry",
  "career-application": "Career Application",
};

function LeadContext({ lead }: { lead: Lead }) {
  if (lead.form_type === "project-enquiry" && lead.project_slug) {
    return <span className="text-taupe">Project: {lead.project_slug}</span>;
  }
  if (lead.form_type === "career-application" && lead.career_slug) {
    return <span className="text-taupe">Role: {lead.career_slug}</span>;
  }
  return null;
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <div>
        <h1 className="font-display text-xl text-charcoal sm:text-2xl">Leads</h1>
        <p className="mt-1 text-sm text-taupe">
          Enquiries submitted through the Contact page, project enquiry forms, and career applications.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="glass-card mt-8 rounded-2xl px-6 py-10 text-center text-sm text-taupe">
          No leads yet — submissions from any site form will show up here.
        </div>
      ) : (
        <div className="mt-6 space-y-3 sm:mt-8">
          {leads.map((lead) => (
            <div key={lead.id} className="glass-card rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-display text-lg text-charcoal">{lead.name}</p>
                    <span className="rounded-full border border-terracotta/30 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.1em] text-terracotta">
                      {FORM_TYPE_LABEL[lead.form_type]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-taupe">
                    <LeadContext lead={lead} />
                    {lead.project_slug || lead.career_slug ? " · " : ""}
                    {new Date(lead.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <DeleteButton id={lead.id} label={`${lead.name}'s enquiry`} action={deleteLead} />
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-2 text-charcoal/90 transition-colors hover:text-terracotta"
                >
                  <Phone size={15} className="text-terracotta" />
                  {lead.phone}
                </a>
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 text-charcoal/90 transition-colors hover:text-terracotta"
                >
                  <Mail size={15} className="text-terracotta" />
                  {lead.email}
                </a>
              </div>

              {lead.message && (
                <div className="mt-4 flex gap-2 border-t border-line pt-4 text-sm text-charcoal/90">
                  <MessageSquare size={15} className="mt-0.5 shrink-0 text-taupe" />
                  <p className="leading-relaxed">{lead.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
