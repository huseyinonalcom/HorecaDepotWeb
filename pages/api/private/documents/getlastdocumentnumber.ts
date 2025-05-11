import apiRoute from "../../../../api/api/apiRoute";

const fetchUrl = `${process.env.API_URL}/api/documents`;

const fetchParams =
  "sort[0]=number:desc&pagination[page]=1&pagination[pageSize]=1&fields[0]=number";

function nextDocumentNumber(lastDocumentNumber) {
  const today = new Date();
  const currentYear = today.getFullYear().toString();
  if (!lastDocumentNumber) {
    return `${currentYear}0000001`;
  }

  const s = lastDocumentNumber.toString();
  const yearPart = s.slice(0, 4);
  const seqPart = s.slice(4);
  const seqLength = seqPart.length;

  let nextSeq;
  if (yearPart === currentYear) {
    nextSeq = String(Number(seqPart) + 1);
  } else {
    nextSeq = "1";
  }

  nextSeq = nextSeq.padStart(seqLength, "0");

  return `${currentYear}${nextSeq}`;
}

export const getLastDocumentNumber = async ({
  authToken,
  type,
}: {
  authToken: string;
  type: "Commande" | "Reservation";
}) => {
  if (type != "Commande" && type != "Reservation") {
    throw new Error("Invalid document type");
  }
  const requestLastDocument = await fetch(
    fetchUrl + `?filters[type][$eq]=${type}&` + fetchParams,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!requestLastDocument.ok) {
    throw new Error("Failed to get last document number");
  } else {
    const answer = await requestLastDocument.json();
    const lastDocumentNumber = answer.data[0]?.number;
    return { result: nextDocumentNumber(lastDocumentNumber) };
  }
};

export default apiRoute({
  authChallenge: async (req) => {
    if (!req.cookies.cj) {
      return false;
    } else {
      return true;
    }
  },
  endpoints: {
    GET: {
      func: async (req, res) => {
        return await getLastDocumentNumber({
          type: req.query.type as "Commande" | "Reservation",
          authToken: req.cookies.cj,
        });
      },
    },
  },
});
