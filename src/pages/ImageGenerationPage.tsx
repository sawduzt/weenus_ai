/**
 * Image Generation Page Component
 * 
 * Interface for generating images using AI models.
 * This is a placeholder implementation for future development.
 */

import { Image as ImageIcon, Construction } from 'lucide-react';
import './ImageGenerationPage.css';

export function ImageGenerationPage(): JSX.Element {
  return (
    <div className="image-generation-page">
      <div className="page-header" style={{ padding: '8px 2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ flex: 1, paddingLeft: '10px' }}>
          <h1 
            style={{ 
              fontSize: '18px', 
              margin: '0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontWeight: '600',
            }}
          >
            <ImageIcon size={20} />
            Image Generation
          </h1>
        </div>
        
        <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-muted)', paddingRight: '140px' }}>Create stunning images with AI</p>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-icon"><Construction size={48} /></div>
        <h2>Image Generation Coming Soon</h2>
        <p>This feature is currently in development</p>
        
        <div className="planned-features">
          <h3>Planned Features:</h3>
          <ul>
            <li>— Multiple AI image models support</li>
            <li>— Advanced parameter controls</li>
            <li>— Custom image dimensions</li>
            <li>— Style presets and templates</li>
            <li>— Image gallery and management</li>
            <li>— Export in multiple formats</li>
            <li>— Batch generation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}