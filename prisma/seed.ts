import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);

  const owner = await prisma.user.upsert({
    where: { email: 'demo@flotik.app' },
    update: {},
    create: {
      firstName: 'Camille',
      lastName: 'Nova',
      email: 'demo@flotik.app',
      passwordHash,
      emailVerified: new Date(),
    },
  });

  await prisma.business.deleteMany({ where: { ownerId: owner.id } });

  const business = await prisma.business.create({
    data: {
      ownerId: owner.id,
      name: 'Studio Nova',
      slug: 'studio-nova',
      activity: 'Photographe',
      description: 'Photographe portrait, couple et mariage basée à Lyon. Studio Nova capture vos plus beaux moments.',
      primaryColor: '#16A87F',
      phone: '+33 6 12 34 56 78',
      publicEmail: 'contact@studio-nova.example',
      instagram: '@studionova',
      website: 'https://studio-nova.example',
      onboardingCompleted: true,
      onboardingStep: 6,
      showPricingPublicly: true,
      allowIndexing: false,
      defaultTaxRate: 0,
      quoteValidityDays: 30,
      depositType: 'PERCENT_30',
      subscription: { create: { plan: 'STARTER', status: 'ACTIVE' } },
      automations: {
        create: [
          { type: 'quote_reminder', delayHours: 24, enabled: true, templateKey: 'reminder_1' },
          { type: 'quote_reminder', delayHours: 72, enabled: true, templateKey: 'reminder_2' },
        ],
      },
    },
  });

  const portrait = await prisma.service.create({
    data: {
      businessId: business.id,
      name: 'Shooting portrait',
      description: "Séance individuelle en studio ou en extérieur, 1h, 15 photos retouchées.",
      priceType: 'FIXED',
      price: 150,
      durationMinutes: 60,
      order: 1,
      options: {
        create: [
          { name: 'Retouche premium', priceDelta: 50, order: 1 },
          { name: 'Personne supplémentaire', priceDelta: 30, order: 2 },
        ],
      },
    },
  });

  const couple = await prisma.service.create({
    data: {
      businessId: business.id,
      name: 'Shooting couple',
      description: 'Séance en extérieur, 1h30, 25 photos retouchées.',
      priceType: 'FIXED',
      price: 220,
      durationMinutes: 90,
      order: 2,
      options: { create: [{ name: 'Livraison express (48h)', priceDelta: 40, order: 1 }] },
    },
  });

  await prisma.service.create({
    data: {
      businessId: business.id,
      name: 'Mariage',
      description: 'Couverture complète de votre journée de mariage.',
      priceType: 'ON_QUOTE',
      order: 3,
    },
  });

  const fields = await prisma.$transaction([
    prisma.formField.create({
      data: { businessId: business.id, label: 'Date souhaitée', type: 'DATE', required: true, order: 1 },
    }),
    prisma.formField.create({
      data: {
        businessId: business.id,
        label: 'Lieu',
        type: 'TEXT',
        required: false,
        order: 2,
      },
    }),
    prisma.formField.create({
      data: { businessId: business.id, label: 'Budget', type: 'AMOUNT', required: false, order: 3 },
    }),
    prisma.formField.create({
      data: { businessId: business.id, label: 'Photos de référence', type: 'FILE', required: false, order: 4 },
    }),
  ]);

  const customersData = [
    { name: 'Marie Dupont', email: 'marie.dupont@example.com', phone: '+33 6 11 22 33 44' },
    { name: 'Thomas Martin', email: 'thomas.martin@example.com', phone: '+33 6 22 33 44 55' },
    { name: 'Léa Bernard', email: 'lea.bernard@example.com', phone: '+33 6 33 44 55 66' },
    { name: 'Hugo Petit', email: 'hugo.petit@example.com', phone: '+33 6 44 55 66 77' },
  ];

  const customers = [];
  for (const c of customersData) {
    customers.push(
      await prisma.customer.create({
        data: { businessId: business.id, ...c },
      })
    );
  }

  const now = Date.now();
  const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);

  const req1 = await prisma.request.create({
    data: {
      businessId: business.id,
      customerId: customers[0].id,
      serviceId: portrait.id,
      status: 'NEW',
      clientName: customers[0].name,
      clientEmail: customers[0].email,
      clientPhone: customers[0].phone,
      desiredDate: daysAgo(-10),
      answers: [
        { fieldId: fields[0].id, label: 'Date souhaitée', value: daysAgo(-10).toISOString().slice(0, 10) },
        { fieldId: fields[1].id, label: 'Lieu', value: 'Parc de la Tête d\'Or, Lyon' },
        { fieldId: fields[2].id, label: 'Budget', value: '200' },
      ],
      estimatedPrice: 150,
      source: 'instagram',
      createdAt: daysAgo(1),
    },
  });

  const req2 = await prisma.request.create({
    data: {
      businessId: business.id,
      customerId: customers[1].id,
      serviceId: couple.id,
      status: 'QUOTE_SENT',
      clientName: customers[1].name,
      clientEmail: customers[1].email,
      clientPhone: customers[1].phone,
      desiredDate: daysAgo(-20),
      answers: [{ fieldId: fields[1].id, label: 'Lieu', value: 'Vieux Lyon' }],
      estimatedPrice: 220,
      source: 'website',
      createdAt: daysAgo(4),
    },
  });

  const req3 = await prisma.request.create({
    data: {
      businessId: business.id,
      customerId: customers[2].id,
      serviceId: portrait.id,
      status: 'ACCEPTED',
      clientName: customers[2].name,
      clientEmail: customers[2].email,
      clientPhone: customers[2].phone,
      answers: [],
      estimatedPrice: 150,
      source: 'tiktok',
      createdAt: daysAgo(8),
    },
  });

  await prisma.request.create({
    data: {
      businessId: business.id,
      customerId: customers[3].id,
      serviceId: portrait.id,
      status: 'DONE',
      clientName: customers[3].name,
      clientEmail: customers[3].email,
      clientPhone: customers[3].phone,
      answers: [],
      estimatedPrice: 150,
      source: 'qr',
      createdAt: daysAgo(30),
    },
  });

  await prisma.quote.create({
    data: {
      businessId: business.id,
      requestId: req2.id,
      customerId: customers[1].id,
      number: 'DEV-0001',
      status: 'SENT',
      subtotal: 220,
      taxRate: 0,
      taxAmount: 0,
      total: 220,
      depositType: 'PERCENT_30',
      depositAmount: 66,
      validUntil: daysAgo(-26),
      sentAt: daysAgo(2),
      items: { create: [{ label: 'Shooting couple', quantity: 1, unitPrice: 220, total: 220, order: 1 }] },
    },
  });

  const acceptedQuote = await prisma.quote.create({
    data: {
      businessId: business.id,
      requestId: req3.id,
      customerId: customers[2].id,
      number: 'DEV-0002',
      status: 'ACCEPTED',
      subtotal: 150,
      taxRate: 0,
      taxAmount: 0,
      total: 150,
      depositType: 'PERCENT_30',
      depositAmount: 45,
      validUntil: daysAgo(-15),
      sentAt: daysAgo(7),
      respondedAt: daysAgo(6),
      signatureName: customers[2].name,
      items: { create: [{ label: 'Shooting portrait', quantity: 1, unitPrice: 150, total: 150, order: 1 }] },
    },
  });

  await prisma.payment.create({
    data: {
      businessId: business.id,
      quoteId: acceptedQuote.id,
      customerId: customers[2].id,
      type: 'DEPOSIT',
      status: 'SUCCEEDED',
      amount: 45,
    },
  });

  await prisma.business.update({ where: { id: business.id }, data: { nextQuoteNumber: 3 } });

  await prisma.activity.createMany({
    data: [
      { businessId: business.id, requestId: req1.id, type: 'request_received', message: `Demande reçue de ${customers[0].name}`, createdAt: daysAgo(1) },
      { businessId: business.id, requestId: req2.id, type: 'quote_sent', message: 'Devis DEV-0001 envoyé à Thomas Martin', createdAt: daysAgo(2) },
      { businessId: business.id, requestId: req3.id, type: 'quote_accepted', message: 'Devis DEV-0002 accepté par Léa Bernard', createdAt: daysAgo(6) },
      { businessId: business.id, type: 'payment_received', message: 'Acompte de 45€ reçu pour le devis DEV-0002', createdAt: daysAgo(5) },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { businessId: business.id, type: 'new_request', message: `Nouvelle demande de ${customers[0].name}`, link: `/dashboard/demandes/${req1.id}` },
      { businessId: business.id, type: 'quote_accepted', message: 'Devis DEV-0002 accepté', link: `/dashboard/devis/${acceptedQuote.id}`, read: true },
    ],
  });

  await prisma.analyticsEvent.createMany({
    data: Array.from({ length: 40 }).map((_, i) => ({
      businessId: business.id,
      type: i % 3 === 0 ? 'form_submit' : 'page_view',
      source: ['instagram', 'instagram', 'tiktok', 'website', 'qr'][i % 5],
      createdAt: daysAgo(i % 25),
    })),
  });

  console.log('Seed terminé.');
  console.log('Connexion démo : demo@flotik.app / password123');
  console.log(`Page publique : /p/${business.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
