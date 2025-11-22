import "server-only";

export async function sendAssignmentNotification({
  driverPhone,
  orderReference,
  address
}: {
  driverPhone: string;
  orderReference: string;
  address: string;
}) {
  // Placeholder integration: in production connect to WhatsApp Business API
  console.info(
    `[WhatsApp] Order ${orderReference} assigned. Deliver to ${address}. Notify ${driverPhone}`
  );
}
