import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubscribersManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [newSubscriber, setNewSubscriber] = useState({ walletAddress: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/subscribers');
      if (response.data && response.data.length > 0) {
        setSubscribers(response.data);
      } else {
        setSubscribers([]); // If no subscribers, set it to an empty array
        setSuccessMessage('No subscribers added yet.');
      }
    } catch (err) {
      setError('Failed to fetch subscribers.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubscriber((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddSubscriber = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/subscribers/add', newSubscriber);
      if (response.data) {
        setSuccessMessage('Subscriber added successfully!');
        setNewSubscriber({ walletAddress: '', name: '' }); // Reset form
        fetchSubscribers(); // Refresh subscribers list
      }
    } catch (err) {
      setError('Failed to add subscriber.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/subscribers/${id}`);
      fetchSubscribers(); // Refresh subscribers list
    } catch (err) {
      setError('Failed to delete subscriber.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Manage Subscribers</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
      {/* Form to add a new subscriber */}
      <div className="form-div">
        <input
          type="text"
          name="walletAddress"
          placeholder="Wallet Address"
          value={newSubscriber.walletAddress}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Name (Optional)"
          value={newSubscriber.name}
          onChange={handleInputChange}
        />
        <button onClick={handleAddSubscriber} disabled={loading}>
          {loading ? 'Adding...' : 'Add Subscriber'}
        </button>
      </div>

      {/* Table to display subscribers */}
      {subscribers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Wallet Address</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber._id}>
                <td>{subscriber.walletAddress}</td>
                <td>{subscriber.name}</td>
                <td>
                  <button onClick={() => handleDeleteSubscriber(subscriber._id)} disabled={loading}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No subscribers added yet.</p> // Message when no subscribers are available
      )}
    </div>
  );
};

export default SubscribersManagement;
