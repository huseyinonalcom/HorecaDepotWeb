export const uploadFileToAPI = async ({ file }): Promise<any> => {
  let data;
  const formData = new FormData();
  formData.append("file", file);

  try {
    const request = await fetch("/api/files/admin/sendfile", {
      method: "POST",
      body: formData,
    });

    if (request.status == 201) {
      const res = await request.json();
      data = res;
    } else {
    }
  } catch (e) {}

  return data;
};
