import React, { useState, useEffect, useRef } from "react";
import "./ImageGallery.css";

export default function ImageGallery() {
  // One of the things I am unable to do is have that grey background of the images if the images have an alpha
  // channel. At the moment my images all have a white background as that's default. I think this may require
  // some basic image processing, which I will have to look up properly.

  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [selectedThumb, setSelectedThumb] = useState(null);
  const thumbnailsContainerRef = useRef(null);

  const addImages = (event) => {
    const files = [...event.target.files];
    const newImages = [...files, ...images];
    if (newImages.length > 10) {
      newImages.length = 10;
    }
    setImages(newImages);
    if (newImages.length > 0) {
      // Initializing the first MainImage
      setMainImage(URL.createObjectURL(newImages[0]));
      setSelectedThumb(0);
    }
  };

  useEffect(() => {
    // Running this to make space for the x-axis scrollbar; reliant on images dependency
    const container = thumbnailsContainerRef.current;

    if (container.scrollWidth > container.clientWidth) {
      container.classList.add("has-scrollbar");
    } else {
      container.classList.remove("has-scrollbar");
    }
  }, [images]);

  const handleThumbnailClick = (image, index) => {
    setMainImage(URL.createObjectURL(image));
    setSelectedThumb(index);
  };

  return (
    <div className="image-gallery">
      <div className="thumbnails-wrapper">
        <div
          className="thumbnail add-thumbnail"
          onClick={() => document.getElementById("image-upload").click()}
        >
          +
        </div>
        <div className="thumbnails-container" ref={thumbnailsContainerRef}>
          {/* Need this reference for being able to track if scroll-x is 
          visible so we can make space for it in the thumbnail-container div */}
          <div className="thumbnails">
            {/* Map through first 5 elements or create 5 empty boxes */}
            {[...Array(5)].map((element, index) => (
              <div
                key={index}
                className={`thumbnail ${
                  selectedThumb === index ? "active" : ""
                }`}
                onClick={
                  images[index]
                    ? () => handleThumbnailClick(images[index], index)
                    : null
                }
              >
                {images[index] && (
                  <img
                    src={URL.createObjectURL(images[index])}
                    alt="thumbnail"
                  />
                )}
              </div>
            ))}
            {/* Map through thumbnails greater than 5 */}
            {images.length > 5 &&
              images.map(
                (image, index) => (
                  index >= 5 && (
                    <div
                      key={index}
                      className={`thumbnail ${
                        selectedThumb === index ? "active" : ""
                      }`}
                      onClick={() => handleThumbnailClick(image, index)}
                    >
                      <img src={URL.createObjectURL(image)} alt="thumbnail" />
                    </div>
                  )
              ))}
          </div>
        </div>
      </div>
      <div
        className="main-box"
        onClick={() => document.getElementById("image-upload").click()}
        style={{
          backgroundImage: mainImage ? `url(${mainImage})` : "none",
          backgroundColor: mainImage ? "#ebebeb" : "rgb(235, 246, 255)",
        }}
      >
        {!mainImage && (
          <div className="main-box-text-container">
            <div className="upload-text">Add Images ( max 10 )</div>
            <div className="support-text">
              Supports: &lt;allowed formats&gt;
            </div>
          </div>
        )}
      </div>
      <input
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={addImages}
      />
    </div>
  );
}
