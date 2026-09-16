import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a2e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  businessName: { fontSize: 18, fontWeight: 700 },
  muted: { color: '#6b7280', fontSize: 9 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 9, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 4, letterSpacing: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  table: { marginTop: 8 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 6, marginBottom: 6 },
  tableRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  colLabel: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colPrice: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right' },
  totals: { marginTop: 12, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', width: 200, justifyContent: 'space-between', paddingVertical: 2 },
  totalFinal: { fontSize: 13, fontWeight: 700, marginTop: 4, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 6 },
  footer: { marginTop: 32, fontSize: 8, color: '#9ca3af' },
});

export function QuotePdf({
  business,
  quote,
}: {
  business: {
    name: string;
    address: string | null;
    phone: string | null;
    publicEmail: string | null;
  };
  quote: {
    number: string;
    createdAt: Date;
    validUntil: Date | null;
    customer: { name: string; email: string; company: string | null; address: string | null };
    items: { label: string; description: string | null; quantity: number; unitPrice: number; total: number }[];
    subtotal: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    terms: string | null;
    depositAmount: number | null;
  };
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.businessName}>{business.name}</Text>
            {business.address && <Text style={styles.muted}>{business.address}</Text>}
            {business.phone && <Text style={styles.muted}>{business.phone}</Text>}
            {business.publicEmail && <Text style={styles.muted}>{business.publicEmail}</Text>}
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: 700 }}>DEVIS {quote.number}</Text>
            <Text style={styles.muted}>Date : {quote.createdAt.toLocaleDateString('fr-FR')}</Text>
            {quote.validUntil && (
              <Text style={styles.muted}>Valable jusqu&apos;au {quote.validUntil.toLocaleDateString('fr-FR')}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adressé à</Text>
          <Text>{quote.customer.name}</Text>
          {quote.customer.company && <Text>{quote.customer.company}</Text>}
          <Text style={styles.muted}>{quote.customer.email}</Text>
          {quote.customer.address && <Text style={styles.muted}>{quote.customer.address}</Text>}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colLabel, { fontWeight: 700 }]}>Prestation</Text>
            <Text style={[styles.colQty, { fontWeight: 700 }]}>Qté</Text>
            <Text style={[styles.colPrice, { fontWeight: 700 }]}>Prix unitaire</Text>
            <Text style={[styles.colTotal, { fontWeight: 700 }]}>Total</Text>
          </View>
          {quote.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.colLabel}>
                <Text>{item.label}</Text>
                {item.description && <Text style={styles.muted}>{item.description}</Text>}
              </View>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{item.unitPrice.toFixed(2)} €</Text>
              <Text style={styles.colTotal}>{item.total.toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Sous-total</Text>
            <Text>{quote.subtotal.toFixed(2)} €</Text>
          </View>
          {quote.discount > 0 && (
            <View style={styles.totalRow}>
              <Text>Réduction</Text>
              <Text>- {quote.discount.toFixed(2)} €</Text>
            </View>
          )}
          {quote.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text>TVA ({quote.taxRate}%)</Text>
              <Text>{quote.taxAmount.toFixed(2)} €</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.totalFinal]}>
            <Text>Total TTC</Text>
            <Text>{quote.total.toFixed(2)} €</Text>
          </View>
          {quote.depositAmount != null && quote.depositAmount > 0 && (
            <View style={styles.totalRow}>
              <Text>Acompte demandé</Text>
              <Text>{quote.depositAmount.toFixed(2)} €</Text>
            </View>
          )}
        </View>

        {quote.terms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conditions</Text>
            <Text style={styles.muted}>{quote.terms}</Text>
          </View>
        )}

        <Text style={styles.footer}>Devis généré par Flotik.</Text>
      </Page>
    </Document>
  );
}
