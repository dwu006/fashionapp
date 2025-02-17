import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WardrobeGrid = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'tops', 'bottoms', 'outerwear', 'shoes', 'accessories', 'other'];

  useEffect(() => {
    const fetchWardrobeItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/wardrobe', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching wardrobe items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWardrobeItems();
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  if (loading) {
    return <div className="text-center py-8">Loading your wardrobe...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full max-w-xs p-2 border rounded-md shadow-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div key={item._id} className="relative group">
            <div className="aspect-square overflow-hidden rounded-lg shadow-md">
              <img
                src={`data:${item.image.contentType};base64,${Buffer.from(item.image.data).toString('base64')}`}
                alt={`Wardrobe item - ${item.category}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
              {item.category}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No items found in this category
        </div>
      )}
    </div>
  );
};

export default WardrobeGrid;