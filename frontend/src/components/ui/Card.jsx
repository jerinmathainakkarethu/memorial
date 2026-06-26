import '../../styles/Card.css'

function Card({ children, className = '', onClick, ...props }) {
  const classes = `card ${className}`.trim()
  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

function CardHeader({ children, className = '' }) {
  return <div className={`card__header ${className}`}>{children}</div>
}

function CardBody({ children, className = '' }) {
  return <div className={`card__body ${className}`}>{children}</div>
}

function CardFooter({ children, className = '' }) {
  return <div className={`card__footer ${className}`}>{children}</div>
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
