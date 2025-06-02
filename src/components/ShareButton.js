import { useState } from 'react';
import { FaShare } from 'react-icons/fa';

export default function ShareButton({ gameId }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}?gameId=${gameId}`
    ).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <button onClick={copyLink} className="share-button">
      <FaShare /> {isCopied ? 'Copied!' : 'Share Game'}
    </button>
  );
}
