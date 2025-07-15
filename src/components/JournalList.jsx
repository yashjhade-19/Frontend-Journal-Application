import React, { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import JournalForm from './JournalForm';
import './JournalList.css';

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const data = await journalAPI.getAll();
      setJournals(data);
    } catch (error) {
      setError('Failed to load journals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this journal?')) {
      try {
        await journalAPI.delete(id);
        setJournals(journals.filter(j => j._id !== id));
      } catch (error) {
        setError('Failed to delete journal');
      }
    }
  };

  const handleSuccess = () => {
    setEditingId(null);
    fetchJournals();
  };

  return (
    <div className="journal-list">
      {editingId === null && (
        <button 
          className="add-new"
          onClick={() => setEditingId('new')}
        >
          + Add New Journal
        </button>
      )}

      {editingId === 'new' && (
        <JournalForm journalId={null} onSuccess={handleSuccess} />
      )}

      {journals.map(journal => (
        <div key={journal._id} className="journal-card">
          {editingId === journal._id ? (
            <JournalForm 
              journalId={journal._id} 
              onSuccess={handleSuccess} 
            />
          ) : (
            <>
              <div className="journal-header">
                <h3>{journal.title}</h3>
                <span className={`sentiment ${journal.sentiment}`}>
                  {getSentimentEmoji(journal.sentiment)}
                </span>
              </div>
              
              <p className="journal-content">{journal.content}</p>
              
              <div className="journal-footer">
                <div className="journal-date">
                  {new Date(journal.date).toLocaleString()}
                </div>
                <div className="journal-actions">
                  <button 
                    onClick={() => setEditingId(journal._id)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(journal._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

function getSentimentEmoji(sentiment) {
  const emojis = {
    HAPPY: '😊',
    SAD: '😢',
    ANGRY: '😠',
    ANXIOUS: '😰'
  };
  return emojis[sentiment] || '';
}

export default JournalList;
