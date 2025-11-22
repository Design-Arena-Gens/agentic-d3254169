import "server-only";

import { revalidatePath } from "next/cache";
import { getCashSessions, saveCashSessions } from "@/lib/data-store";
import { CashSession } from "@/lib/types";

export async function listCashSessions() {
  return getCashSessions();
}

export async function verifyCashSession(
  sessionId: string,
  payload: {
    status: CashSession["status"];
    verifierId: string;
    note?: string;
    declaredAmount?: number;
  }
) {
  const sessions = await getCashSessions();
  const session = sessions.find((item) => item.id === sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  session.status = payload.status;
  session.verifierId = payload.verifierId;
  session.verifierNote = payload.note;

  if (typeof payload.declaredAmount === "number") {
    session.declaredAmount = payload.declaredAmount;
  }

  await saveCashSessions(sessions);
  revalidatePath("/dashboard/finance");
}
