import React from 'react';

const Modal = ({ callback, openStatus, errorType }) => {
  const showHideClassName = openStatus ? "modal display-block" : "modal display-none";
  const closeModal = () => ( callback() )
  const reloadApp = () => ( window.location.reload() )

  const errorData = {
    'initial': { 
      action: reloadApp,
      buttonText: 'もう一度試す',
      message: 'アップロードできませんでした。'
    },
    'fetchPrefecture': {
      action: closeModal,
      buttonText: '閉じる',
      message:  "データを取得できませんでした。もう一度クリックしてください。"
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