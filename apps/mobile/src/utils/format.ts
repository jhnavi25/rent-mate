export function formatINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ');
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    payment_pending: '#FBBF24',
    active: '#38BDF8',
    in_use: '#7C5CFF',
    return_pending: '#F59E0B',
    deposit_hold: '#A78BFA',
    dispute_open: '#FF5C7A',
    completed: '#22D3A6',
    cancelled: '#6B7899',
    draft: '#9AA6C2',
  };
  return map[status] ?? '#9AA6C2';
}

export function rentalSteps(status: string): { label: string; done: boolean; active: boolean }[] {
  const order = ['payment_pending', 'active', 'in_use', 'return_pending', 'deposit_hold', 'completed'];
  const idx = order.indexOf(status);
  const labels = ['Pay', 'Handoff', 'In use', 'Return', 'Inspection', 'Done'];
  return labels.map((label, i) => ({
    label,
    done: idx > i || status === 'completed',
    active: idx === i || (status === 'dispute_open' && i === 4),
  }));
}
