import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import formatDateAPIToBe from "../../api/utils/formatdateapibe";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: `/fonts/Roboto-Regular.ttf`,
    },
    {
      src: `/fonts/Roboto-Medium.ttf`,
      fontWeight: "medium",
    },
    {
      src: `/fonts/Roboto-Bold.ttf`,
      fontWeight: "bold",
    },
    {
      src: `/fonts/Roboto-Black.ttf`,
      fontWeight: "heavy",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  subHeader: {
    fontFamily: "Roboto",
    fontWeight: "heavy",
    fontSize: 12,
    textAlign: "left",
    marginBottom: 2,
  },
  text: {
    fontSize: 12,
    textAlign: "left",
  },
  table: {
    marginVertical: 2,
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
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
    fontFamily: "Roboto",
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
    fontFamily: "Roboto",
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
    fontFamily: "Roboto",
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
    fontFamily: "Roboto",
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
    fontFamily: "Roboto",
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
  tableCellBold: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    fontFamily: "Roboto",
    fontWeight: "heavy",
  },
  tableCellBoldR: {
    marginLeft: "auto",
    marginRight: "1",
    marginTop: 5,
    fontSize: 10,
    fontFamily: "Roboto",
    fontWeight: "heavy",
  },
  row: {
    flexDirection: "row",
  },
  row_jb: {
    marginVertical: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flexDirection: "column",
  },
  col_jb: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

const PDFInvoice = ({ invoiceDocument }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.row_jb}>
          <View style={{ width: "45%" }}>
            <Image src={"/assets/header/logo.png"} />
          </View>
          <View style={styles.col}>
            <Text style={styles.text}>Rue de Ribaucourt 154</Text>
            <Text style={styles.text}>1080 Bruxelles, Belgique</Text>
            <Text style={styles.text}>+32 499 73 83 73</Text>
          </View>
          <View style={styles.col}>
            <Text
              style={{
                fontFamily: "Roboto",
                fontWeight: "heavy",
                fontSize: 16,
                textAlign: "right",
                marginBottom: 2,
              }}
            >
              Commande
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontWeight: "heavy",
                fontSize: 14,
                textAlign: "right",
                marginBottom: 2,
              }}
            >
              {invoiceDocument.prefix + invoiceDocument.number}
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontWeight: "heavy",
                fontSize: 14,
                textAlign: "right",
                marginBottom: 2,
              }}
            >
              {formatDateAPIToBe(invoiceDocument.date)}
            </Text>
          </View>
        </View>
        <View style={styles.row_jb}>
          <View style={styles.col}>
            {invoiceDocument.client.category == "Entreprise" ? (
              <>
                <Text style={styles.subHeader}>Facturé à:</Text>
                <Text style={styles.text}>
                  {invoiceDocument.client.company}
                </Text>
                <Text style={styles.text}>{invoiceDocument.client.taxID} </Text>
                <Text style={styles.text}>
                  {`${invoiceDocument.client.firstName} ${invoiceDocument.client.lastName}`}{" "}
                </Text>
                <Text style={styles.text}>{invoiceDocument.client.phone} </Text>
              </>
            ) : (
              <>
                <h4 className=" font-bold">Facturé à:</h4>
                <Text style={styles.text}>
                  {`${invoiceDocument.client.firstName} ${invoiceDocument.client.lastName}`}{" "}
                </Text>
                <Text style={styles.text}>{invoiceDocument.client.phone} </Text>
              </>
            )}
          </View>
          <View style={styles.col}>
            <Text style={styles.subHeader}>Addresse Facturation:</Text>
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
            <View style={styles.tableColHeader1}>
              <Text style={styles.tableCell}>Nom</Text>
            </View>
            <View style={styles.tableColHeader2}>
              <Text style={styles.tableCell}>Quantité</Text>
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
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell}>{docprod.name}</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>{docprod.amount}</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCellR}>
                  € {docprod.value.toFixed(2).toString().replaceAll(".", ",")}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCellR}>
                  €{" "}
                  {docprod.discount.toFixed(2).toString().replaceAll(".", ",")}
                </Text>
              </View>
              <View style={styles.tableCol5}>
                <Text style={styles.tableCellR}>
                  €{" "}
                  {docprod.subTotal.toFixed(2).toString().replaceAll(".", ",")}
                </Text>
              </View>
            </View>
          ))}
          <View key={0} style={styles.tableRow}>
            <View style={styles.tableCol1}>
              <Text style={styles.tableCellBold}></Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCellBold}>Total</Text>
            </View>
            <View style={styles.tableCol3}>
              <Text style={styles.tableCellBoldR}>
                €{" "}
                {invoiceDocument.document_products
                  .reduce((accumulator, currentItem) => {
                    return accumulator + currentItem.subTotal;
                  }, 0)
                  .toFixed(2)
                  .replaceAll(".", ",")}
              </Text>
            </View>
            <View style={styles.tableCol4}>
              <Text style={styles.tableCellBold}>A payer</Text>
            </View>
            <View style={styles.tableCol5}>
              <Text style={styles.tableCellBoldR}>
                €{" "}
                {(
                  invoiceDocument.document_products.reduce(
                    (accumulator, currentItem) => {
                      return accumulator + currentItem.subTotal;
                    },
                    0
                  ) -
                  invoiceDocument.payments.reduce(
                    (accumulator, currentItem) => {
                      return accumulator + currentItem.value;
                    },
                    0
                  )
                )
                  .toFixed(2)
                  .replaceAll(".", ",")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default PDFInvoice;
