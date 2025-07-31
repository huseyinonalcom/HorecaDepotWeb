import useTranslation from "next-translate/useTranslation";
import { Color } from "../../api/interfaces/color";
import { FiPlusCircle } from "react-icons/fi";
import { useEffect, useState } from "react";

export const ColorChooser = ({
  onSelect,
  selectedColor,
}: {
  onSelect: (color: Color) => void;
  selectedColor?: Color;
}) => {
  const { t } = useTranslation("common");
  const [colors, setColors] = useState<Color[]>([]);
  const [newColor, setNewColor] = useState<Color>({
    name: "",
  });
  const [error, setError] = useState<boolean>(false);

  const getColors = async () => {
    let colors: Color[] = [];
    await fetch("/api/private/colors", {
      method: "GET",
    }).then(async (data) => {
      colors = (await data.json()).result;
    });
    return colors;
  };

  useEffect(() => {
    getColors().then((colors) => {
      setColors(colors);
    });
  }, []);

  const postColor = async (color: Color) => {
    let res = {
      error: "",
    };
    await fetch("/api/private/colors", {
      method: "POST",
      body: JSON.stringify(color),
    })
      .then(async (ans) => {
        let response = await ans.json();
        if (response.status != 200) {
          res = { error: "fail" };
        }
        getColors().then((colors) => {
          setColors(colors);
        });
      })
      .catch((error) => {
        alert(error);
      });
    return res;
  };

  const putColor = async (color: Color) => {
    await fetch(`/api/private/colors?id=${color.id}`, {
      method: "PUT",
      body: JSON.stringify(color),
    })
      .then(() => {
        getColors().then((colors) => {
          setColors(colors);
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className="flex flex-col rounded-md border-2 border-black">
      <div className="max-h-64 overflow-y-auto">
        <div className="grid grid-cols-1 border-b-2 border-black">
          {colors.map((color) => (
            <div
              key={color.id}
              className="flex w-full flex-row items-center justify-between first:rounded-t-md last:rounded-b-md odd:bg-gray-500 even:bg-blue-500"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(color);
                }}
                className="w-full rounded-md p-2 text-left text-white"
              >
                {color.name} - {color.code}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <input
          type="text"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          placeholder={t("name")}
          value={newColor.name}
          onChange={(e) =>
            setNewColor((nc) => ({ ...nc, name: e.target.value }))
          }
          className={`m-1 w-full border-2 ${error ? "border-red-500" : "border-black"}`}
        />
        <input
          type="text"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          placeholder={t("code")}
          value={newColor.code}
          onChange={(e) =>
            setNewColor((nc) => ({ ...nc, code: e.target.value }))
          }
          className={`m-1 w-full border-2 ${error ? "border-red-500" : "border-black"}`}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (newColor.name.length > 0 && newColor.code.length > 0) {
              postColor(newColor).then((res) => {
                if (res.error === "fail") {
                  setError(true);
                }
              });
            } else {
              setError(true);
            }
          }}
        >
          <FiPlusCircle color="green" />
        </button>
      </div>
    </div>
  );
};
