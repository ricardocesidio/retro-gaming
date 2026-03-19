import { useState } from 'react';

export default function TestUpload() {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    console.log('TEST FILES:', e.target.files);
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Upload</h2>
      <input type="file" multiple accept="image/*" onChange={handleImageChange} />
      <div style={{ marginTop: 10 }}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img.preview}
            alt=""
            style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 8 }}
          />
        ))}
      </div>
    </div>
  );
}
