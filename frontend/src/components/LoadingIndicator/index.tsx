import searchSpinner from '../../assets/Spinner-1s-200px.gif';
import "./LoadingIndicator.css";


export const LoadingIndicator = () => {
    return (
        <div className='loader-container'>
            <img
                src={searchSpinner}
                alt="searching"
                height="75"
                className="loader-indicator"
            />
        </div>
    );
};

export default LoadingIndicator;