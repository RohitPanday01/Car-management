import  { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';


function ProductCreatePage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [carTypeName, setCarTypeName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [dealerName, setDealerName] = useState('');
    const [images, setImages] = useState<File[]>([]);
  
    const handleSubmit = async (e:any ) => {
      e.preventDefault();
      if (images.length > 10) {
        alert('You can only upload up to 10 images.');
        return;
      }
  
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/v1/products/add`,
          { title, description, carTypeName, companyName, dealerName, images },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        console.log('Car added successfully:', response.data);
      } catch (error) {
        console.error('Failed to add car', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="Car Type" value={carTypeName} onChange={(e) => setCarTypeName(e.target.value)} />
        <input type="text" placeholder="Company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <input type="text" placeholder="Dealer" value={dealerName} onChange={(e) => setDealerName(e.target.value)} />
        <input type="file" multiple onChange={(e) => setImages([...images, ...Array.from(e.target.files as FileList)])} />
        <button type="submit">Add Car</button>
      </form>
    );
}

export default ProductCreatePage;