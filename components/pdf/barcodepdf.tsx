import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  barcodeContainer: {
    display: "flex",
    padding: 2,
    paddingBottom: 3,
    paddingTop: 6,
    alignItems: "center",
    flexDirection: "column",
    width: "33%",
    borderWidth: 1, // Explicitly set border width
    borderColor: "black", // Explicitly set border color
    borderStyle: "solid", // Ensure border is visible
  },
  barcodeImage: {
    width: "95%",
  },
  barcodeText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
  },
});

const PDFBarcode = ({ value, png }: { value: string; png: string }) => {
  const barcodeList = Array(27).fill({ value, png });

  const rows = [];
  for (let i = 0; i < barcodeList.length; i += 3) {
    rows.push(barcodeList.slice(i, i + 3));
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(({ value, png }, colIndex) => (
              <View
                key={`${value}-${colIndex}`}
                style={styles.barcodeContainer}
              >
                <Image src={png} style={styles.barcodeImage} />
                <Text style={styles.barcodeText}>{value}</Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PDFBarcode;
