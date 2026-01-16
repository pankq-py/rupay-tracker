import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="money-spinner">
        <div className="coin">💰</div>
        <div className="coin">💵</div>
        <div className="coin">💴</div>
        <div className="coin">💶</div>
        <div className="coin">💷</div>
      </div>
      <h2>Loading your expenses...</h2>
      <p>Counting your money 💸</p>
    </div>
  );
};

export default LoadingSpinner;
