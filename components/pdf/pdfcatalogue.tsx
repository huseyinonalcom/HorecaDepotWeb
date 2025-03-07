import { getCoverImageUrl } from "../../api/utils/getprodcoverimage";
import useTranslation from "next-translate/useTranslation";
import componentThemes from "../componentThemes";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  PDFDownloadLink,
} from "@react-pdf/renderer";

export const PDFCatalogue = ({ products }) => {
  return (
    <Document>
      <Page
        size="A4"
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 5.6,
          paddingBottom: 5.5,
          paddingHorizontal: 8,
          fontSize: 9,
        }}
      >
        {products.map((prod) => (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
            key={prod.id}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#c5c5c5",
                gap: 5,
              }}
            >
              <Text>{prod.categories.at(0).localized_name["fr"]}</Text>
              <Text>{prod.name}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Image
                src={`https://hdcdn.hocecomv1.com${getCoverImageUrl(prod)}`}
                style={{ height: 50, width: 50, objectFit: "contain" }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    borderBottom: "1px dotted black",
                  }}
                >
                  <Text
                    style={{
                      minWidth: "25%",
                    }}
                  >
                    {prod.product_color?.name ?? prod.color ?? ""}
                  </Text>
                  <Text>
                    Stock:{" "}
                    {prod.shelves.reduce((acc, shelf) => acc + shelf.stock, 0)}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                  }}
                ></View>
              </View>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default function PDFCatalogueButton({ products }) {
  const { t } = useTranslation("common");
  return (
    <PDFDownloadLink
      fileName={`${t("catalogue")}.pdf`}
      document={<PDFCatalogue products={products} />}
      className={`${componentThemes.outlinedButton} flex flex-row items-center justify-center whitespace-nowrap text-xl`}
    >
      📄 <p className="ml-1">{t("Download PDF")}</p>
    </PDFDownloadLink>
  );
}
