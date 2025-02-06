import React, { useState } from "react";

const UploadClothes = () => {
  const [image, setImage] = useState(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="upload-clothes">
      {/* Upload button */}
      <label>
        Upload an Image
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>

      {image && (
        <div className="image-preview">
          <h3>Preview</h3>
          <img src={image} alt="Clothes" style={{ width: "100%", maxWidth: "100px" }} />
        </div>
      )}
    </div>
  );
};

export default UploadClothes;
