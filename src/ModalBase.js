import React from 'react';

const Modal = ({ callback, openStatus, errorType, updateLoader }) => {
  const showHideClassName = openStatus ? "modal display-block" : "modal display-none";
  const closeModal = () => ( callback() )
  const reloadApp = () => ( window.location.reload() )

  const errorData = {
    'initial': { 
      action: reloadApp,
      buttonText: 'Reload',
      message: 'Oh no! Initial loading has failed. Please try again!'
    },
    'fetchPrefecture': {
      action: closeModal,
      buttonText: 'Close',
      message:  "Uh oh... We couldn't fetch that data. Sorry about that. Please try again."
    },
  }

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        { errorData[errorType].message }
        <button 
          className='button-basic'
          onClick={ errorData[errorType].action }>
          { errorData[errorType].buttonText }
        </button>
      </section>
    </div>
  );
};

export default Modal