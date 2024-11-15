import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';



interface Car {
    id: string;
    title: string;
    description: string;
    images: { id: string; url: string }[];
    carType: { name: string };
    dealer: { name: string };
    company: { name: string };
  }
      
function ProductDetailPage() {
    const [car, setCar] = useState<Car | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [carTypeName, setCarTypeName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [dealerName, setDealerName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = response.data;
        setCar(data);
        setTitle(data.title);
        setDescription(data.description);
        setCarTypeName(data.carTypeName);
        setCompanyName(data.companyName);
        setDealerName(data.dealerName);
        setExistingImages(data.images);
      } catch (error) {
        console.error('Failed to fetch car details', error);
      }
    };

    fetchCar();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (images.length + selectedFiles.length + existingImages.length > 10) {
      alert('You can only upload up to 10 images.');
      return;
    }
    setImages([...images, ...selectedFiles]);
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter((img) => img !== imageUrl));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('carTypeName', carTypeName);
    formData.append('companyName', companyName);
    formData.append('dealerName', dealerName);
    
    // Add new images to form data
    images.forEach((image) => formData.append('images', image));
    

    formData.append('existingImages', JSON.stringify(existingImages));

    try {
      const response = await axios.put(`${BACKEND_URL}/api/v1/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setCar(response.data);
      alert('Car updated successfully!');
    } catch (error) {
      console.error('Failed to update car', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/products');
    } catch (error) {
      console.error('Failed to delete car', error);
    }
  };

  if (!car) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Car</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input type="text" value={carTypeName} onChange={(e) => setCarTypeName(e.target.value)} placeholder="Car Type" />
      <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company" />
      <input type="text" value={dealerName} onChange={(e) => setDealerName(e.target.value)} placeholder="Dealer" />
      
      <h3>Existing Images</h3>
      <div>
        {existingImages.map((img) => (
          <div key={img}>
            <img src={img} alt="Car" style={{ width: '100px' }} />
            <button onClick={() => handleRemoveExistingImage(img)}>Remove</button>
          </div>
        ))}
      </div>
      
      <h3>Upload New Images</h3>
      <input type="file" multiple onChange={handleImageChange} />
      
      <button onClick={handleUpdate}>Save Changes</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default ProductDetailPage;