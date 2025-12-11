/*
display user avatar with initials, status indicators, and size variants
 - attributes: name, src, size (sm|md|lg|xl), status (online|offline|busy|away), ring
 - slots: fallback - custom content when no image
 - parts: container, image, status
 */
 class AcsdAvatar extends HTMLElement {
    static get observedAttributes() {
      return ['name', 'src', 'size', 'status', 'ring'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --_size: 44px;
            --_font: 1rem;
            --_status: 10px;
            display: inline-block;
          }
          :host([size="sm"]) { --_size: 32px; --_font: 0.75rem; --_status: 8px; }
          :host([size="lg"]) { --_size: 64px; --_font: 1.25rem; --_status: 14px; }
          :host([size="xl"]) { --_size: 96px; --_font: 1.75rem; --_status: 18px; }
          
          :host([ring]) .image {
            box-shadow: 0 0 0 3px var(--color-surface, white),
                        0 0 0 5px var(--color-accent, #7c3aed);
          }
          
          .avatar {
            position: relative;
            width: var(--_size);
            height: var(--_size);
          }
          
          .image {
            width: 100%;
            height: 100%;
            border-radius: var(--radius-full, 9999px);
            background: var(--_bg, oklch(0.65 0.15 220));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: var(--_font);
            font-family: var(--font-sans, system-ui);
            box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.1));
            transition: transform 200ms ease, box-shadow 200ms ease;
          }
          
          .avatar:hover .image {
            transform: scale(1.05);
            box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.1));
          }
          
          .image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: var(--radius-full, 9999px);
          }
          
          .status {
            position: absolute;
            bottom: 0;
            right: 0;
            width: var(--_status);
            height: var(--_status);
            border-radius: 50%;
            border: 2px solid var(--color-surface, white);
          }
          
          .status[data-status="online"] { background: var(--color-success-4, #22c55e); }
          .status[data-status="offline"] { background: var(--color-gray-4, #9ca3af); }
          .status[data-status="busy"] { background: var(--color-danger-4, #ef4444); }
          .status[data-status="away"] { background: var(--color-warning-3, #f59e0b); }
        </style>
        <div class="avatar" part="container">
          <div class="image" part="image">
            <span class="initials"></span>
            <slot name="fallback"></slot>
          </div>
          <div class="status" part="status" hidden></div>
        </div>
      `;
    }
  
    connectedCallback() {
      this._update();
    }
    attributeChangedCallback() {
      this._update();
    }
  
    _update() {
      const image = this.shadowRoot.querySelector('.image');
      const initials = this.shadowRoot.querySelector('.initials');
      const status = this.shadowRoot.querySelector('.status');
      if (!image) return;
  
      const name = this.getAttribute('name') || '';
      const src = this.getAttribute('src');
      const statusVal = this.getAttribute('status');
  
      // generate color from name
      let hash = 0;
      for (let i = 0; i < name.length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      image.style.setProperty(
        '--_bg',
        `oklch(0.65 0.15 ${Math.abs(hash % 360)})`
      );
  
      // handle image or initials
      const existingImg = image.querySelector('img');
      if (existingImg) existingImg.remove();
  
      if (src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = name;
        image.insertBefore(img, initials);
        initials.textContent = '';
      } else {
        const parts = name.trim().split(/\s+/);
        initials.textContent =
          parts.length > 1
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : (parts[0]?.[0] || '').toUpperCase();
      }
  
      // handle status
      status.hidden = !statusVal;
      if (statusVal) status.dataset.status = statusVal;
    }
  }
  
  customElements.define('acsd-avatar', AcsdAvatar);
