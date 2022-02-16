import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useRef, useState } from "react";

import Alert from "../Alert";
import ImageView from "../ImageView";
import { Spin } from "react-cssfx-loading";
import { resizeImage } from "../../shared/constant";
import { updateBanners } from "../../services/banners";
import { uploadImage } from "../../services/uploadImage";

export default function BannerList({ data }) {
  const [images, setImages] = useState(data);

  const [loading, setLoading] = useState(false);
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [isImageViewOpened, setIsImageViewOpened] = useState(false);
  const [imageViewSrc, setImageViewSrc] = useState("");

  const fileInputRef = useRef(null);

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

      uploadImage(file, "banners")
        .then((res) => {
          setImages([...images, res.secure_url]);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleSave = () => {
    setLoading(true);

    updateBanners(images)
      .then(() => {
        setIsAlertOpened(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="flex justify-center px-[5vw] md:px-[15vw] relative flex-grow">
        <div className="w-full">
          <div className="flex flex-col items-stretch my-10">
            {loading && (
              <div className="absolute top-0 left-0 w-full h-full bg-[#0000002d] z-10 flex justify-center items-center">
                <Spin color="#2874F0" />
              </div>
            )}
            <div className="flex justify-between flex-wrap">
              <h1 className="text-3xl">Băng rôn quảng cáo</h1>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-primary text-white py-2 px-3 hover:brightness-[115%] transition"
                >
                  <i className="fas fa-save"></i>
                  <span> Lưu</span>
                </button>

                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-primary text-white py-2 px-3 hover:brightness-[115%] transition"
                >
                  <i className="fas fa-upload"></i>
                  <span> Tải lên</span>
                </button>
              </div>

              <input
                hidden
                className="hidden"
                onChange={handleInputChange}
                type="file"
                ref={fileInputRef}
                accept="image/*"
              />
            </div>

            <p className="mb-3 text-gray-500">Kích cỡ tốt nhất (3000 x 560)</p>

            <div className="flex justify-center">
              <div className="w-full max-w-[500px]">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="list">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {images.map((banner, index) => (
                          <Draggable
                            key={banner}
                            draggableId={banner}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center justify-between mt-3"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    onClick={() => {
                                      setImageViewSrc(banner);
                                      setIsImageViewOpened(true);
                                    }}
                                    className="w-[100px] h-[50px] cursor-pointer object-cover"
                                    src={resizeImage(banner, 100, 50)}
                                    alt=""
                                  />

                                  <p>{banner.split("/").slice(-1)[0]}</p>
                                </div>

                                {images.length > 1 && (
                                  <button onClick={() => removeImage(banner)}>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <Alert
        text="Đã cập nhật băng rôn quảng cáo!"
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
      />

      <ImageView
        src={imageViewSrc}
        isOpened={isImageViewOpened}
        setIsOpened={setIsImageViewOpened}
      />
    </>
  );
}
