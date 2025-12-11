/*
interactive toggle switch with keyboard accessibility and custom events
 - attributes: checked, label, name, disabled
 - slots: (default) - custom label content
 - parts: track, thumb, label
 - events: acsd-toggle-change
 */
 class AcsdToggle extends HTMLElement {
    static get observedAttributes() {
      return ['checked', 'label', 'disabled'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._onClick = this._onClick.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-flex;
            align-items: center;
            gap: var(--space-sm, 0.5rem);
          }
          
          :host([disabled]) {
            opacity: 0.5;
            pointer-events: none;
          }
          
          .track {
            position: relative;
            width: 44px;
            height: 24px;
            background: var(--color-border, #e5e5e5);
            border-radius: var(--radius-full, 9999px);
            cursor: pointer;
            transition: background 150ms ease, box-shadow 150ms ease;
          }
          
          .track:focus-visible {
            outline: 2px solid var(--color-accent, #7c3aed);
            outline-offset: 2px;
          }
          
          .track[aria-checked="true"] {
            background: linear-gradient(135deg, var(--color-accent, #7c3aed), var(--color-primary-3, #6d28d9));
            box-shadow: 0 0 12px oklch(from var(--color-accent, #7c3aed) l c h / 0.4);
          }
          
          .thumb {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.1));
            transition: transform 150ms ease;
          }
          
          .track[aria-checked="true"] .thumb {
            transform: translateX(20px);
          }
          
          .label {
            font-size: var(--font-sm, 0.875rem);
            font-weight: 500;
            color: var(--color-fg, #1a1a1a);
            user-select: none;
          }
        </style>
        <div class="track" part="track" role="switch" tabindex="0" aria-checked="false">
          <div class="thumb" part="thumb"></div>
        </div>
        <span class="label" part="label"><slot></slot></span>
      `;
    }
  
    connectedCallback() {
      const track = this.shadowRoot.querySelector('.track');
      track.addEventListener('click', this._onClick);
      track.addEventListener('keydown', this._onKeyDown);
      this._update();
    }
  
    disconnectedCallback() {
      const track = this.shadowRoot.querySelector('.track');
      track.removeEventListener('click', this._onClick);
      track.removeEventListener('keydown', this._onKeyDown);
    }
  
    attributeChangedCallback() {
      this._update();
    }
  
    get checked() {
      return this.hasAttribute('checked');
    }
    set checked(v) {
      v ? this.setAttribute('checked', '') : this.removeAttribute('checked');
    }
  
    _onClick() {
      if (!this.hasAttribute('disabled')) this._toggle();
    }
  
    _onKeyDown(e) {
      if (
        !this.hasAttribute('disabled') &&
        (e.key === ' ' || e.key === 'Enter')
      ) {
        e.preventDefault();
        this._toggle();
      }
    }
  
    _toggle() {
      this.checked = !this.checked;
      this.dispatchEvent(
        new CustomEvent('acsd-toggle-change', {
          bubbles: true,
          composed: true,
          detail: {
            checked: this.checked,
            name: this.getAttribute('name') || '',
          },
        })
      );
    }
  
    _update() {
      const track = this.shadowRoot.querySelector('.track');
      const label = this.shadowRoot.querySelector('.label');
      if (!track) return;
  
      track.setAttribute('aria-checked', String(this.checked));
      track.setAttribute('tabindex', this.hasAttribute('disabled') ? '-1' : '0');
  
      // if no slot content, use label attribute
      const labelText = this.getAttribute('label');
      if (labelText && !this.querySelector('*')) {
        label.textContent = labelText;
      }
    }
  }
  
  customElements.define('acsd-toggle', AcsdToggle);
