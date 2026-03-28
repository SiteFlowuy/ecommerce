'use strict';

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── CORS ──────────────────────────────────────────────────────────────────── */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. same-file HTML, curl)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin "${origin}" not allowed`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

/* ── Raw body for webhook signature verification ───────────────────────────── */
// Must be registered BEFORE express.json() and only for /webhook
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook,
);

/* ── JSON body for all other routes ───────────────────────────────────────── */
app.use(express.json());

/* ── POST /create-payment-intent ───────────────────────────────────────────── */
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'usd' } = req.body;

  if (!amount || typeof amount !== 'number' || amount < 50) {
    return res.status(400).json({
      error: 'El campo "amount" es requerido y debe ser un entero en centavos (mínimo 50).',
    });
  }

  // Stripe expects an integer number of cents (e.g. $12.99 → 1299)
  const amountCents = Math.round(amount);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('[create-payment-intent]', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ── POST /webhook ─────────────────────────────────────────────────────────── */
function handleWebhook(req, res) {
  const sig    = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.warn('[webhook] STRIPE_WEBHOOK_SECRET no configurado — saltando verificación de firma.');
    // Still parse and log without verification (only acceptable in local dev)
    try {
      const event = JSON.parse(req.body.toString());
      logEvent(event);
    } catch {
      return res.status(400).json({ error: 'Payload inválido' });
    }
    return res.json({ received: true });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    console.error('[webhook] Verificación de firma fallida:', err.message);
    return res.status(400).json({ error: `Firma inválida: ${err.message}` });
  }

  logEvent(event);
  res.json({ received: true });
}

function logEvent(event) {
  const ts = new Date().toISOString();
  console.log(`[webhook] ${ts} | type=${event.type} | id=${event.id}`);

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log(`  ✓ Pago exitoso — PaymentIntent ${event.data.object.id} — ${event.data.object.amount / 100} ${event.data.object.currency.toUpperCase()}`);
      break;

    case 'payment_intent.payment_failed':
      console.log(`  ✗ Pago fallido  — ${event.data.object.last_payment_error?.message}`);
      break;

    case 'charge.refunded':
      console.log(`  ↩ Reembolso     — Charge ${event.data.object.id}`);
      break;

    default:
      console.log(`  · Evento no manejado: ${event.type}`);
  }
}

/* ── Health-check ──────────────────────────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

/* ── Start ─────────────────────────────────────────────────────────────────── */
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: La variable de entorno STRIPE_SECRET_KEY no está definida.');
  console.error('Copia backend/.env.example a backend/.env y rellena tus claves de Stripe.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`ShopBase backend escuchando en http://localhost:${PORT}`);
  console.log(`  POST /create-payment-intent`);
  console.log(`  POST /webhook`);
  console.log(`  GET  /health`);
});
