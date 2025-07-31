import TextareaOutlined from "../inputs/textarea_outlined";
import useTranslation from "next-translate/useTranslation";
import { FiMessageSquare } from "react-icons/fi";
import InputOutlined from "../inputs/outlined"; 

const ContactForm = () => {
  const { t } = useTranslation("common");
  return (
    <form
      className="mx-auto flex w-[95%] flex-col items-center justify-center gap-2"
      action="https://formsubmit.co/info@horecadepot.be"
      encType="multipart/form-data"
      method="POST"
    >
      <h2 className="flex flex-row items-center gap-2 text-4xl font-bold text-[#363332]">
        {t("Send us a message")}
        <FiMessageSquare />
      </h2>
      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="w-full md:w-6/12">
          <InputOutlined
            rounded
            required
            type="text"
            name="Name"
            label={t("Your Name")}
          />
        </div>
        <div className="w-full md:w-6/12">
          <InputOutlined
            rounded
            required
            type="text"
            name="E-mail"
            label={t("Your E-mail")}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="w-full md:w-6/12">
          <InputOutlined
            rounded
            type="text"
            name="Phone"
            label={t("Your phone number")}
          />
        </div>
        <div className="w-full md:w-6/12">
          <InputOutlined
            rounded
            type="text"
            name="Company"
            label={t("The name of your company")}
          />
        </div>
      </div>

      <div className="w-full">
        <TextareaOutlined
          rounded
          required
          name="Message"
          label={t("Your message")}
        />
      </div>

      <input type="text" name="_honey" className="hidden" />
      <input type="hidden" name="_captcha" value="true" />
      <input type="hidden" name="_template" value="box" />

      <button
        name="Send"
        aria-label="Send"
        type="submit"
        className="w-full rounded-2xl bg-[#524f4e] py-2 font-bold text-white duration-500 hover:bg-[#363332]"
      >
        {t("Send")}
      </button>
    </form>
  );
};

export default ContactForm;
