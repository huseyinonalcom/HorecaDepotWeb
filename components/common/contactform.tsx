import useTranslation from "next-translate/useTranslation";
import { MessageSquare } from "react-feather";

const ContactForm = () => {
  const { t, lang } = useTranslation("common");
  return (
    <form
      className="flex flex-col mx-auto justify-center w-[95%] items-center gap-2"
      action="https://formsubmit.co/horecadepothoreca@gmail.com"
      encType="multipart/form-data"
      method="POST"
    >
      <h2 className="text-3xl font-bold flex flex-row items-center gap-2 text-[#363332]">
        {t("Send us a message")}
        <MessageSquare />
      </h2>
      <div className="flex flex-col md:flex-row w-full gap-2">
        <div className="w-full md:w-6/12">
          <input
            required
            className="w-full p-2 border border-gray-300"
            type="text"
            name="nom"
            placeholder={t("Votre Nom")}
          />
        </div>
        <div className="w-full md:w-6/12">
          <input
            required
            className="w-full p-2 border border-gray-300"
            type="email"
            name="email"
            placeholder={t("Your e-mail address")}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-2">
        <div className="w-full md:w-6/12">
          <input
            className="w-full p-2 border border-gray-300"
            type="text"
            name="telephone"
            placeholder={t("Your phone number")}
          />
        </div>
        <div className="w-full md:w-6/12">
          <input
            required
            className="w-full p-2 border border-gray-300"
            type="text"
            name="societe"
            placeholder={t("The name of your company")}
          />
        </div>
      </div>

      <div className="w-full">
        <textarea
          required
          className="w-full p-2 border border-gray-300 h-[120px]"
          name="message"
          placeholder={t("Your message")}
        />
      </div>

      <input type="text" name="_honey" className="hidden" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="box" />

      <button
        type="submit"
        className="w-full py-2 duration-500 bg-[#524f4e] hover:bg-[#363332] font-bold text-white"
      >
        {t("Send")}
      </button>
    </form>
  );
};

export default ContactForm;
