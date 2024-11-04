import { DetailedHTMLProps } from "react";

interface Props
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  selectionList: any[];
  selectableList: number[];
  selectedList: number[];
  onClickAdd: (id: number) => void;
  onClickRemove: (id: number) => void;
  labelKey: string;
  valueKey: string;
}

const MultiSelectionInput = ({
  label,
  selectableList,
  selectedList,
  onClickAdd,
  onClickRemove,
  valueKey,
  labelKey,
  selectionList,
}: Props) => {
  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <p>{label}</p>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "45%",
            overflowY: "auto",
            maxHeight: "200px",
            gap: 2,
            padding: 2,
            backgroundColor: "lightgray",
          }}
        >
          {selectedList.length > 0 &&
            selectedList?.map((id) => {
              const selectedItem = selectionList.find(
                (el) => el[valueKey] === id,
              );
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onClickRemove(id)}
                  className="hover:bg-blue-300"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <p>
                    {"- "}
                    {selectedItem[labelKey]}
                  </p>
                </button>
              );
            })}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "45%",
            overflowY: "auto",
            maxHeight: "200px",
            gap: 2,
            padding: 2,
            backgroundColor: "lightgray",
          }}
        >
          {selectableList
            .filter((id) => !selectedList.includes(id))
            .map((id) => {
              const selectableItem = selectionList.find(
                (el) => el[valueKey] === id,
              );
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onClickAdd(id)}
                  className="hover:bg-blue-300"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <p>
                    {"+ "}
                    {selectableItem[labelKey]}
                  </p>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MultiSelectionInput;
