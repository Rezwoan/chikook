import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';
import type { Recipe, RecipeStep } from '../data/recipes';
import { EXAMPLE_RECIPE_JSON } from '../data/recipes';

interface RecipeImportProps {
  onClose: () => void;
}

type ParseStatus = 'idle' | 'valid' | 'error';

// ── Validator ──────────────────────────────────────────────
function validateRecipe(raw: unknown): { ok: true; recipe: Recipe } | { ok: false; error: string } {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ok: false, error: 'Root must be a JSON object {}' };
  }
  const obj = raw as Record<string, unknown>;

  if (typeof obj.id !== 'string' || !obj.id.trim()) return { ok: false, error: '"id" must be a non-empty string' };
  if (typeof obj.name !== 'string' || !obj.name.trim()) return { ok: false, error: '"name" must be a non-empty string' };
  if (typeof obj.emoji !== 'string' || !obj.emoji.trim()) return { ok: false, error: '"emoji" must be a non-empty string' };
  if (typeof obj.description !== 'string') return { ok: false, error: '"description" must be a string' };
  if (!Array.isArray(obj.steps) || obj.steps.length === 0) return { ok: false, error: '"steps" must be a non-empty array' };

  const steps: RecipeStep[] = [];
  for (let i = 0; i < obj.steps.length; i++) {
    const s = obj.steps[i] as Record<string, unknown>;
    if (typeof s !== 'object' || s === null) return { ok: false, error: `Step ${i + 1} must be an object` };
    if (typeof s.id !== 'number') return { ok: false, error: `Step ${i + 1}: "id" must be a number` };
    if (typeof s.description !== 'string' || !s.description.trim()) return { ok: false, error: `Step ${i + 1}: "description" must be a non-empty string` };
    if (typeof s.emoji !== 'string' || !s.emoji.trim()) return { ok: false, error: `Step ${i + 1}: "emoji" must be a non-empty string` };
    const timerDuration = s.timerDuration !== undefined
      ? (typeof s.timerDuration === 'number' ? s.timerDuration : -1)
      : undefined;
    if (timerDuration === -1) return { ok: false, error: `Step ${i + 1}: "timerDuration" must be a number (seconds) if provided` };
    steps.push({
      id: s.id as number,
      description: s.description as string,
      emoji: s.emoji as string,
      timerDuration: timerDuration,
    });
  }

  return {
    ok: true,
    recipe: {
      id: obj.id as string,
      name: obj.name as string,
      emoji: obj.emoji as string,
      description: obj.description as string,
      steps,
    },
  };
}

// ── Component ─────────────────────────────────────────────
const RecipeImport: React.FC<RecipeImportProps> = ({ onClose }) => {
  const { importRecipe, recipes } = useRecipeStore();
  const [json, setJson] = useState('');
  const [status, setStatus] = useState<ParseStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [preview, setPreview] = useState<Recipe | null>(null);
  const [showExample, setShowExample] = useState(false);

  const handleParse = () => {
    try {
      const parsed = JSON.parse(json);
      const result = validateRecipe(parsed);
      if (result.ok) {
        setStatus('valid');
        setPreview(result.recipe);
        setErrorMsg('');
      } else {
        setStatus('error');
        setErrorMsg(result.error);
        setPreview(null);
      }
    } catch (e) {
      setStatus('error');
      setErrorMsg('Invalid JSON — check for missing commas, brackets, or quotes.');
      setPreview(null);
    }
  };

  const handleImport = () => {
    if (!preview) return;
    importRecipe(preview);
    onClose();
  };

  const idConflict = preview ? recipes.some((r) => r.id === preview.id) : false;
  const timerCount = preview?.steps.filter((s) => s.timerDuration && s.timerDuration > 0).length ?? 0;

  return (
    <motion.div
      className="import-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="import-modal"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      >
        {/* Header */}
        <div className="import-header">
          <div className="import-header-text">
            <Upload size={20} />
            <h2>Import Recipe</h2>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} className="close-btn" onClick={onClose} aria-label="Close">
            <X />
          </motion.button>
        </div>

        {/* Example toggle */}
        <button
          className="example-toggle"
          onClick={() => setShowExample((v) => !v)}
          type="button"
        >
          <span>Show JSON format example</span>
          {showExample ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showExample && (
          <motion.div
            className="example-block"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="example-label">
              Example — copy &amp; modify to write your own recipe:
            </div>
            <pre className="example-json">{EXAMPLE_RECIPE_JSON}</pre>
            <div className="example-fields">
              <div className="field-row"><code className="field-key">"id"</code> <span>Unique string (e.g. "my-pasta-001")</span></div>
              <div className="field-row"><code className="field-key">"name"</code> <span>Display name of the dish</span></div>
              <div className="field-row"><code className="field-key">"emoji"</code> <span>Single emoji for the recipe card</span></div>
              <div className="field-row"><code className="field-key">"description"</code> <span>Short description shown on the card</span></div>
              <div className="field-row"><code className="field-key">"steps"</code> <span>Array of step objects (see below)</span></div>
              <div className="field-row nested"><code className="field-key">"id"</code> <span>Step number (integer)</span></div>
              <div className="field-row nested"><code className="field-key">"emoji"</code> <span>Emoji icon for the step</span></div>
              <div className="field-row nested"><code className="field-key">"description"</code> <span>What to do in this step</span></div>
              <div className="field-row nested"><code className="field-key">"timerDuration"</code> <span>Seconds for the timer — omit if no timer</span></div>
            </div>
          </motion.div>
        )}

        {/* Paste area */}
        <div className="import-body">
          <label className="import-label">Paste your recipe JSON below:</label>
          <textarea
            className={`import-textarea${status === 'error' ? ' error' : status === 'valid' ? ' valid' : ''}`}
            value={json}
            onChange={(e) => { setJson(e.target.value); setStatus('idle'); setPreview(null); }}
            placeholder={'{\n  "id": "my-recipe",\n  "name": "My Recipe",\n  ...\n}'}
            rows={12}
            spellCheck={false}
          />

          {/* Status feedback */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="import-status error"
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {status === 'valid' && preview && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="import-preview"
            >
              <div className="import-status valid">
                <CheckCircle size={16} />
                <span>Valid recipe! Ready to import.</span>
              </div>
              <div className="preview-card">
                <span className="preview-emoji">{preview.emoji}</span>
                <div className="preview-info">
                  <strong>{preview.name}</strong>
                  <p>{preview.description}</p>
                  <div className="preview-meta">
                    <span>{preview.steps.length} steps</span>
                    {timerCount > 0 && <span>· {timerCount} timer{timerCount !== 1 ? 's' : ''}</span>}
                    {idConflict && <span className="preview-overwrite">⚠ Will overwrite existing recipe with same ID</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <div className="import-actions">
          <motion.button whileTap={{ scale: 0.95 }} className="import-parse-btn" onClick={handleParse} disabled={!json.trim()}>
            Validate JSON
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="import-save-btn"
            onClick={handleImport}
            disabled={status !== 'valid' || !preview}
          >
            <Upload size={16} />
            {idConflict ? 'Update Recipe' : 'Save Recipe'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecipeImport;
