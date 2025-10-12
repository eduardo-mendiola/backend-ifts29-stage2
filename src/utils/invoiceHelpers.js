
export function calculateInvoiceTotals(items, discountPercent = 0, taxPercent = 0) {
    if (!Array.isArray(items) || items.length === 0) {
        return { subtotal: 0, discount: 0, taxes: 0, total: 0 };
    }

    const subtotal = items.reduce((acc, item) => acc + item.unit_price * (item.quantity || 1), 0);
    const discount = (subtotal * discountPercent) / 100;
    const taxes = ((subtotal - discount) * taxPercent) / 100;
    const total = subtotal - discount + taxes;

    return { subtotal, discount, taxes, total };
};

