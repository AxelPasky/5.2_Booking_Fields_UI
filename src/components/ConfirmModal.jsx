import React from 'react';
import { useTranslation } from 'react-i18next';
import './ConfirmModal.css';

function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="modal-button cancel">
            {t('cancel')}
          </button>
          <button onClick={onConfirm} className="modal-button confirm">
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;