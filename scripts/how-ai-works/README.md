# How AI Works data generators

Offline scripts that produce the real-model data behind `how-ai-works/`. Run them outside the repo checkout (models download to `node_modules/@huggingface/transformers/.cache`, ~2.5 GB for Qwen fp32), then copy the JSON into `how-ai-works/data/`.

```bash
npm install
node nexttoken.mjs   # ~50 min on CPU → nexttoken.json
node post.mjs        # adds prompt token IDs → nexttoken.final.json
node post2.mjs       # re-decodes generated pieces so multi-byte (CJK) tokens aren't U+FFFD
node embed.mjs       # ~1 min → embeddings.json
cp nexttoken.final.json ../../how-ai-works/data/nexttoken.json
cp embeddings.json ../../how-ai-works/data/embeddings.json
```

After copying, bump the `?v=` stamp on the data fetches (and `lab.js`/`lab.css` if touched) so caches refresh.

## nexttoken.mjs
Model: `onnx-community/Qwen2.5-0.5B` (base, not instruction-tuned) with **`dtype: 'fp32'`**. The q8 weights are badly degraded; they rank " $" above " Paris" for "The capital of France is".

For each prompt in `PROMPTS` it samples rollouts at every temperature in `TEMPS` and stores a prefix trie of nodes: top-10 tokens `[piece, logit, id]`, the full-vocab log-sum-exp per temperature (so the page computes exact probabilities `exp(logit/T - lse_T)`), and the edges actually sampled. It also writes the trophy/suitcase pronoun probe used by the attention section. Changing `PROMPTS`, `TEMPS`, `SAMPLES` or `STEPS` is safe; the page reads them from the JSON.

## embed.mjs
Model: `Xenova/all-MiniLM-L6-v2`. It embeds the phrases in `GROUPS` plus the search `QUERIES`, projects them to 2D with a small built-in t-SNE, and stores the full cosine-similarity matrix. Queries are placed at the similarity-weighted centre of their three nearest items.
