import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sell() {
  // ... resto do código ...
  const navigate = useNavigate();
  
  // ESTADOS
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState(''); 
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); 
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [parcelSize, setParcelSize] = useState('');

  const handleSaveDraft = () => {
    const draft = {
      id: 'draft-' + Date.now(),
      title,
      category,
      subCategory,
      condition,
      price,
      description,
      isDraft: true,
      updatedAt: new Date().toLocaleString(),
    };

    const existingDrafts = JSON.parse(
      localStorage.getItem('myRetroDrafts') || '[]'
    );

    const updatedDrafts = [
      draft,
      ...existingDrafts.filter((d) => d.title !== title),
    ];

    localStorage.setItem('myRetroDrafts', JSON.stringify(updatedDrafts));
    alert('Draft saved successfully!');
  };

  // REFERÊNCIAS PARA SCROLL DE ERRO
  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const subCategoryRef = useRef(null);
  const conditionRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);
  const imagesRef = useRef(null);
  const parcelSizeRef = useRef(null);

  const subCategories = {
    consoles: [
      '3DO Interactive Multiplayer', 'Amiga CD32', 'Anbernic RG35XX', 'Asus ROG Ally', 
      'Atari 2600', 'Atari 5200', 'Atari Jaguar', 'Ayaneo', 'Commodore 64', 
      'Game Boy', 'Game Boy Advance', 'GameCube', 'Mega Drive/Genesis', 
      'Miyoo Mini', 'Neo Geo AES', 'Nintendo 3DS', 'Nintendo 64', 'Nintendo DS', 
      'Nintendo Entertainment System (NES)', 'Nintendo Switch', 'Nintendo Switch Lite', 
      'Nintendo Switch OLED', 'Nintendo Wii', 'Nintendo Wii U', 'Original Xbox', 
      'PC Engine/TurboGrafx-16', 'PlayStation 1', 'PlayStation 2', 'PlayStation 3', 
      'PlayStation 4', 'PlayStation 5', 'PlayStation Portable (PSP)', 'PlayStation Vita', 
      'Powkiddy', 'PSVR', 'PSVR2', 'Retroid Pocket', 'Sega Dreamcast', 'Sega Master System', 
      'Sega Saturn', 'Steam Deck', 'Super Nintendo (SNES)', 'Xbox 360', 'Xbox One', 
      'Xbox One S', 'Xbox One X', 'Xbox Series S', 'Xbox Series X', 'No brand indicated'
    ],
    games: [
      '3DO Interactive Multiplayer', 'Amiga CD32', 'Atari 2600', 'Atari 5200', 
      'Atari Jaguar', 'Atari Lynx', 'ColecoVision', 'Commodore 64', 'Game Boy', 
      'Game Boy Advance', 'Game Boy Color', 'GameCube', 'Intellivision', 
      'Mega Drive/Genesis', 'N-Gage', 'Neo Geo AES', 'Neo Geo Pocket Color', 
      'Nintendo 3DS', 'Nintendo 64', 'Nintendo DS', 'Nintendo DS Lite', 
      'Nintendo DSi', 'Nintendo Entertainment System (NES)', 'Nintendo Switch', 
      'Nintendo Switch Lite', 'Nintendo Switch OLED', 'Nintendo Wii', 
      'Nintendo Wii U', 'Odyssey', 'Original Xbox', 'PC Engine/TurboGrafx-16', 
      'PlayStation 1', 'PlayStation 2', 'PlayStation 3', 'PlayStation 4', 
      'PlayStation 5', 'PlayStation Portable (PSP)', 'PlayStation Vita', 
      'Sega Dreamcast', 'Sega Game Gear', 'Sega Master System', 'Sega Saturn', 
      'Sega SG-1000', 'Super Nintendo (SNES)', 'Vectrex', 'Virtual Boy', 
      'Xbox 360', 'Xbox One', 'Xbox One S', 'Xbox One X', 'Xbox Series S', 
      'Xbox Series X', 'No brand indicated'
    ],
    controllers: [
      '8BitDo Pro 2', '8BitDo SN30 Pro', 'DualSense (PS5)', 'DualSense Edge', 
      'DualShock 4', 'GameSir G8 Galileo', 'Logitech F310', 'NACON Revolution', 
      'Nintendo Pro Controller', 'PowerA Enhanced', 'Razer Wolverine', 
      'SteelSeries Stratus+', 'Xbox Controller', 'Xbox Elite Series 2', 'No brand indicated'
    ],
    'gaming-headsets': [
      'Corsair HS60', 'Corsair HS70', 'HyperX Cloud Alpha', 'HyperX Cloud II', 
      'JBL Quantum 400', 'Logitech G Pro X', 'Razer BlackShark V2', 
      'Sony Pulse 3D', 'SteelSeries Arctis 1', 'SteelSeries Arctis 7', 
      'Turtle Beach Stealth 600', 'Turtle Beach Stealth 700', 'No brand indicated'
    ],
    simulators: [
      'Fanatec CSL DD', 'Fanatec GT DD Pro', 'Logitech G29', 'Logitech G920', 
      'MOZA R3', 'MOZA R5', 'PXN V900', 'Thrustmaster T248', 'Thrustmaster T300RS', 
      'No brand indicated'
    ],
    'virtual-reality': [
      'HTC Vive', 'HTC Vive Pro', 'Meta Quest 2', 'Meta Quest 3', 'Meta Quest Pro', 
      'Oculus Rift S', 'PSVR', 'PSVR2', 'Valve Index', 'VR Accessories', 'VR Controllers', 
      'No brand indicated'
    ],
    books: [
      'Artbooks', "D&D Dungeon Master's Guide", "D&D Monster Manual", "D&D Player's Handbook", 
      'Graphic Novels', 'Magic: The Gathering Rulebooks', 'Manga', 'Strategy Guides', 
      'Warhammer Codex', 'No brand indicated'
    ],
    'trading-cards': [
      'Digimon TCG', 'Disney Lorcana', 'Flesh and Blood', 'Magic: The Gathering', 
      'Magic: The Gathering Commander', 'One Piece TCG', 'Pokémon TCG Booster Packs', 
      'Pokémon TCG Elite Trainer Box', 'Pokémon TCG Singles', 'Yu-Gi-Oh! Booster Packs', 
      'Yu-Gi-Oh! Structure Decks', 'No brand indicated'
    ],
    collectibles: [
      'amiibo Figures', 'Bandai SH Figuarts', 'Funko Pop Vinyls', 'Good Smile Company', 
      'Hot Toys 1/6 Scale', 'LEGO Nintendo Sets', 'LEGO Star Wars', 'Nendoroid Figures', 
      'S.H.Figuarts', 'Statues', 'Busts', 'Display Cases', 'No brand indicated'
    ],
    'retro-arcade': [
      'Arcade Machines', 'Arcade Sticks', 'CRT Monitors', 'Light Guns', 
      'Mini Arcade Consoles', 'Raspberry Pi Cases', 'Retro Handhelds', 'No brand indicated'
    ],
    apparel: [
      'Backpacks', 'Beanies', 'Caps & Hats', 'Hoodies', 'Keychains', 'Pin Badges', 
      'Socks', 'T-Shirts', 'No brand indicated'
    ],
    'pc-gaming': [
      'CPUs & Processors', 'GPUs & Graphics Cards', 'Intel i7', 'Mechanical Keyboards', 
      'Gaming Mice', 'Mouse Pads', 'PC Cases', 'RAM Memory', 'SSD Drives', 'No brand indicated'
    ],
    tabletop: [
      'Board Games', 'Card Games', 'Dice Sets', 'Dungeons & Dragons', 'Miniatures', 
      'Pathfinder RPG', 'Playing Cards', 'RPG Books', 'Warhammer 40K', 'No brand indicated'
    ],
    accessories: [
      'Cables & Adapters', 'Cartridges & Discs', 'Cases & Skins', 'Chargers', 
      'Controller Grips', 'Controller Skins', 'Cooling Fans', 'Docking Stations', 
      'HDMI Cables', 'Headset Stands', 'Memory Cards', 'Phone Mounts', 
      'Screen Protectors', 'USB Hubs', 'No brand indicated'
    ]
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); 
    if (value === '') { setPrice(''); return; }
    const numberValue = parseInt(value, 10);
    const formattedPrice = (numberValue / 100).toFixed(2);
    setPrice(formattedPrice);
  };

  const handleDragStart = (e, index) => { setDraggedIndex(index); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e, index) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = draggedIndex;
    if (dragIndex === null || dragIndex === dropIndex) return;
    setImages((prevImages) => {
      const newImages = [...prevImages];
      const [draggedImage] = newImages.splice(dragIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      return newImages;
    });
    setDraggedIndex(null);
  };
  const handleDragEnd = () => { setDraggedIndex(null); };

  const validateForm = () => {
    const newErrors = {};
    if (title.trim().length < 10) newErrors.title = 'Title is required and must have at least 10 characters';
    if (!category) newErrors.category = 'Category is required';
    if (!subCategory) newErrors.subCategory = 'Subcategory is required';
    if (!condition) newErrors.condition = 'Condition is required';
    const priceValue = parseFloat(price) || 0;
    if (!price || priceValue <= 0) newErrors.price = 'Price is required and must be greater than 0';
    if (description.trim().length < 20) newErrors.description = 'Description is required (min 20 chars)';
    if (images.length === 0) newErrors.images = 'You must add at least 1 photo';
    if (!parcelSize) newErrors.parcelSize = 'Please select a parcel size'; 

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const refs = {
        title: titleRef, category: categoryRef, subCategory: subCategoryRef,
        condition: conditionRef, price: priceRef, description: descriptionRef,
        images: imagesRef, parcelSize: parcelSizeRef
      };
      refs[firstErrorField]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (validFiles.length + images.length > 10) { alert('Maximum 10 images allowed'); return; }
    const newPreviews = validFiles.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newPreviews]);
  };

  const handleImageChange = (e) => { handleFiles(e.target.files); e.target.value = ''; };
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDropUpload = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => { setImages(prev => prev.filter((_, i) => i !== index)); };

 const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const novoAnuncio = {
      id: Date.now(), 
      title: title,
      category: category,
      subCategory: subCategory,
      condition: condition,
      price: price,
      description: description,
      image: images.length > 0 ? images[0].preview : '/images/placeholder.jpg', 
      date: new Date().toLocaleDateString()
    };

    const anunciosNoStorage = JSON.parse(localStorage.getItem('meusAnunciosRetro') || '[]');
    const listaAtualizada = [novoAnuncio, ...anunciosNoStorage];
    localStorage.setItem('meusAnunciosRetro', JSON.stringify(listaAtualizada));

    console.log('Anúncio guardado no LocalStorage!', novoAnuncio);
    
    setTitle(''); setCategory(''); setSubCategory(''); setCondition('');
    setPrice(''); setDescription(''); setImages([]); setErrors({}); setParcelSize('');
    
    navigate('/', { replace: true });
  };

  const isFormValid = 
    title.trim().length >= 10 && category && subCategory && condition && 
    price && parseFloat(price) > 0 && description.trim().length >= 20 && 
    images.length >= 1 && parcelSize !== ''; 

  return (
    <div className="sell-page">
      <div className="sell-container">
        <div className="sell-card">
          <h1>Post Ad</h1>
          <p>Fill all required fields to proceed.</p>

          <form className="sell-form" onSubmit={handleSubmit}>
            <div className="form-split-layout">
              <div className="form-left-col">
                <div className="form-group" ref={titleRef}>
                  <label>Ad Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: PlayStation 1 with 5 games" required />
                  {errors.title && <span className="error-text">{errors.title}</span>}
                </div>

                <div className="form-group" ref={categoryRef}>
                  <label>Category</label>
                  <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(''); }} required>
                    <option value="">Select Category</option>
                    <option value="accessories">Accessories</option>
                    <option value="apparel">Apparel & Merch</option>
                    <option value="books">Books & Mangás</option>
                    <option value="collectibles">Collectibles</option>
                    <option value="consoles">Consoles</option>
                    <option value="controllers">Controllers</option>
                    <option value="gaming-headsets">Gaming Headsets</option>
                    <option value="games">Games</option>
                    <option value="pc-gaming">PC Gaming Parts</option>
                    <option value="retro-arcade">Retro & Arcade</option>
                    <option value="simulators">Simulators</option>
                    <option value="tabletop">Tabletop Games</option>
                    <option value="trading-cards">Trading Cards</option>
                    <option value="virtual-reality">Virtual Reality</option>
                  </select>
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </div>

                <div className="form-group" ref={subCategoryRef}>
                  <label>Subcategory</label>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} disabled={!category} required>
                    <option value="">Select</option>
                    {category && subCategories[category]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  {errors.subCategory && <span className="error-text">{errors.subCategory}</span>}
                </div>

                <div className="form-group" ref={conditionRef}>
                  <label>Condition</label>
                  <select value={condition} onChange={(e) => setCondition(e.target.value)} required>
                    <option value="">Select</option>
                    <option value="new">New (sealed)</option>
                    <option value="like-new">Like new</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="for-parts">For parts</option>
                  </select>
                  {errors.condition && <span className="error-text">{errors.condition}</span>}
                </div>

                <div className="form-group" ref={priceRef}>
                  <label>Price (€)</label>
                  <input type="text" value={price} onChange={handlePriceChange} placeholder="Ex: 149.99" required />
                  {errors.price && <span className="error-text">{errors.price}</span>}
                </div>
              </div>

              <div className="form-right-col">
                <div className="desc-group">
                  <div className="form-group" ref={descriptionRef}>
                    <label>Description</label>
                    <textarea id="desc-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe condition..." maxLength={1000} required />
                    <div className="char-counter">{description.length}/1000 characters</div>
                    {errors.description && <span className="error-text">{errors.description}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group upload-section" ref={imagesRef}>
              <label>Images (max 10) {images.length >= 1 ? '(✓ at least 1 photo)' : '(required)'}</label>
              <div className={`upload-area ${dragActive ? 'drag-active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDropUpload}>
                <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                <p>Drag and drop images here or click to select</p>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} id="image-upload" />
                <label htmlFor="image-upload" className="upload-btn">Select Images</label>
              </div>
              {errors.images && <span className="error-text">{errors.images}</span>}
              <div className="photo-counter">{images.length}/10 images</div>
              <div className="upload-grid">
                {images.map((img, index) => (
                  <div key={index} className={`preview-item ${draggedIndex === index ? 'dragging' : ''}`} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDrop={(e) => handleDrop(e, index)} onDragEnd={handleDragEnd}>
                    <img src={img.preview} alt={`Preview ${index + 1}`} />
                    <button type="button" className="remove-btn" onClick={() => removeImage(index)}>×</button>
                    <div className="drag-handle">⋮⋮</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="parcel-size-section" ref={parcelSizeRef} style={{ cursor: 'default' }}>
              <h2>Select your parcel size</h2>
              <p className="parcel-recommended">Recommended</p>
              
              {errors.parcelSize && <span className="error-text" style={{display: 'block', marginBottom: '15px'}}>{errors.parcelSize}</span>}
              
              <div className="parcel-options" style={{ display: 'flex', gap: '15px' }}>
                <div className={`parcel-card ${parcelSize === '5kg' ? 'selected' : ''}`} onClick={() => setParcelSize('5kg')} style={{ cursor: 'pointer', flex: 1, padding: '20px', border: parcelSize === '5kg' ? '2px solid #007bff' : '1px solid #ccc' }}>
                  <h3 style={{ cursor: 'pointer' }}>Small / 5 kg</h3>
                  <p style={{ cursor: 'pointer' }}>For items that weigh about as much as a packed backpack.</p>
                </div>
                <div className={`parcel-card ${parcelSize === '10kg' ? 'selected' : ''}`} onClick={() => setParcelSize('10kg')} style={{ cursor: 'pointer', flex: 1, padding: '20px', border: parcelSize === '10kg' ? '2px solid #007bff' : '1px solid #ccc' }}>
                  <h3 style={{ cursor: 'pointer' }}>Medium / 10 kg</h3>
                  <p style={{ cursor: 'pointer' }}>For items that weigh about as much as a packed carry-on bag.</p>
                </div>
                <div className={`parcel-card ${parcelSize === '20kg' ? 'selected' : ''}`} onClick={() => setParcelSize('20kg')} style={{ cursor: 'pointer', flex: 1, padding: '20px', border: parcelSize === '20kg' ? '2px solid #007bff' : '1px solid #ccc' }}>
                  <h3 style={{ cursor: 'pointer' }}>Large / 20 kg</h3>
                  <p style={{ cursor: 'pointer' }}>For items that weigh about as much as a large packed suitcase.</p>
                </div>
                <div className={`parcel-card ${parcelSize === '30kg' ? 'selected' : ''}`} onClick={() => setParcelSize('30kg')} style={{ cursor: 'pointer', flex: 1, padding: '20px', border: parcelSize === '30kg' ? '2px solid #007bff' : '1px solid #ccc' }}>
                  <h3 style={{ cursor: 'pointer' }}> X-Large / 30 kg</h3>
                  <p style={{ cursor: 'pointer' }}>For items that weigh about as much as a dining table.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px' }}>
              <button type="submit" className={`btn-primary large ${!isFormValid ? 'disabled' : ''}`} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                Publish Ad
              </button>
              <button type="button" onClick={handleSaveDraft} className="btn-save-draft" style={{ color: "black", width: '100%', maxWidth: '150px', margin: '0 auto', backgroundColor: '#202020', color: 'var(--text-main)', border: '1px solid var(--accent, #ccc)', padding: '10px 16px', borderRadius: '100px', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem' }}>
                Save draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}