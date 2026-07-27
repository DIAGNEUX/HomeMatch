export type VisitRequestTableColumn = {
  key: "property" | "visitor" | "requestedDate" | "message" | "status";
  label: string;
};

export const visitRequestTableColumns: VisitRequestTableColumn[] = [
  {
    key: "property",
    label: "Bien",
  },
  {
    key: "visitor",
    label: "Demandeur",
  },
  {
    key: "requestedDate",
    label: "Date souhaitée",
  },
  {
    key: "message",
    label: "Message",
  },
  {
    key: "status",
    label: "Statut",
  },
];
