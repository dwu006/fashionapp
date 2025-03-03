import React, { useState, useEffect } from 'react';
import axios from 'axios';

//connect to backend server
const axios2 = axios.create({
  baseURL: 'http://localhost:5000'
});

const MyWardrobe = ({ refreshTrigger }) => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['all', 'top', 'bottom', 'outerwear', 'shoes', 'accessories', 'other'];

  const fetchWardrobeItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view your wardrobe');
        return;
      }

      const response = await axios2.get('/wardrobe', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Fetched wardrobe items:', response.data);
      
      // Process the items to handle image data
      const processedItems = response.data.map(item => ({
        ...item,
        imageUrl: item.image ? `data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data.data)}` : null
      }));
      
      setItems(processedItems);
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
      setError(error.response?.data?.error || 'Failed to fetch wardrobe items');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert array buffer to base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    fetchWardrobeItems();
  }, [refreshTrigger]);

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleDeleteItem = async (itemId) => {
    // if (!window.confirm('Are you sure you want to delete this item?')) {
    //   return;
    // }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to delete items');
        return;
      }

      const response = await axios2.delete(`/wardrobe/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Delete response:', response.data);
      
      // Close modal
      setSelectedItem(null);
      
      // Refresh wardrobe items
      await fetchWardrobeItems();

    } catch (error) {
      console.error('Error deleting item:', error);
      alert(error.response?.data?.error || 'Failed to delete item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        color: '#666' 
      }}>
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        color: '#666' 
      }}>
        Loading your wardrobe...
      </div>
    );
  }

  return (
    <div className="my-wardrobe">
      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px',
        overflowX: 'auto',
        padding: '10px 20px',
        maxWidth: '100%',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          padding: '0 10px'
        }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedCategory === category ? '#4CAF50' : '#f0f0f0',
                color: selectedCategory === category ? 'white' : 'black',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s',
                fontSize: '14px',
                fontWeight: selectedCategory === category ? 'bold' : 'normal',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: 'fit-content'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '25px',
        padding: '20px 0',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        flex: 1
      }}>
        {filteredItems.map((item) => (
          <div
            key={item._id}
            onClick={() => handleItemClick(item)}
            style={{
              cursor: 'pointer',
              width: '180px',
              height: '180px',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              ':hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
              }
            }}
          >
            <img
              src={item.imageUrl}
              alt="Wardrobe item"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </div>

      {/* Modal for selected item */}
      {selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setSelectedItem(null)}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                border: 'none',
                background: 'none',
                color: 'white',
                fontSize: '28px',
                cursor: 'pointer',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ×
            </button>
            <div style={{
              width: '100%',
              height: '70vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px'
            }}>
              <img
                src={selectedItem.imageUrl}
                alt="Selected item"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </div>
            <button
              onClick={() => handleDeleteItem(selectedItem._id)}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#c82333'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#dc3545'}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWardrobe;
