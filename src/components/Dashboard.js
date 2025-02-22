import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Static sample data with updated image URLs
  const sampleItems = [
    {
      _id: '1',
      itemName: 'Vintage Camera',
      currentBid: 150,
      endTime: '2024-03-01T18:00:00',
      image: 'https://picsum.photos/id/250/400/300', // Updated image URL
      bids: 12,
      isClosed: false
    },
    {
      _id: '2',
      itemName: 'Antique Watch',
      currentBid: 220,
      endTime: '2024-03-02T14:30:00',
      image: 'https://picsum.photos/id/175/400/300', // Updated image URL
      bids: 8,
      isClosed: false
    },
    {
      _id: '3',
      itemName: 'Modern Painting',
      currentBid: 450,
      endTime: '2024-02-28T12:00:00',
      image: 'https://picsum.photos/id/101/400/300', // Updated image URL
      bids: 15,
      isClosed: true
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    // For now use static data
    setItems(sampleItems);
    
    // Uncomment when backend is ready
    // const fetchItems = async () => {
    //   try {
    //     const res = await axios.get('http://localhost:5001/auctions');
    //     setItems(res.data);
    //   } catch (error) {
    //     console.error('Error fetching auctions:', error);
    //   }
    // };
    // fetchItems();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  const getTimeRemaining = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end - now;
    
    if (diff < 0) return 'Auction Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Auction Dashboard</h1>
        <div style={styles.buttonGroup}>
          <Link to="/post-auction" style={styles.link}>
            <button style={styles.primaryButton}>
              <span role="img" aria-label="add">➕</span> Post New Auction
            </button>
          </Link>
          <button 
            onClick={handleLogout} 
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={styles.auctionGrid}>
        {items.map((item) => (
          <div key={item._id} style={styles.auctionCard}>
            <img 
              src={item.image} 
              alt={item.itemName} 
              style={styles.itemImage}
            />
            <div style={styles.cardContent}>
              <h3 style={styles.itemName}>{item.itemName}</h3>
              <div style={styles.bidInfo}>
                <div style={styles.bidSection}>
                  <span style={styles.bidLabel}>Current Bid:</span>
                  <span style={styles.bidAmount}>${item.currentBid}</span>
                </div>
                <div style={styles.bidSection}>
                  <span style={styles.bidLabel}>Time Remaining:</span>
                  <span style={styles.timeRemaining}>
                    {getTimeRemaining(item.endTime)}
                  </span>
                </div>
                <div style={styles.bidSection}>
                  <span style={styles.bidLabel}>Total Bids:</span>
                  <span>{item.bids}</span>
                </div>
              </div>
              <button 
                style={{
                  ...styles.bidButton,
                  ...(item.isClosed ? styles.disabledButton : {})
                }}
                disabled={item.isClosed}
              >
                {item.isClosed ? 'Auction Closed' : 'Place Bid'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    color: '#2c3e50',
    fontSize: '2rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem'
  },
  primaryButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  auctionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem'
  },
  auctionCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  },
  itemImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '1.5rem'
  },
  itemName: {
    margin: '0 0 1rem 0',
    color: '#2c3e50'
  },
  bidInfo: {
    marginBottom: '1.5rem'
  },
  bidSection: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  bidLabel: {
    color: '#7f8c8d'
  },
  bidAmount: {
    color: '#27ae60',
    fontWeight: 'bold'
  },
  timeRemaining: {
    color: '#e67e22',
    fontWeight: 'bold'
  },
  bidButton: {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s'
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed'
  }
};

export default Dashboard;