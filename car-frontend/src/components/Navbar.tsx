// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// function Navbar() {
//     const [search, setSearch] = useState('');

//   const handleSearch = async (e:any) => {
//     e.preventDefault();
//     // Make an API call to search for products based on the search term
//     // Update state or redirect accordingly
//   };
//   return (
//     <nav style={{ padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
//     <ul style={{ display: 'flex', listStyle: 'none', gap: '10px' }}>
//       {/* <li><Link to="/" style={{ color: 'white' }}>Home</Link></li> */}
//       <li><Link to="/ProductCreatePage" style={{ color: 'white' }}>Create Product</Link></li>
//     </ul>
//     <form onSubmit={handleSearch}>
//       <input 
//         type="text" 
//         placeholder="Search Products" 
//         value={search}
//         onChange={(e) => setSearch(e.target.value)} 
//       />
//       <button type="submit">Search</button>
//     </form>
//   </nav>
//   );

// }

// export default Navbar