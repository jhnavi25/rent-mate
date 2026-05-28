export interface KycVerificationResult {
  success: boolean;
  providerRef: string;
  message?: string;
}

export interface KycProvider {
  verify(panNumber: string, aadhaarMasked?: string): Promise<KycVerificationResult>;
}

export class StubKycProvider implements KycProvider {
  async verify(panNumber: string): Promise<KycVerificationResult> {
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
      return { success: false, providerRef: '', message: 'Invalid PAN format' };
    }
    return {
      success: true,
      providerRef: `stub_${Date.now()}`,
    };
  }
}
