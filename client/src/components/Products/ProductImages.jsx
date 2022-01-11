import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useRef, useState } from "react";

import { Spin } from "react-cssfx-loading";
import { resizeImage } from "../../services/image";
import { uploadImage } from "../../services/api/uploadImage";

export default function ProductImages({ images, setImages }) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const removeImage = (url) => {
    let clone = JSON.parse(JSON.stringify(images));

    clone = clone.filter((image) => image !== url);

    setImages(clone);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.destination.index === result.source.index) return;

    const reordered = reorder(
      [...images],
      result.source.index,
      result.destination.index
    );

    setImages(reordered);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];

    if (file.type.startsWith("image")) {
      setLoading(true);

      uploadImage(file, "products")
        .then((res) => {
          setImages([...images, res.secure_url]);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl">Images</h1>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="bg-primary text-white py-2 px-3 hover:brightness-[115%] transition flex items-center gap-2 disabled:cursor-default disabled:!brightness-90"
        >
          {loading ? (
            <Spin color="#ffffff" width="20px" height="20px" />
          ) : (
            <i className="fas fa-upload"></i>
          )}
          <span> Upload</span>
        </button>

        <input
          ref={inputRef}
          hidden
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {images.map((image, index) => (
                <Draggable key={image} draggableId={image} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between mt-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          className="w-[70px] h-[70px]"
                          src={resizeImage(image, 70, 70, "fill")}
                          alt=""
                        />

                        <p>Image {index + 1}.png</p>
                      </div>

                      {images.length > 1 && (
                        <button onClick={() => removeImage(image)}>
                          <i className="fas fa-times text-red-500"></i>
                        </button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
