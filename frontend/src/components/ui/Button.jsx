import '../../styles/Button.css'

function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim()
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
