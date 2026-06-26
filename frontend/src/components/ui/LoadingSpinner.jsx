import '../../styles/LoadingSpinner.css'

function LoadingSpinner({ size = 'md' }) {
  return <div className={`spinner spinner--${size}`} />
}

export default LoadingSpinner
