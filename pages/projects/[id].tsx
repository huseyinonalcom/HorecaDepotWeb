import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/public/layout";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { getProjectByID } from "../api/projects/public/getprojectbyid";
import { getAllProjectIDs } from "../api/projects/public/getallprojectids";
import ImageWithURL from "../../components/common/image";

type Props = {
  project;
};

const ProjectPage = ({ project }: Props) => {
  const { t, lang } = useTranslation("common");

  return (
    <Layout>
      <Head>
        <title>Horeca Depot</title>
        <meta name="description" content="" />
        <meta name="language" content={lang} />
      </Head>

      <h1 className="bg-black pt-2 text-center text-4xl font-bold text-white">
        {project.title}
      </h1>
      <div className="flex h-[70px] flex-col justify-around bg-black shadow-lg">
        <div className="text-md flex flex-row items-center justify-center font-bold text-gray-300">
          <Link href="/" className="duration-700 hover:text-white">
            {t("Home")}
          </Link>
          <p className="mx-2 font-bold">/</p>
          <Link href="/projects" className="duration-700 hover:text-white">
            {t("Our Projects")}
          </Link>
          <p className="mx-2 font-bold">/</p>
          <p className="text-white underline decoration-white decoration-solid decoration-4 underline-offset-8">
            {project.title}
          </p>
        </div>
      </div>
      <div className="mx-auto mb-2 flex w-[95%] flex-col items-center justify-center bg-white p-3 shadow-md">
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {project.images.map((image, index) => (
            <div key={index} className="relative min-h-[200px] min-w-[200px]">
              <ImageWithURL
                sizes="(max-width: 768px) 95vw, (max-width: 1024px) 48vw, 20vw"
                fill
                style={{ objectFit: "contain" }}
                alt={`${image.name.split(".")[0]}`}
                src={image.url}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

type Params = {
  params: {
    id: string;
  };
};

export const getStaticProps = async ({ params }: Params) => {
  const project = await getProjectByID(Number.parseInt(params.id));

  return {
    props: { project },
    revalidate: 900,
  };
};

export async function getStaticPaths({}) {
  const result = await getAllProjectIDs();
  const allProductIDs: number[] = result;
  return {
    paths: allProductIDs.map((ID) => {
      return {
        params: {
          id: ID.toString(),
        },
      };
    }),
    fallback: "blocking",
  };
}

export default ProjectPage;
