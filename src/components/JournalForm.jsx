import React, { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import './JournalForm.css';

const JournalForm = ({ journalId, onSuccess }) => {
  const isEditMode = journalId && journalId !== 'new';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sentiment: 'HAPPY'
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load journal data for editing
  useEffect(() => {
    if (isEditMode) {
      const fetchJournal = async () => {
        try {
          const data = await journalAPI.getById(journalId);
          setFormData({
            title: data.title || '',
            content: data.content || '',
            sentiment: data.sentiment || 'HAPPY'
          });
        } catch (err) {
          setError('Failed to load journal data.');
        }
      };
      fetchJournal();
    }
  }, [journalId, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.content) {
        throw new Error('Title and content are required');
      }

      if (isEditMode) {
        await journalAPI.update(journalId, formData);
      } else {
        await journalAPI.create(formData);
      }

      if (typeof onSuccess === 'function') onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="journal-form">
      <h2>{isEditMode ? 'Edit Journal' : 'New Journal'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Mood</label>
          <select
            value={formData.sentiment}
            onChange={(e) =>
              setFormData({ ...formData, sentiment: e.target.value })
            }
          >
            <option value="HAPPY">Happy 😊</option>
            <option value="SAD">Sad 😢</option>
            <option value="ANGRY">Angry 😠</option>
            <option value="ANXIOUS">Anxious 😰</option>
          </select>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Journal' : 'Create Journal'}
        </button>
      </form>
    </div>
  );
};

export default JournalForm;
