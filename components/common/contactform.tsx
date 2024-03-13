import useTranslation from "next-translate/useTranslation";
import { MessageSquare } from "react-feather";
import InputOutlined from "../inputs/outlined";
import TextareaOutlined from "../inputs/textarea_outlined";

const ContactForm = () => {
  const { t } = useTranslation("common");
  return (
    <form
      className="flex flex-col mx-auto justify-center w-[95%] items-center gap-2"
      action="https://formsubmit.co/huseyin-_-onal@hotmail.com"
      encType="multipart/form-data"
      method="POST"
    >
      <h2 className="text-3xl font-bold flex flex-row items-center gap-2 text-[#363332]">
        {t("Send us a message")}
        <MessageSquare />
      </h2>
      <div className="flex flex-col md:flex-row w-full gap-2">
        <div className="w-full md:w-6/12">
          <InputOutlined required type="text" name="Name" label="Your Name" />
        </div>
        <div className="w-full md:w-6/12">
          <InputOutlined required type="text" name="E-mail" label="Your E-mail" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-2">
        <div className="w-full md:w-6/12">
          <InputOutlined type="text" name="Phone" label="Your phone number" />
        </div>
        <div className="w-full md:w-6/12">
          <InputOutlined type="text" name="Company" label="The name of your company" />
        </div>
      </div>

      <div className="w-full">
        <TextareaOutlined required name="Message" label="Your message" />
      </div>

      <input type="text" name="_honey" className="hidden" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="box" />

      <button type="submit" className="w-full py-2 duration-500 bg-[#524f4e] hover:bg-[#363332] font-bold text-white">
        {t("Send")}
      </button>
    </form>
  );
};

export default ContactForm;
