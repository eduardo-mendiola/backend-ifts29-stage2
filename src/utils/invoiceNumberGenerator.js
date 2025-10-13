import Counter from '../models/Counter.js';


export async function invoiceNumberGenerator({
  key = 'invoice_number',
  prefix = 'FAC-',
  length = 6
} = {}) {
  const counter = await Counter.findByIdAndUpdate(
    key,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } 
  );

  const padded = String(counter.sequence_value).padStart(length, '0');
  return `${prefix}${padded}`;
}
