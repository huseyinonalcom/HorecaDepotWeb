import { useEffect, useState } from "react";
import { Color } from "../../api/interfaces/color";
import { PlusCircle } from "react-feather";

export const ColorChooser = ({
  onSelect,
  selectedColor,
}: {
  onSelect: (color: Color) => void;
  selectedColor?: Color;
}) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [newColor, setNewColor] = useState<Color>();

  const getColors = async () => {
    let colors: Color[] = [];
    await fetch("/api/colors/getcolors", {
      method: "GET",
    }).then(async (data) => {
      colors = await data.json();
    });
    return colors;
  };

  useEffect(() => {
    getColors().then((colors) => {
      setColors(colors);
    });
  }, []);

  const postColor = async (color: Color) => {
    await fetch("/api/colors/postcolor", {
      method: "POST",
      body: JSON.stringify(newColor),
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

  const putColor = async (color: Color) => {
    await fetch(`/api/colors/putcolor?id=${color.id}`, {
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
              className="flex w-full flex-row items-center justify-between"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(color);
                }}
                className="w-full rounded-md bg-blue-500 p-2 text-left text-white odd:bg-gray-500"
              >
                {color.name}
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
          onChange={(e) => setNewColor({ name: e.target.value })}
          className="m-1 w-full"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            postColor(newColor);
          }}
        >
          <PlusCircle color="green" />
        </button>
      </div>
    </div>
  );
};
