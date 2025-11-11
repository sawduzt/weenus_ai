import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import './Onboarding.css';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  highlight?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Weenus AI!',
    description: 'A beautiful desktop app for chatting with local AI models. Let\'s take a quick tour to get you started.',
    position: 'bottom',
  },
  {
    id: 'sidebar',
    title: 'Sidebar Navigation',
    description: 'Click these icons to navigate between Chat, Model Library, and Settings. Your chat history appears in the Chat view.',
    highlight: 'sidebar',
    position: 'right',
  },
  {
    id: 'chat',
    title: 'Chat Interface',
    description: 'This is where you talk to AI models. Select a model from the dropdown, type your message, and press Enter to chat.',
    highlight: 'chat-input-area',
    position: 'top',
  },
  {
    id: 'models',
    title: 'Model Library',
    description: 'Go to the Model Library tab to download new AI models from Ollama or HuggingFace. Start with Mistral or Phi-3 for best performance!',
    position: 'bottom',
  },
  {
    id: 'settings',
    title: 'Smart Settings',
    description: 'Fine-tune how AI responds. Adjust Temperature for creativity, Max Tokens for response length, and more. Each model can have different settings!',
    position: 'bottom',
  },
  {
    id: 'status-bar',
    title: 'Performance Metrics',
    description: 'The status bar shows real-time performance: Connection status, Memory usage, GPU status, and Tokens/second (how fast the AI responds).',
    highlight: 'status-bar',
    position: 'top',
  },
  {
    id: 'tips',
    title: 'Pro Tips',
    description: 'Use lower Temperature (0.1) for facts, higher (1.8) for creativity. Keep 8GB+ RAM free for smooth operation. Download models before chatting!',
    position: 'bottom',
  },
  {
    id: 'done',
    title: 'All Set!',
    description: 'You\'re ready to chat! Go to the Chat tab, download a model from the Model Library, and start exploring. Have fun with Weenus AI!',
    position: 'bottom',
  },
];

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip?: () => void;
}

export function Onboarding({ isOpen, onClose, onSkip }: OnboardingProps): JSX.Element | null {
  const [currentStep, setCurrentStep] = useState(0);
  const step = ONBOARDING_STEPS[currentStep];
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  // Update highlight position
  useEffect(() => {
    if (step.highlight) {
      const element = document.querySelector(`.${step.highlight}`);
      if (element) {
        setHighlightRect(element.getBoundingClientRect());
      }
    } else {
      setHighlightRect(null);
    }
  }, [step, isOpen]);

  const handleNext = (): void => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = (): void => {
    setCurrentStep(0);
    onClose();
  };

  const handleSkip = (): void => {
    setCurrentStep(0);
    onSkip?.();
    onClose();
  };

  if (!isOpen) return null;

  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="onboarding-overlay">
      {/* Spotlight overlay */}
      {highlightRect && (
        <svg className="onboarding-spotlight" width="100%" height="100%">
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={highlightRect.left}
                y={highlightRect.top}
                width={highlightRect.width}
                height={highlightRect.height}
                fill="black"
                rx="8"
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.7)" mask="url(#spotlight-mask)" />
          <rect
            x={highlightRect.left}
            y={highlightRect.top}
            width={highlightRect.width}
            height={highlightRect.height}
            fill="none"
            stroke="rgb(236, 72, 153)"
            strokeWidth="2"
            rx="8"
          />
        </svg>
      )}

      {/* Tooltip */}
      <div 
        className={`onboarding-tooltip onboarding-tooltip--${step.position || 'bottom'}`}
        style={{
          ...(highlightRect && step.position === 'right' && {
            left: `${highlightRect.right + 20}px`,
            top: `${highlightRect.top}px`,
          }),
          ...(highlightRect && step.position === 'top' && {
            left: `${highlightRect.left + highlightRect.width / 2}px`,
            top: `${highlightRect.top - 20}px`,
            transform: 'translateX(-50%)',
          }),
          ...(highlightRect && step.position === 'bottom' && {
            left: `${highlightRect.left + highlightRect.width / 2}px`,
            top: `${highlightRect.bottom + 20}px`,
            transform: 'translateX(-50%)',
          }),
          ...(!highlightRect && {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }),
        }}
      >
        <button
          className="onboarding-close-btn"
          onClick={handleClose}
          aria-label="Close onboarding"
        >
          <X size={20} />
        </button>

        <h2 className="onboarding-title">{step.title}</h2>
        <p className="onboarding-description">{step.description}</p>

        <div className="onboarding-progress">
          <div className="onboarding-steps">
            {ONBOARDING_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`onboarding-step ${idx === currentStep ? 'onboarding-step--active' : ''} ${idx < currentStep ? 'onboarding-step--completed' : ''}`}
              />
            ))}
          </div>
          <span className="onboarding-step-count">
            {currentStep + 1} / {ONBOARDING_STEPS.length}
          </span>
        </div>

        <div className="onboarding-controls">
          <button
            className="onboarding-btn onboarding-btn--secondary"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          {currentStep === 0 ? (
            <button
              className="onboarding-btn onboarding-btn--secondary"
              onClick={handleSkip}
            >
              Skip Tour
            </button>
          ) : (
            <button
              className="onboarding-btn onboarding-btn--secondary"
              onClick={handleClose}
            >
              Exit
            </button>
          )}

          <button
            className="onboarding-btn onboarding-btn--primary"
            onClick={handleNext}
          >
            {isLastStep ? (
              'Done'
            ) : (
              <>
                Next
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
