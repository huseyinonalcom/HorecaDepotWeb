import useTranslation from "next-translate/useTranslation";
import { getProjects } from "../api/public/projects";
import Layout from "../../components/public/layout";
import Link from "next/link";
import Head from "next/head";

type Props = {
  projects;
};

export default function References({ projects }: Props) {
  const { t, lang } = useTranslation("common");
  return (
    <Layout>
      <Head>
        <title>Horeca Depot</title>
        <meta name="description" content="" />
        <meta name="language" content={lang} />
      </Head>

      <h1 className="bg-black pt-2 text-center text-4xl font-bold text-white">
        {t("Our Projects")}
      </h1>
      <div className="flex h-[70px] flex-col justify-around bg-black shadow-lg">
        <div className="text-md flex flex-row items-center justify-center font-bold text-gray-300">
          <Link href="/" className="duration-700 hover:text-white">
            {t("Home")}
          </Link>
          <p className="mx-2 font-bold">/</p>
          <p className="text-white underline decoration-white decoration-solid decoration-4 underline-offset-8">
            {t("Our Projects")}
          </p>
        </div>
      </div>
      <div className="mx-auto mb-2 flex w-[95%] flex-col items-center justify-center bg-white p-3 shadow-md">
        <div className="flex w-full flex-col items-center">
          {projects &&
            projects.map((project, index) => (
              <div
                key={project.id}
                className="aspect-[15/14] h-[280px] w-[350px] pt-10 md:h-[40vw] md:w-[50vw]"
              >
                <div className="relative h-min w-full duration-500">
                  <img
                    draggable={false}
                    src={`https://hdcdn.hocecomv1.com${project.cover.at(0).url.replace("https://hdcdn.hocecomv1.com", "")}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    alt={project.title}
                    className="z-10"
                  />
                  <div className="absolute -bottom-5 z-20 flex w-full flex-col items-center justify-center">
                    <Link
                      className="z-20 -mt-12 bg-white px-6 py-4 font-bold text-black duration-300 hover:bg-black hover:text-white"
                      href={`/projects/${project.id}`}
                    >
                      {project.title}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const projects = await getProjects();

  return {
    props: {
      projects,
    },
  };
}
