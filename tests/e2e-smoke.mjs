/**
 * Test end-to-end du parcours critique complet :
 * demande publique -> connexion -> devis -> envoi -> acceptation publique.
 *
 * Nécessite :
 *   - le serveur de dev lancé sur http://localhost:3000 (npm run dev)
 *   - la base de données seedée (npm run db:seed)
 *   - `playwright` installé (npm install -D playwright) avec Chromium disponible
 *
 * Lancer avec : node tests/e2e-smoke.mjs
 */
import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--no-sandbox'],
});
const page = await browser.newPage();

const errors = [];
page.on('pageerror', (err) => errors.push(err.message));

function assert(condition, message) {
  if (!condition) throw new Error(`Échec : ${message}`);
}

console.log('1. Page publique...');
await page.goto(`${BASE_URL}/p/studio-nova`, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Studio Nova');

console.log('2. Soumission du formulaire prospect...');
await page.click('text=Shooting couple');
await page.locator('label:has-text("Nom complet") + input').fill('Client E2E');
await page.locator('label:has-text("Email") + input').first().fill(`e2e-${Date.now()}@example.com`);
const dateInput = page.locator('input[type="date"]');
if (await dateInput.count()) await dateInput.fill('2026-12-25');
await page.click('button[type="submit"]');
await page.waitForSelector('text=Demande envoyée', { timeout: 10000 });

console.log('3. Connexion entrepreneur...');
await page.goto(`${BASE_URL}/connexion`);
await page.fill('input[type="email"]', 'demo@flotik.app');
await page.fill('input[type="password"]', 'password123');
await page.click('button[type="submit"]');
await page.waitForURL('**/dashboard');

console.log('4. Ouverture de la demande...');
await page.goto(`${BASE_URL}/dashboard/demandes`, { waitUntil: 'networkidle' });
await page.click('text=Client E2E');
await page.waitForURL('**/dashboard/demandes/*');

console.log('5. Création et envoi du devis...');
await page.click('text=Créer un devis');
await page.waitForURL('**/dashboard/devis/nouveau**');
await page.waitForFunction(() => {
  const sel = document.querySelector('select');
  return sel && sel.value !== '';
});
await page.locator('input[placeholder="Nom de la prestation"]').first().fill('Shooting couple');
await page.locator('input[placeholder="Prix"]').first().fill('220');
await page.click('button:has-text("Créer le devis")');
await page.waitForURL(/\/dashboard\/devis\/(?!nouveau)/);

await page.click('button:has-text("Envoyer au client")');
await page.waitForSelector('text=En cliquant sur', { timeout: 10000 });
await page.click('.fixed button:has-text("Envoyer")');
await page.waitForSelector('text=Envoyé', { timeout: 10000 });

console.log('6. Acceptation publique du devis...');
const quoteId = page.url().split('/').pop();
const publicToken = await page.evaluate(async (id) => {
  const res = await fetch(`/api/quotes/${id}`);
  const data = await res.json();
  return data.quote.publicToken;
}, quoteId);

const clientPage = await (await browser.newContext()).newPage();
await clientPage.goto(`${BASE_URL}/devis/${publicToken}`, { waitUntil: 'networkidle' });
await clientPage.click('button:has-text("Accepter le devis")');
await clientPage.fill('input[placeholder="Votre nom complet (signature)"]', 'Client E2E');
await clientPage.click("button:has-text(\"Confirmer l'acceptation\")");
await clientPage.waitForSelector('text=Merci ! Votre demande a été confirmée.', { timeout: 10000 });

assert(errors.length === 0, `des erreurs JS sont survenues : ${errors.join(', ')}`);

console.log('\n✅ Parcours critique validé de bout en bout.');
await browser.close();
