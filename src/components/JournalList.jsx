import React, { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import JournalForm from './JournalForm';
import './JournalList.css';

const JournalList = ({ refresh }) => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingJournal, setEditingJournal] = useState(null);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await journalAPI.getAll();
      console.log('Fetched journals:', data); // Debug log
      setJournals(data);
    } catch (err) {
      setError('Failed to load journals. Please try again later.');
      console.error('Journal fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await journalAPI.delete(id);
        // Update local state immediately
        setJournals(prev => prev.filter(journal => journal.id !== id));
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                            'Failed to delete journal. Please try again.';
        setError(errorMessage);
        console.error('Delete error:', err);
        // If delete fails, refetch to ensure sync
        fetchJournals();
      }
    }
  };

  const handleFormSuccess = (journalData) => {
    console.log('Form success with data:', journalData); // Debug log
    
    setEditingJournal(null);
    
    if (journalData && journalData.id) {
      // We have valid journal data
      if (editingJournal && editingJournal.id !== 'new') {
        // Editing existing journal
        setJournals(prev => prev.map(j => 
          j.id === journalData.id ? { ...j, ...journalData } : j
        ));
      } else {
        // Creating new journal
        setJournals(prev => [journalData, ...prev]);
      }
    } else {
      // No valid data received, fallback to refetch
      console.log('No valid journal data received, refetching...');
      fetchJournals();
    }
  };

  return (
    <div className="journal-list">
      <div className="header-actions">
        <h1>My Journal Entries</h1>
        {!editingJournal && (
          <button 
            className="add-new"
            onClick={() => setEditingJournal({ id: 'new' })}
          >
            + Add New Entry
          </button>
        )}
      </div>

      {editingJournal && (
        <JournalForm
          journal={editingJournal}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingJournal(null)}
        />
      )}

      {loading && !editingJournal && (
        <div className="loading-state">
          <p>Loading journal entries...</p>
        </div>
      )}

      {error && !loading && !editingJournal && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchJournals}>Retry</button>
        </div>
      )}

      {!loading && !error && !editingJournal && (
        <div className="journals-container">
          {journals.length === 0 ? (
            <div className="empty-state">
              <p>No journal entries found.</p>
            </div>
          ) : (
            journals.map(journal => (
              <div key={journal.id} className="journal-card">
                <div className="journal-header">
                  <h3>{journal.title}</h3>
                  <span className={`sentiment ${journal.sentiment}`}>
                    {getSentimentEmoji(journal.sentiment)}
                  </span>
                </div>
                <p className="journal-content">{journal.content}</p>
                <div className="journal-footer">
                  <div className="journal-date">
                    {new Date(journal.date).toLocaleDateString()}
                  </div>
                  <div className="journal-actions">
                    <button
                      className="btn-edit"
                      onClick={() => setEditingJournal(journal)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(journal.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

function getSentimentEmoji(sentiment) {
  const emojis = {
    HAPPY: '😊',
    SAD: '😢',
    ANGRY: '😠',
    ANXIOUS: '😰',
  };
  return emojis[sentiment] || '';
}

export default JournalList;