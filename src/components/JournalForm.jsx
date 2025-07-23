import React, { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import './JournalForm.css';

const JournalForm = ({ journal, onSuccess, onCancel }) => {
  const isEditMode = !!journal?.id;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sentiment: 'HAPPY'
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when journal changes
  useEffect(() => {
    if (isEditMode && journal) {
      setFormData({
        title: journal.title || '',
        content: journal.content || '',
        sentiment: journal.sentiment || 'HAPPY'
      });
    } else {
      setFormData({ title: '', content: '', sentiment: 'HAPPY' });
    }
    setError('');
  }, [journal, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.content) {
        throw new Error('Title and content are required');
      }
      
      if (isEditMode) {
        await journalAPI.update(journal.id, formData);
      } else {
        await journalAPI.create(formData);
      }
      
      onSuccess?.();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="journal-form">
      <h2>{isEditMode ? 'Edit Journal Entry' : 'Create New Journal Entry'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(f => ({ ...f, content: e.target.value }))}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Mood</label>
          <select
            value={formData.sentiment}
            onChange={(e) => setFormData(f => ({ ...f, sentiment: e.target.value }))}
          >
            <option value="HAPPY">Happy 😊</option>
            <option value="SAD">Sad 😢</option>
            <option value="ANGRY">Angry 😠</option>
            <option value="ANXIOUS">Anxious 😰</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button 
          className="create-journal-btn"
            type="submit" 
            disabled={isSubmitting}
           
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : isEditMode ? (
              'Update Journal'
            ) : (
              'Create Journal'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalForm;