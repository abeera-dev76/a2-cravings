import React from 'react';

/**
 * Reusable Button component for A2 CRAVINGS
 * @param {'primary' | 'secondary' | 'outline' | 'whatsapp'} variant
 * @param {'sm' | 'md' | 'lg'} size
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  target,
  rel,
  className = '',
  icon,
  type = 'button',
  ariaLabel,
  ...rest
}) => {
  const baseClasses = `btn btn-${variant} btn-${size} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        onClick={onClick}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        aria-label={ariaLabel}
        {...rest}
      >
        {icon && <span className="btn-icon">{icon}</span>}
        <span className="btn-text">{children}</span>
      </a>
    );
  }

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      aria-label={ariaLabel}
      {...rest}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
