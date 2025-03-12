import React, { useState, useEffect } from "react";
import axios from "axios";

// Connect to backend server
const axios2 = axios.create({
  baseURL: "http://localhost:5001",
});

const MyWardrobe = ({ refreshTrigger, selectedCategory }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWardrobeItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your wardrobe");
        return;
      }

      const response = await axios2.get("/wardrobe", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Process images
      const processedItems = response.data.map((item) => ({
        ...item,
        imageUrl: item.image
          ? `data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data.data)}`
          : null,
      }));

      setItems(processedItems);
    } catch (error) {
      console.error("Error fetching wardrobe items:", error);
      setError(error.response?.data?.error || "Failed to fetch wardrobe items");
    } finally {
      setLoading(false);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    fetchWardrobeItems();
  }, [refreshTrigger]);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to delete items.");
        return;
      }

      await axios2.delete(`/wardrobe/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(error.response?.data?.error || "Failed to delete item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category.toLowerCase() === selectedCategory);

  if (error) return <div className="error-message">{error}</div>;
  if (loading) return <div className="loading-text">Loading your wardrobe...</div>;

  return (
    <div className="wardrobe-grid">
      {filteredItems.length === 0 ? (
        <div className="no-items-message">There are no items in this category.</div>
      ) : (
        filteredItems.map((item) => (
          <div key={item._id} className="wardrobe-item">
            <img src={item.imageUrl} alt="Wardrobe item" />
            <button className="delete-button" onClick={() => handleDeleteItem(item._id)}>✖</button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyWardrobe;
