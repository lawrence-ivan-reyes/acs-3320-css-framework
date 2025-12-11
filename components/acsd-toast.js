/*
notification manager with animations and auto-dismiss
 - attributes: position (top-right|top-left|bottom-right|bottom-left), duration
 - methods: show(message, variant), clear()
 - parts: container, toast, message, close
 - events: acsd-toast-show, acsd-toast-dismiss
 */
 class AcsdToast extends HTMLElement {
    static get observedAttributes() {
      return ['position', 'duration'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._id = 0;
      this._timers = new Map();
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            position: fixed;
            z-index: 10000;
            pointer-events: none;
          }
          
          :host([position="top-right"]), :host(:not([position])) {
            top: var(--space-lg, 1.5rem);
            right: var(--space-lg, 1.5rem);
          }
          :host([position="top-left"]) { top: var(--space-lg, 1.5rem); left: var(--space-lg, 1.5rem); }
          :host([position="bottom-right"]) { bottom: var(--space-lg, 1.5rem); right: var(--space-lg, 1.5rem); }
          :host([position="bottom-left"]) { bottom: var(--space-lg, 1.5rem); left: var(--space-lg, 1.5rem); }
          
          .container {
            display: flex;
            flex-direction: column-reverse;
            gap: var(--space-sm, 0.5rem);
          }
          
          :host([position^="top"]) .container { flex-direction: column; }
          
          .toast {
            pointer-events: auto;
            display: flex;
            align-items: center;
            gap: var(--space-md, 1rem);
            min-width: 280px;
            max-width: 400px;
            padding: var(--space-md, 1rem) var(--space-lg, 1.5rem);
            background: var(--color-surface, white);
            border-radius: var(--radius-lg, 1rem);
            border-left: 4px solid var(--_accent);
            box-shadow: var(--shadow-lg, 0 12px 24px rgba(0,0,0,0.15));
            animation: slideIn 300ms ease;
          }
          
          .toast.exiting { animation: slideOut 200ms ease forwards; }
          
          :host([position$="right"]) .toast, :host(:not([position])) .toast { --_dir: 100%; }
          :host([position$="left"]) .toast { --_dir: -100%; }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(var(--_dir, 100%)); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slideOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(var(--_dir, 100%)); }
          }
          
          .message {
            flex: 1;
            font-size: var(--font-sm, 0.875rem);
            font-weight: 500;
            color: var(--color-fg, #1a1a1a);
          }
          
          .close {
            width: 24px;
            height: 24px;
            border: none;
            background: transparent;
            color: var(--color-muted, #6b7280);
            font-size: 1.25rem;
            cursor: pointer;
            border-radius: var(--radius-sm, 0.375rem);
          }
          
          .close:hover {
            color: var(--color-fg, #1a1a1a);
            background: var(--color-border, #e5e5e5);
          }
        </style>
        <div class="container" part="container" role="alert" aria-live="polite"></div>
      `;
    }
  
    disconnectedCallback() {
      this._timers.forEach((t) => clearTimeout(t));
      this._timers.clear();
    }
  
    get duration() {
      return parseInt(this.getAttribute('duration')) || 4000;
    }
  
    show(message, variant = 'default') {
      const id = ++this._id;
      const colors = {
        default: 'var(--color-gray-1, #1a1a1a)',
        success: 'var(--color-success-4, #22c55e)',
        warning: 'var(--color-warning-3, #f59e0b)',
        danger: 'var(--color-danger-4, #ef4444)',
        info: 'var(--color-primary-4, #7c3aed)',
      };
  
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('part', 'toast');
      toast.dataset.id = id;
      toast.style.setProperty('--_accent', colors[variant] || colors.default);
      toast.innerHTML = `
        <span class="message" part="message">${message}</span>
        <button class="close" part="close" aria-label="Dismiss">×</button>
      `;
      toast.querySelector('.close').onclick = () => this._dismiss(id);
  
      this.shadowRoot.querySelector('.container').appendChild(toast);
  
      if (this.duration > 0) {
        this._timers.set(
          id,
          setTimeout(() => this._dismiss(id), this.duration)
        );
      }
  
      this.dispatchEvent(
        new CustomEvent('acsd-toast-show', {
          bubbles: true,
          composed: true,
          detail: { id, message, variant },
        })
      );
      return id;
    }
  
    _dismiss(id) {
      if (this._timers.has(id)) {
        clearTimeout(this._timers.get(id));
        this._timers.delete(id);
      }
  
      const toast = this.shadowRoot.querySelector(`[data-id="${id}"]`);
      if (toast) {
        toast.classList.add('exiting');
        toast.onanimationend = () => {
          toast.remove();
          this.dispatchEvent(
            new CustomEvent('acsd-toast-dismiss', {
              bubbles: true,
              composed: true,
              detail: { id },
            })
          );
        };
      }
    }
  
    clear() {
      this._timers.forEach((t) => clearTimeout(t));
      this._timers.clear();
      this.shadowRoot.querySelector('.container').innerHTML = '';
    }
  }
  
  customElements.define('acsd-toast', AcsdToast);
