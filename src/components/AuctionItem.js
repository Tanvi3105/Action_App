import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AuctionItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const [bid, setBid] = useState(0);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null); // State for image upload

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/auctions/${id}`);
        setItem(res.data);
      } catch (error) {
        setMessage('Error fetching auction item: ' + error.response?.data?.message || error.message);
        console.error(error);
      }
    };

    fetchItem();
  }, [id]);

  const handleBid = async () => {
    const username = prompt('Enter your username to place a bid:');

    if (bid <= item.currentBid) {
      setMessage('Bid must be higher than the current bid.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5001/bid/${id}`, { bid, username });
      setMessage(res.data.message);
      if (res.data.winner) {
        setMessage(`Auction closed. Winner: ${res.data.winner}`);
      }
    } catch (error) {
      setMessage('Error placing bid.');
      console.error(error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`http://localhost:5001/upload/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setItem({ ...item, image: res.data.imageUrl }); // Update item with new image URL
      setMessage('Image uploaded successfully!');
    } catch (error) {
      setMessage('Error uploading image.');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await axios.delete(`http://localhost:5001/auctions/${id}`);
        navigate('/dashboard');
      } catch (error) {
        setMessage('Error deleting auction.');
        console.error(error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{item.itemName}</h2>
      {item.image && (
        <img
          src={item.image}
          alt={item.itemName}
          style={styles.itemImage}
        />
      )}
      <p style={styles.description}>{item.description}</p>
      <div style={styles.bidInfo}>
        <p>Current Bid: <span style={styles.bidAmount}>${item.currentBid}</span></p>
        <p>Highest Bidder: <span style={styles.highestBidder}>{item.highestBidder || 'No bids yet'}</span></p>
      </div>
      <div style={styles.bidSection}>
        <input
          type="number"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          placeholder="Enter your bid"
          style={styles.bidInput}
        />
        <button onClick={handleBid} style={styles.bidButton}>
          Place Bid
        </button>
      </div>
      <div style={styles.imageUploadSection}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={styles.fileInput}
        />
        <button onClick={() => document.getElementById('fileInput').click()} style={styles.uploadButton}>
          Upload Image
        </button>
      </div>
      <button onClick={handleDelete} style={styles.deleteButton}>
        Delete Auction
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  itemImage: {
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '1.5rem',
  },
  description: {
    fontSize: '1.2rem',
    color: '#7f8c8d',
    marginBottom: '1.5rem',
  },
  bidInfo: {
    marginBottom: '1.5rem',
  },
  bidAmount: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  highestBidder: {
    color: '#e67e22',
    fontWeight: 'bold',
  },
  bidSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  bidInput: {
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    width: '200px',
  },
  bidButton: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
  imageUploadSection: {
    marginBottom: '1.5rem',
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#27ae60',
    },
  },
  deleteButton: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  },
  message: {
    marginTop: '1.5rem',
    color: '#e74c3c',
    fontSize: '1rem',
  },
};

export default AuctionItem;