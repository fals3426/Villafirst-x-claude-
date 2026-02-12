export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  amount?: number;
  currency?: string;
  timestamp?: string;
  error?: string;
}

export async function simulatePayment(
  amount: number,
  currency: string = "EUR"
): Promise<PaymentResult> {
  // Simule un délai de traitement (2 secondes)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simule un succès 95% du temps
  const success = Math.random() > 0.05;

  if (success) {
    const transactionId = `VF_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    return {
      success: true,
      transactionId,
      amount,
      currency,
      timestamp: new Date().toISOString(),
    };
  } else {
    return {
      success: false,
      error: "Paiement echoue - Fonds insuffisants (simulation)",
    };
  }
}

export function formatPrice(amount: number, currency: string = "EUR"): string {
  if (currency === "EUR") {
    return `${amount.toLocaleString()}€`;
  } else if (currency === "IDR") {
    return `${amount.toLocaleString()} IDR`;
  } else if (currency === "USD") {
    return `$${amount.toLocaleString()}`;
  }
  return `${amount} ${currency}`;
}
