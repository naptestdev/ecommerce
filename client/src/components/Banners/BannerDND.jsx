import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { resizeImage } from "../../services/image";
import { useState } from "react";

export default function BannerDND({ data }) {
  const [images, setImages] = useState(data);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    setImages((prev) => {
      return reorder(prev, result.source.index, result.destination.index);
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {images.map((banner, index) => (
              <Draggable
                key={banner._id}
                draggableId={banner._id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={resizeImage(banner.url, 100, 50, "fill")}
                      alt=""
                    />

                    <p>{banner._id}.png</p>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
