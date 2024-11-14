export default function ManageReservationLayout({
  children,
  dashboard,
  manage,
}: {
  children: React.ReactNode;
  dashboard: React.ReactNode;
  manage: React.ReactNode;
}) {
  return (
    <div style={{ padding: "20px" }}>
    
      {dashboard}
      {manage}
    </div>
  );
}
