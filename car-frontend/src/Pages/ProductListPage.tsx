import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

function ProductListPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
  
    
    const fetchCars = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${BACKEND_URL}/api/v1/products/my-cars`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setCars(response.data);
        } catch (error) {
          console.error('Failed to retrieve cars', error);
        }
        setLoading(false);
      };
  
      
    useEffect(() => {
        fetchCars();
     
    }, []);
  
    
    useEffect(() => {
      const searchCars = async () => {
        if (searchTerm) {
          try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/products/search`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              params: { keyword: searchTerm },
            });
            setCars(response.data);
          } catch (error) {
            console.error('Failed to search cars', error);
          }
        } else {
          
          await fetchCars();
        }
      };
  
      searchCars();
    }, [searchTerm]);
  
    
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };
  
    return (
      <div>
        
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '10px' }}>
          {/* <li><Link to="/" style={{ color: 'white' }}>Home</Link></li> */}
          <li><Link to="/products/create" style={{ color: 'white' }}>Create Product</Link></li>
        </ul>
          <input
            type="text"
            placeholder="Search by title, description, car type, dealer, or company..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ padding: '0.5rem', borderRadius: '4px', border: 'none' }}
          />
        </nav>
  
        {/* Cars list */}
        <div style={{ padding: '1rem' }}>
          {loading ? (
            <p>Loading...</p>
          ) : cars.length > 0 ? (
            cars.map((car) => (
              <div key={car.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
                <Link to={`/product/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{car.title}</h3>
                <p>{car.description}</p>
                <p>Car Type: {car.carType.name}</p>
                <p>Dealer: {car.dealer.name}</p>
                <p>Company: {car.company.name}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {car.images.map((image) => (
                    <img key={image.id} src={image.url} alt="Car" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                  ))}
                </div>
                </Link>
              </div>
              
            ))
          ) : (
            <p>No cars found.</p>
          )}
        </div>
      </div>
    );
}

export default ProductListPage;