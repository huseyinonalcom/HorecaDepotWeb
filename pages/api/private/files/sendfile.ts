import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import { createReadStream } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

function streamToBlob(stream, mimeType) {
  if (mimeType != null && typeof mimeType !== "string") {
    throw new Error("Invalid mimetype, expected string.");
  }
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream
      .on("data", (chunk) => chunks.push(chunk))
      .once("end", () => {
        const blob =
          mimeType != null
            ? new Blob(chunks, { type: mimeType })
            : new Blob(chunks);
        resolve(blob);
      })
      .once("error", reject);
  });
}

export default async function sendfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const form = new IncomingForm();

    await form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).send("Error processing the request");
      }

      const file = files.file;

      const reader = createReadStream(file[0].filepath);

      const fileBlob = await streamToBlob(reader, file[0].mimeType);

      try {
        const fetchUrl = `${process.env.API_URL}/api/upload`;
        const formData = new FormData();
        formData.append("files", fileBlob as Blob, file[0].originalFilename);

        const response = await fetch(fetchUrl, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${req.cookies["j"]}`,
          },
        });
        if (response.status == 200) {
          const answer = await response.json();

          return res.status(201).json(answer[0]);
        } else {
          return res.status(400).send("Bad request.");
        }
      } catch (error) {
        return res.status(500).send("Server error.");
      }
    });
  } else {
    return res.status(405).send("Method not allowed.");
  }
}
