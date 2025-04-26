import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatDateAPIToBe } from "../../api/utils/formatters/formatdateapibe";

import { formatCurrency } from "../../api/utils/formatters/formatcurrency";

const addDaysToDate = (dateString, days) => {
  const date = new Date(dateString);

  date.setDate(date.getDate() + days);

  return date.toISOString().split("T")[0];
};

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    gap: 5,
  },
  subHeader: {
    fontWeight: "heavy",
    fontSize: 12,
    textAlign: "left",
    marginBottom: 2,
  },
  text: {
    fontSize: 11,
    textAlign: "left",
  },
  table: {
    marginTop: 2,
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    minHeight: 400,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableColHeader1: {
    width: "40%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "heavy",
  },
  tableCol1: {
    width: "40%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  tableColHeader2: {
    width: "15%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "heavy",
  },
  tableCol2: {
    width: "15%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  tableColHeader3: {
    width: "15%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "heavy",
  },
  tableCol3: {
    width: "15%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  tableColHeader4: {
    width: "15%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "heavy",
  },
  tableCol4: {
    width: "15%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  tableColHeader5: {
    width: "15%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "heavy",
  },
  tableCol5: {
    width: "15%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  tableCellR: {
    marginLeft: "auto",
    marginRight: "1",
    marginTop: 5,
    fontSize: 10,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  tableCellL: {
    marginRight: "auto",
    marginLeft: "1",
    marginTop: 5,
    fontSize: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  row_jb: {
    marginVertical: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    display: "flex",
    flexDirection: "column",
  },
  col_jb: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export const PDFInvoice = ({ invoiceDocument }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.row_jb}>
            <View style={{ width: "45%" }}>
              <Image src={"/assets/header/logob.png"} />
            </View>
            <View style={styles.col}>
              <Text style={styles.text}>Rue de Ribaucourt 154</Text>
              <Text style={styles.text}>1080 Bruxelles, Belgique</Text>
              <Text style={styles.text}>ING: BE72 3631 7422 9016</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                borderWidth: 1,
                paddingHorizontal: 15,
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "heavy",
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 2,
                }}
              >
                COMMANDE
              </Text>
              <Text
                style={{
                  fontWeight: "heavy",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                BESTELLING
              </Text>
            </View>
          </View>
          <View
            style={{
              marginVertical: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                borderWidth: 1,
                paddingHorizontal: 15,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "demibold",
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 2,
                }}
              >
                Heures d'ouverture:
              </Text>
              <Text
                style={{
                  fontWeight: "demibold",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                Du lundi au samedi:
              </Text>
              <Text
                style={{
                  fontWeight: "demibold",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                09H30 - 19H00
              </Text>
              <Text
                style={{
                  fontWeight: "demibold",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                Fermé le dimanche
              </Text>
            </View>
            <View style={{ width: "7%" }}>
              <Image
                style={{
                  borderRadius: 10,
                  backgroundColor: "#56585c",
                  padding: 5,
                }}
                src={"/assets/header/whatsapp.png"}
              />
            </View>
            <Text style={styles.text}>+32 (0) 499 73 83 73</Text>
            <View style={styles.col}>
              <Text style={styles.text}>
                Suivez votre commande sur WhatsApp
              </Text>
              <Text style={styles.text}>Volg uw bestelling op WhatsApp</Text>
              <Text style={styles.text}>Track your order on WhatsApp</Text>
            </View>
          </View>
          <View style={styles.row_jb}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                borderWidth: 1,
                paddingHorizontal: 15,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "demibold",
                  fontSize: 11,
                  textAlign: "center",
                  marginBottom: 2,
                }}
              >
                Commande:
              </Text>
              <Text
                style={{
                  fontWeight: "demibold",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                {invoiceDocument.prefix + invoiceDocument.number}
              </Text>
              <Text
                style={{
                  fontWeight: "demibold",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                Date:
              </Text>
              <Text
                style={{
                  fontWeight: "demibold",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                {formatDateAPIToBe(invoiceDocument.date)}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.subHeader}>Facturation:</Text>
              {invoiceDocument.client.category == "Entreprise" ? (
                <>
                  <Text style={styles.text}>
                    {invoiceDocument.client.company}
                  </Text>
                  <Text style={styles.text}>
                    {invoiceDocument.client.taxID}{" "}
                  </Text>
                  <Text style={styles.text}>
                    {`${invoiceDocument.client.firstName} ${invoiceDocument.client.lastName}`}{" "}
                  </Text>
                  <Text style={styles.text}>
                    {invoiceDocument.client.phone}{" "}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.text}>
                    {`${invoiceDocument.client.firstName} ${invoiceDocument.client.lastName}`}{" "}
                  </Text>
                  <Text style={styles.text}>
                    {invoiceDocument.client.phone}{" "}
                  </Text>
                </>
              )}
            </View>
            <View style={styles.col}>
              <Text style={styles.subHeader}> </Text>
              <Text style={styles.text}>
                {invoiceDocument.docAddress.street}{" "}
                {invoiceDocument.docAddress.doorNumber}
              </Text>
              <Text style={styles.text}>
                {invoiceDocument.docAddress.zipCode}{" "}
                {invoiceDocument.docAddress.city}
              </Text>
              <Text style={styles.text}>
                {invoiceDocument.docAddress.province ?? ""}{" "}
                {invoiceDocument.docAddress.country}
              </Text>
              {invoiceDocument.docAddress.floor ? (
                <Text style={styles.text}>
                  Étage: {invoiceDocument.docAddress.floor}
                </Text>
              ) : (
                <></>
              )}
            </View>
            <View style={styles.col}>
              <Text style={styles.subHeader}>Livraison:</Text>
              <Text style={styles.text}>
                {invoiceDocument.delAddress.street}{" "}
                {invoiceDocument.delAddress.doorNumber}
              </Text>
              <Text style={styles.text}>
                {invoiceDocument.delAddress.zipCode}{" "}
                {invoiceDocument.delAddress.city}
              </Text>
              <Text style={styles.text}>
                {invoiceDocument.delAddress.province ?? ""}{" "}
                {invoiceDocument.delAddress.country}
              </Text>
              {invoiceDocument.delAddress.floor ? (
                <Text style={styles.text}>
                  Étage: {invoiceDocument.delAddress.floor}
                </Text>
              ) : (
                <></>
              )}
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader2}>
                <Text style={styles.tableCell}>Quantité</Text>
              </View>
              <View style={styles.tableColHeader1}>
                <Text style={styles.tableCell}>Nom</Text>
              </View>
              <View style={styles.tableColHeader3}>
                <Text style={styles.tableCell}>Prix</Text>
              </View>
              <View style={styles.tableColHeader4}>
                <Text style={styles.tableCell}>Remise</Text>
              </View>
              <View style={styles.tableColHeader5}>
                <Text style={styles.tableCell}>Sous-Total</Text>
              </View>
            </View>
            {invoiceDocument.document_products.map((docprod) => (
              <View key={docprod.id} style={styles.tableRow}>
                <View style={styles.tableCol2}>
                  <Text style={styles.tableCell}>{docprod.amount}</Text>
                </View>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>{docprod.name}</Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableCellR}>
                    {formatCurrency(docprod.value)}
                  </Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCellR}>
                    {formatCurrency(docprod.discount)}
                  </Text>
                </View>
                <View style={styles.tableCol5}>
                  <Text style={styles.tableCellR}>
                    {formatCurrency(docprod.subTotal)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              borderWidth: 1,
              paddingHorizontal: 5,
              height: 50,
            }}
          >
            <Text style={styles.text}>
              Signature pour accord - Handtekening voor akkoord
            </Text>
          </View>
          <View
            style={{
              marginVertical: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 5,
              marginTop: "auto",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                borderRight: "1",
                justifyContent: "center",
                padding: 5,
              }}
            >
              <View style={styles.row_jb}>
                <Text style={styles.text}>Total TVA - BTW</Text>
                <Text style={styles.text}>
                  {formatCurrency(
                    invoiceDocument.document_products.reduce(
                      (accumulator, currentItem) => {
                        return accumulator + currentItem.taxSubTotal;
                      },
                      0,
                    ),
                  )}
                </Text>
              </View>
              <View style={styles.row_jb}>
                <Text style={styles.text}>Total excl. TVA - BTW</Text>
                <Text style={styles.text}>
                  {formatCurrency(
                    invoiceDocument.document_products.reduce(
                      (accumulator, currentItem) => {
                        return accumulator + currentItem.subTotal;
                      },
                      0,
                    ) -
                      invoiceDocument.document_products.reduce(
                        (accumulator, currentItem) => {
                          return accumulator + currentItem.taxSubTotal;
                        },
                        0,
                      ),
                  )}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                justifyContent: "center",
                padding: 5,
              }}
            >
              <View style={{ ...styles.row_jb, borderBottom: 1 }}>
                <Text style={styles.text}>Total</Text>
                <Text style={styles.text}>
                  {formatCurrency(
                    invoiceDocument.document_products.reduce(
                      (accumulator, currentItem) => {
                        return accumulator + currentItem.subTotal;
                      },
                      0,
                    ),
                  )}
                </Text>
              </View>
              <View style={{ ...styles.row_jb, borderBottom: 1 }}>
                <Text style={styles.text}>Deja paye - Al betaald</Text>
                <Text style={styles.text}>
                  {formatCurrency(
                    invoiceDocument.payments
                      .filter((payment) => !payment.deleted && payment.verified)
                      .reduce((accumulator, currentItem) => {
                        return accumulator + currentItem.value;
                      }, 0),
                  )}
                </Text>
              </View>

              <View style={{ ...styles.row_jb, borderBottom: 1 }}>
                <Text style={styles.text}>A payer - Te betalen</Text>
                <Text style={styles.text}>
                  {formatCurrency(
                    invoiceDocument.document_products.reduce(
                      (accumulator, currentItem) => {
                        return accumulator + currentItem.subTotal;
                      },
                      0,
                    ) -
                      invoiceDocument.payments
                        .filter(
                          (payment) => !payment.deleted && payment.verified,
                        )
                        .reduce((accumulator, currentItem) => {
                          return accumulator + currentItem.value;
                        }, 0),
                  )}
                </Text>
              </View>
              <View style={styles.row_jb}>
                <Text style={styles.text}>Date Echeance - Vervaldatum</Text>
                <Text style={styles.text}>
                  {formatDateAPIToBe(addDaysToDate(invoiceDocument.date, 14))}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
